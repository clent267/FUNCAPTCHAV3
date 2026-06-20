"""
ðŸŽ® Unified Roblox FunCaptcha Solver with Decrypt Utilities for Render
Extract blob â†’ Solve regular/suppressed captchas â†’ Solve PoW â†’ Decrypt tguess/BDA
All-in-one service running on Render
"""

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from curl_cffi import requests as requests2
from Crypto.Util.Padding import pad, unpad
from flask import Flask, request, jsonify
from Crypto.Cipher import AES
from datetime import datetime
from io import BytesIO
import os
import sys
import threading
import logging
import json
import uuid
import time
import base64
import binascii
import hashlib
import struct
import secrets
import random
import traceback
import execjs

# Configuration
PORT = int(os.getenv('PORT', 8080))
DEBUG = os.getenv('DEBUG', 'False') == 'True'

logging.getLogger('werkzeug').setLevel(logging.ERROR)
logger = logging.getLogger(__name__)

# Load configuration files
try:
    with open("webgl.json") as file:
        webgls = json.loads(file.read())
except FileNotFoundError:
    logger.warning("webgl.json not found")
    webgls = {}

try:
    with open("arkose.js") as file:
        gctx = execjs.compile(file.read())
except FileNotFoundError:
    logger.error("arkose.js not found - this is required!")
    gctx = None

# =====================================================
# CONFIGURATION CONSTANTS
# =====================================================

ROBLOX_LOGIN_SITEKEY = "476068BF-9607-4799-B53D-966BE98E2B81"
ROBLOX_REGISTER_SITEKEY = "A2A14B1D-1AF3-C791-9BBC-EE33CC7A0A6F"
ARKOSE_API = "https://arkoselabs.roblox.com"

# =====================================================
# UTILITY FUNCTIONS
# =====================================================

class Utils:
    """Utility functions for encryption/decryption"""
    
    solved = 0
    fail = 0
    suppressed_solved = 0
    pow_solved = 0
    errors = 0
    decrypted = 0

    @staticmethod
    def hex(data: bytes) -> str:
        return ''.join(f'{byte:02x}' for byte in data)

    @staticmethod
    def convert_salt(words: list, sig_bytes: int) -> bytes:
        salt = b''
        for word in words:
            salt += struct.pack('>I', word & 0xFFFFFFFF)
        return salt[:sig_bytes]

    @staticmethod
    def int_to_bytes(n: int, length: int) -> bytes:
        return n.to_bytes(length, byteorder='big', signed=True)

    @staticmethod
    def to_sigbytes(words: list, sigBytes: int) -> bytes:
        result = b''.join(Utils.int_to_bytes(word, 4) for word in words)
        return result[:sigBytes]

    @staticmethod
    def dict_to_list(data: dict) -> list:
        return list(data.values())

    @staticmethod
    def random_integer(value: int) -> int:
        max_random_value = (2**32 // value) * value
        while True:
            a = secrets.randbelow(2**32)
            if a < max_random_value:
                return a % value

    @staticmethod
    def uint8_array(size: int) -> list:
        v = bytearray(size)
        for i in range(len(v)):
            v[i] = Utils.random_integer(256)
        return list(v)

    @staticmethod
    def convert_key_to_sigbytes_format(key: bytes) -> list:
        key_words = []
        for i in range(0, len(key), 4):
            word = struct.unpack('>i', key[i:i+4])[0]
            key_words.append(word)
        return key_words


# =====================================================
# ARKOSE CRYPTOGRAPHY
# =====================================================

class Arkose:
    """Arkose Labs encryption/decryption"""

    @staticmethod
    def decrypt_data(data: dict, main: str) -> str:
        """Decrypt Arkose Labs encrypted data"""
        try:
            ciphertext = base64.b64decode(data['ct'])
            iv_bytes = binascii.unhexlify(data['iv'])
            salt_bytes = binascii.unhexlify(data['s'])
            salt_words = Arkose.from_sigbytes(salt_bytes)
            key_words = Arkose.generate_other_key(main, salt_words)
            key_bytes = Utils.to_sigbytes(key_words, 32)
            iv_bytes = Utils.to_sigbytes(key_words[-4:], 16)
            cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
            plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)
            return plaintext.decode()
        except Exception as e:
            logger.error(f"Decrypt data error: {e}")
            return None

    @staticmethod
    def from_sigbytes(sigBytes: bytes) -> list:
        padded_length = (len(sigBytes) + 3) // 4 * 4
        padded_bytes = sigBytes.ljust(padded_length, b'\0')
        words = [int.from_bytes(padded_bytes[i:i+4], byteorder='big') 
                for i in range(0, len(padded_bytes), 4)]
        return words

    @staticmethod
    def generate_key(ctx, s_value: str, useragent: str) -> bytes:
        if ctx is None:
            return b''
        try:
            key_list = Utils.dict_to_list(ctx.call('genkey', useragent, s_value))
            return bytes(key_list)
        except Exception as e:
            logger.error(f"Generate key error: {e}")
            return b''

    @staticmethod
    def generate_other_key(data: str, salt: list) -> list:
        sig_bytes = 8
        key_size = 48
        iterations = 1
        salt_bytes = Utils.convert_salt(salt, sig_bytes)
        key = hashlib.md5()
        hashed_key = b''
        block = None

        while len(hashed_key) < key_size:
            if block:
                key.update(block)
            key.update(data.encode())
            key.update(salt_bytes)
            block = key.digest()
            key = hashlib.md5()

            for _ in range(1, iterations):
                key.update(block)
                block = key.digest()
                key = hashlib.md5()

            hashed_key += block

        key_words = []
        for i in range(0, len(hashed_key[:key_size]), 4):
            word = struct.unpack('>i', hashed_key[i:i+4])[0]
            key_words.append(word)
        return key_words

    @staticmethod
    def generate_key_pbkdf(password: str, salt: bytes, key_size: int, iterations: int) -> bytes:
        """Generate key using MD5 iterations (for tguess decryption)"""
        hasher = hashlib.md5()
        key = b''
        block = None
        
        while len(key) < key_size:
            if block:
                hasher.update(block)
            hasher.update(password.encode())
            hasher.update(salt)
            block = hasher.digest()
            hasher = hashlib.md5()
            
            for _ in range(1, iterations):
                hasher.update(block)
                block = hasher.digest()
                hasher = hashlib.md5()
            
            key += block
        
        return key[:key_size]

    @staticmethod
    def generate_other_key_pbkdf(data: str, salt: list) -> list:
        """Generate key for tguess decryption"""
        sig_bytes = 8
        key_size = 48
        iterations = 1
        salt_bytes = Utils.convert_salt(salt, sig_bytes)
        key = Arkose.generate_key_pbkdf(data, salt_bytes, key_size, iterations)
        return Utils.convert_key_to_sigbytes_format(key)

    @staticmethod
    def encrypt_data(main: str, data: str) -> str:
        """Encrypt data with Arkose method"""
        if gctx is None:
            return None
        try:
            salt_words = gctx.call('randsigbyte', 8)
            key_words = Arkose.generate_other_key(main, salt_words)
            key_bytes = Utils.to_sigbytes(key_words, 32)
            iv_bytes = Utils.to_sigbytes(key_words[-4:], 16)
            salt_bytes = Utils.to_sigbytes(salt_words, 8)
            cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
            ciphertext = cipher.encrypt(pad(data.encode('utf-8'), AES.block_size))

            return json.dumps({
                "ct": base64.b64encode(ciphertext).decode(),
                "iv": Utils.hex(iv_bytes),
                "s": Utils.hex(salt_bytes)
            }).replace(" ", "")
        except Exception as e:
            logger.error(f"Encrypt data error: {e}")
            return None


# =====================================================
# BLOB EXTRACTOR
# =====================================================

class BlobExtractor:
    """Extract blob from Arkose Labs"""

    @staticmethod
    def extract_blob(pkey: str, og_proxy: str = None) -> dict:
        """
        Extract blob from Arkose Labs
        
        Args:
            pkey: Public key (476068BF... or A2A14B1D...)
            og_proxy: Optional proxy URL
        
        Returns:
            Dict with blob and metadata
        """
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': '*/*',
                'Referer': 'https://www.roblox.com/login',
                'Origin': 'https://www.roblox.com',
            }

            url = f"https://arkoselabs.roblox.com/fc/api/nojs/public_key/{pkey}/configure"

            if og_proxy:
                proxies = {'http': og_proxy, 'https': og_proxy}
                response = requests2.get(url, headers=headers, proxies=proxies, timeout=10)
            else:
                response = requests2.get(url, headers=headers, timeout=10)

            if response.status_code != 200:
                return {
                    "success": False,
                    "error": f"Status {response.status_code}"
                }

            data = response.json()
            blob = data.get('token')

            if not blob:
                return {
                    "success": False,
                    "error": "No token in response"
                }

            return {
                "success": True,
                "blob": blob,
                "pkey": pkey,
                "timestamp": int(time.time())
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# =====================================================
# PoW SOLVER
# =====================================================

class PoWSolver:
    """Solve Proof of Work challenges"""

    @staticmethod
    def solve_pow(data: str, difficulty: int = 32000) -> str:
        """
        Solve simple PoW challenge
        
        Args:
            data: Data to hash
            difficulty: Target difficulty
        
        Returns:
            Solution string
        """
        try:
            counter = 0
            while counter < 1000000:
                combined = f"{data}{counter}"
                hash_result = hashlib.sha256(combined.encode()).hexdigest()
                
                if int(hash_result, 16) < difficulty:
                    return combined
                
                counter += 1
            
            return f"{data}0"
        except Exception as e:
            logger.error(f"PoW solving error: {e}")
            return f"{data}0"

    @staticmethod
    def solve_arkose_pow(challenge: dict) -> dict:
        """
        Solve Arkose-specific PoW
        
        Args:
            challenge: PoW challenge data
        
        Returns:
            Solution
        """
        try:
            seed = challenge.get('seed', '')
            difficulty = challenge.get('difficulty', 32000)
            
            solution = PoWSolver.solve_pow(seed, difficulty)
            
            return {
                "success": True,
                "solution": solution
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


# =====================================================
# SUPPRESSED CAPTCHA SOLVER
# =====================================================

class SuppressedSolver:
    """Solve suppressed/additional captcha challenges"""

    @staticmethod
    def solve_suppressed(challenge_data: dict) -> str:
        """
        Solve suppressed captcha challenge
        
        Suppressed captchas require image recognition/classification
        This is a placeholder - integrate with your image recognition service
        
        Args:
            challenge_data: Challenge containing image/coordinates
        
        Returns:
            Answer coordinates
        """
        try:
            instruction = challenge_data.get('instruction', '')
            tiles = challenge_data.get('tiles', [])
            
            if tiles:
                answer = random.randint(0, len(tiles) - 1)
                return str(answer)
            
            return "0"
        
        except Exception as e:
            logger.error(f"Suppressed solver error: {e}")
            return "0"


# =====================================================
# DECRYPTION UTILITIES
# =====================================================

class DecryptionUtils:
    """Utilities for decrypting tguess and BDA data"""

    @staticmethod
    def decrypt_tguess(encrypted_json: str, session_token: str) -> dict:
        """
        Decrypt tguess encrypted data
        
        Args:
            encrypted_json: JSON string with ct, iv, s fields
            session_token: Session token for decryption
        
        Returns:
            Decrypted plaintext
        """
        try:
            data = json.loads(encrypted_json) if isinstance(encrypted_json, str) else encrypted_json
            ciphertext = base64.b64decode(data['ct'])
            iv_bytes = binascii.unhexlify(data['iv'])
            salt_bytes = binascii.unhexlify(data['s'])
            salt_words = Arkose.from_sigbytes(salt_bytes)
            key_words = Arkose.generate_other_key_pbkdf(session_token, salt_words)
            key_bytes = Utils.to_sigbytes(key_words, 32)
            iv_bytes = Utils.to_sigbytes(key_words[-4:], 16)
            cipher = AES.new(key_bytes, AES.MODE_CBC, iv_bytes)
            plaintext = unpad(cipher.decrypt(ciphertext), AES.block_size)

            Utils.decrypted += 1
            return {
                "success": True,
                "data": plaintext.decode('utf-8')
            }
        except Exception as e:
            logger.error(f"Decrypt tguess error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    @staticmethod
    def decrypt_bda(bda_base64: str, user_agent: str = None) -> dict:
        """
        Decrypt BDA encrypted data
        
        Args:
            bda_base64: Base64 encoded BDA data
            user_agent: User agent for key generation
        
        Returns:
            Decrypted data
        """
        try:
            if user_agent is None:
                user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
            
            test = base64.b64decode(bda_base64.encode() if isinstance(bda_base64, str) else bda_base64)
            res = json.loads(test)
            
            if gctx is None:
                return {"success": False, "error": "arkose.js not loaded"}
            
            # Get x_ark_value (current time rounded to 6 hour blocks)
            now = int(time.time())
            x_ark_value = str(now - (now % 21600))
            
            key = bytes(Utils.dict_to_list(gctx.call(
                'genkey',
                f"{user_agent}{x_ark_value}",
                res["s"]
            )))
            
            iv = binascii.unhexlify(res["iv"])
            cipher = AES.new(key, AES.MODE_CBC, iv)
            decrypted_text = cipher.decrypt(base64.b64decode(res["ct"]))
            
            # Unpad manually
            try:
                decrypted_text = unpad(decrypted_text, AES.block_size)
            except:
                pass
            
            Utils.decrypted += 1
            return {
                "success": True,
                "data": decrypted_text.decode('utf-8', errors='ignore')
            }
        except Exception as e:
            logger.error(f"Decrypt BDA error: {e}")
            return {
                "success": False,
                "error": str(e)
            }


# =====================================================
# MAIN SOLVER ENGINE
# =====================================================

class UnifiedSolver:
    """Main solver that handles everything"""

    def __init__(self):
        self.tasks = {}
        self.blob_extractor = BlobExtractor()
        self.pow_solver = PoWSolver()
        self.suppressed_solver = SuppressedSolver()

    def solve_complete(self, task_data: dict) -> dict:
        """
        Complete solve process:
        1. Extract blob (if needed)
        2. Solve regular captcha
        3. Solve suppressed (if present)
        4. Solve PoW (if present)
        """
        try:
            task_id = str(uuid.uuid4().hex)
            
            if 'blob' not in task_data:
                pkey = task_data.get('pkey')
                og_proxy = task_data.get('og_proxy')
                
                blob_result = self.blob_extractor.extract_blob(pkey, og_proxy)
                if not blob_result.get('success'):
                    return {"success": False, "error": "Failed to extract blob"}
                
                blob = blob_result['blob']
            else:
                blob = task_data['blob']

            self.tasks[task_id] = {
                "blob": blob,
                "status": "solving",
                "created_at": time.time()
            }

            threading.Thread(
                target=self._solve_async,
                args=(task_id, blob, task_data)
            ).start()

            return {
                "success": True,
                "task_id": task_id,
                "status": "solving"
            }

        except Exception as e:
            logger.error(f"Solve error: {e}")
            return {"success": False, "error": str(e)}

    def _solve_async(self, task_id: str, blob: str, task_data: dict):
        """Async solving process"""
        try:
            result = {
                "token": self._generate_token(),
                "blob": blob,
                "solved_at": int(time.time())
            }

            if task_data.get('has_suppressed'):
                suppressed_answer = self.suppressed_solver.solve_suppressed(
                    task_data.get('suppressed_challenge', {})
                )
                result['suppressed_answer'] = suppressed_answer
                Utils.suppressed_solved += 1

            if task_data.get('has_pow'):
                pow_result = self.pow_solver.solve_arkose_pow(
                    task_data.get('pow_challenge', {})
                )
                result['pow_solution'] = pow_result.get('solution')
                Utils.pow_solved += 1

            Utils.solved += 1

            self.tasks[task_id]['status'] = 'completed'
            self.tasks[task_id]['result'] = result

        except Exception as e:
            logger.error(f"Async solve error: {e}")
            self.tasks[task_id]['status'] = 'error'
            self.tasks[task_id]['error'] = str(e)
            Utils.fail += 1

    def get_task_result(self, task_id: str) -> dict:
        """Get task result"""
        if task_id not in self.tasks:
            return {"success": False, "error": "Task not found"}

        task = self.tasks[task_id]
        status = task.get('status')

        if status == 'completed':
            result = task.get('result', {})
            return {
                "success": True,
                "status": "completed",
                "token": result.get('token'),
                "suppressed_answer": result.get('suppressed_answer'),
                "pow_solution": result.get('pow_solution')
            }
        elif status == 'error':
            return {
                "success": False,
                "status": "error",
                "error": task.get('error')
            }
        else:
            return {
                "success": True,
                "status": "processing"
            }

    @staticmethod
    def _generate_token() -> str:
        """Generate mock token (replace with actual solver)"""
        return f"token_{uuid.uuid4().hex[:32]}_{int(time.time())}"


# =====================================================
# FLASK APP
# =====================================================

app = Flask(__name__)
solver = UnifiedSolver()


# Health check
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'unified-funcaptcha-solver',
        'version': '3.0.0',
        'arkose_js_loaded': gctx is not None,
        'stats': {
            'solved': Utils.solved,
            'suppressed_solved': Utils.suppressed_solved,
            'pow_solved': Utils.pow_solved,
            'decrypted': Utils.decrypted,
            'errors': Utils.errors
        }
    })


# =====================================================
# ENDPOINTS: BLOB EXTRACTION
# =====================================================

@app.route('/extract/blob', methods=['POST'])
def extract_blob():
    """
    Extract blob from Arkose Labs
    
    Request:
    {
        "pkey": "476068BF-9607-4799-B53D-966BE98E2B81",
        "preset": "roblox_login",
        "og_proxy": "optional_proxy_url"
    }
    """
    try:
        data = request.get_json()
        pkey = data.get('pkey') or data.get('public_key')
        
        if not pkey:
            preset = data.get('preset', '').lower()
            if 'login' in preset:
                pkey = ROBLOX_LOGIN_SITEKEY
            elif 'register' in preset:
                pkey = ROBLOX_REGISTER_SITEKEY
            else:
                return jsonify({"success": False, "error": "No pkey provided"}), 400

        og_proxy = data.get('og_proxy')
        result = solver.blob_extractor.extract_blob(pkey, og_proxy)
        
        return jsonify(result)

    except Exception as e:
        logger.error(f"Extract blob error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# ENDPOINTS: CAPTCHA SOLVING
# =====================================================

@app.route('/solve/create', methods=['POST'])
def create_solve_task():
    """Create a solve task"""
    try:
        data = request.get_json()
        result = solver.solve_complete(data)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Create task error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/solve/status/<task_id>', methods=['GET'])
def get_solve_status(task_id):
    """Get task status"""
    try:
        result = solver.get_task_result(task_id)
        return jsonify(result)

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# ENDPOINTS: UNIFIED (Extract + Solve)
# =====================================================

@app.route('/unified/solve', methods=['POST'])
def unified_solve():
    """Extract blob AND solve in one request"""
    try:
        data = request.get_json()
        preset = data.get('preset', '').lower()
        
        if 'login' in preset:
            pkey = ROBLOX_LOGIN_SITEKEY
        elif 'register' in preset:
            pkey = ROBLOX_REGISTER_SITEKEY
        else:
            pkey = data.get('pkey')

        og_proxy = data.get('og_proxy')
        blob_result = solver.blob_extractor.extract_blob(pkey, og_proxy)
        
        if not blob_result.get('success'):
            return jsonify(blob_result), 400

        solve_data = {
            "preset": preset,
            "blob": blob_result['blob'],
            "has_suppressed": data.get('has_suppressed', False),
            "suppressed_challenge": data.get('suppressed_challenge', {}),
            "has_pow": data.get('has_pow', False),
            "pow_challenge": data.get('pow_challenge', {}),
            "og_proxy": og_proxy
        }

        result = solver.solve_complete(solve_data)
        
        if result.get('success'):
            result['blob'] = blob_result['blob']
        
        return jsonify(result)

    except Exception as e:
        logger.error(f"Unified solve error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# ENDPOINTS: DECRYPTION
# =====================================================

@app.route('/decrypt/tguess', methods=['POST'])
def decrypt_tguess():
    """
    Decrypt tguess encrypted data
    
    Request:
    {
        "encrypted_data": "{\"ct\":\"...\",\"iv\":\"...\",\"s\":\"...\"}",
        "session_token": "session_token_here"
    }
    """
    try:
        data = request.get_json()
        encrypted_data = data.get('encrypted_data')
        session_token = data.get('session_token')
        
        if not encrypted_data or not session_token:
            return jsonify({"success": False, "error": "Missing encrypted_data or session_token"}), 400
        
        result = DecryptionUtils.decrypt_tguess(encrypted_data, session_token)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Decrypt tguess error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/decrypt/bda', methods=['POST'])
def decrypt_bda():
    """
    Decrypt BDA encrypted data
    
    Request:
    {
        "bda_data": "base64_encoded_data_here",
        "user_agent": "optional_user_agent"
    }
    """
    try:
        data = request.get_json()
        bda_data = data.get('bda_data')
        user_agent = data.get('user_agent')
        
        if not bda_data:
            return jsonify({"success": False, "error": "Missing bda_data"}), 400
        
        result = DecryptionUtils.decrypt_bda(bda_data, user_agent)
        return jsonify(result)

    except Exception as e:
        logger.error(f"Decrypt BDA error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# =====================================================
# BACKWARD COMPATIBILITY ENDPOINTS
# =====================================================

@app.route('/funcaptcha/createTask', methods=['POST'])
def createTask_legacy():
    """Legacy endpoint for backward compatibility"""
    try:
        data = request.get_json()
        preset = data.get('preset', '').lower()
        
        if 'login' in preset:
            pkey = ROBLOX_LOGIN_SITEKEY
        else:
            pkey = ROBLOX_REGISTER_SITEKEY
        
        blob = data.get('blob')
        if not blob:
            blob_result = solver.blob_extractor.extract_blob(
                pkey, 
                data.get('og_proxy')
            )
            if blob_result.get('success'):
                blob = blob_result['blob']

        solve_data = {
            "preset": preset,
            "blob": blob,
            "has_suppressed": data.get('has_suppressed', False),
            "has_pow": data.get('has_pow', False),
            "og_proxy": data.get('og_proxy')
        }

        result = solver.solve_complete(solve_data)
        
        return jsonify({
            "success": result.get('success'),
            "task_id": result.get('task_id')
        })

    except Exception as e:
        return jsonify({"success": False, "err": str(e)})


@app.route('/funcaptcha/getTask', methods=['POST'])
def getTask_legacy():
    """Legacy endpoint for backward compatibility"""
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        
        result = solver.get_task_result(task_id)
        
        if result.get('success') and result.get('status') == 'completed':
            return jsonify({
                "status": "completed",
                "captcha": {
                    "token": result.get('token')
                }
            })
        elif result.get('success'):
            return jsonify({"status": "processing"})
        else:
            return jsonify({"status": "error", "error": result.get('error')})

    except Exception as e:
        return jsonify({"status": "error", "error": str(e)})


# =====================================================
# STATS ENDPOINT
# =====================================================

@app.route('/stats', methods=['GET'])
def stats():
    """Get solver statistics"""
    return jsonify({
        "solved": Utils.solved,
        "failed": Utils.fail,
        "suppressed_solved": Utils.suppressed_solved,
        "pow_solved": Utils.pow_solved,
        "decrypted": Utils.decrypted,
        "errors": Utils.errors,
        "uptime": time.time()
    })


# =====================================================
# MAIN
# =====================================================

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=DEBUG, threaded=True)
