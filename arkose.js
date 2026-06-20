Qe=function(t) {
    "use strict";
    var e = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    function n(t, e) {
        var n = t[0]
            , r = t[1]
            , o = t[2]
            , i = t[3];
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[0] - 680876936 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[1] - 389564586 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[2] + 606105819 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[3] - 1044525330 | 0) << 22 | r >>> 10) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[4] - 176418897 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[5] + 1200080426 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[6] - 1473231341 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[7] - 45705983 | 0) << 22 | r >>> 10) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[8] + 1770035416 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[9] - 1958414417 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[10] - 42063 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[11] - 1990404162 | 0) << 22 | r >>> 10) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & o | ~r & i) + e[12] + 1804603682 | 0) << 7 | n >>> 25) + r | 0) & r | ~n & o) + e[13] - 40341101 | 0) << 12 | i >>> 20) + n | 0) & n | ~i & r) + e[14] - 1502002290 | 0) << 17 | o >>> 15) + i | 0) & i | ~o & n) + e[15] + 1236535329 | 0) << 22 | r >>> 10) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[1] - 165796510 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[6] - 1069501632 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[11] + 643717713 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[0] - 373897302 | 0) << 20 | r >>> 12) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[5] - 701558691 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[10] + 38016083 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[15] - 660478335 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[4] - 405537848 | 0) << 20 | r >>> 12) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[9] + 568446438 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[14] - 1019803690 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[3] - 187363961 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[8] + 1163531501 | 0) << 20 | r >>> 12) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r & i | o & ~i) + e[13] - 1444681467 | 0) << 5 | n >>> 27) + r | 0) & o | r & ~o) + e[2] - 51403784 | 0) << 9 | i >>> 23) + n | 0) & r | n & ~r) + e[7] + 1735328473 | 0) << 14 | o >>> 18) + i | 0) & n | i & ~n) + e[12] - 1926607734 | 0) << 20 | r >>> 12) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[5] - 378558 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[8] - 2022574463 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[11] + 1839030562 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[14] - 35309556 | 0) << 23 | r >>> 9) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[1] - 1530992060 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[4] + 1272893353 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[7] - 155497632 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[10] - 1094730640 | 0) << 23 | r >>> 9) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[13] + 681279174 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[0] - 358537222 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[3] - 722521979 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[6] + 76029189 | 0) << 23 | r >>> 9) + o | 0,
        r = ((r += ((o = ((o += ((i = ((i += ((n = ((n += (r ^ o ^ i) + e[9] - 640364487 | 0) << 4 | n >>> 28) + r | 0) ^ r ^ o) + e[12] - 421815835 | 0) << 11 | i >>> 21) + n | 0) ^ n ^ r) + e[15] + 530742520 | 0) << 16 | o >>> 16) + i | 0) ^ i ^ n) + e[2] - 995338651 | 0) << 23 | r >>> 9) + o | 0,
        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[0] - 198630844 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[7] + 1126891415 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[14] - 1416354905 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[5] - 57434055 | 0) << 21 | r >>> 11) + o | 0,
        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[12] + 1700485571 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[3] - 1894986606 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[10] - 1051523 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[1] - 2054922799 | 0) << 21 | r >>> 11) + o | 0,
        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[8] + 1873313359 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[15] - 30611744 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[6] - 1560198380 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[13] + 1309151649 | 0) << 21 | r >>> 11) + o | 0,
        r = ((r += ((i = ((i += (r ^ ((n = ((n += (o ^ (r | ~i)) + e[4] - 145523070 | 0) << 6 | n >>> 26) + r | 0) | ~o)) + e[11] - 1120210379 | 0) << 10 | i >>> 22) + n | 0) ^ ((o = ((o += (n ^ (i | ~r)) + e[2] + 718787259 | 0) << 15 | o >>> 17) + i | 0) | ~n)) + e[9] - 343485551 | 0) << 21 | r >>> 11) + o | 0,
        t[0] = n + t[0] | 0,
        t[1] = r + t[1] | 0,
        t[2] = o + t[2] | 0,
        t[3] = i + t[3] | 0
    }
    function r(t) {
        var e, n = [];
        for (e = 0; e < 64; e += 4)
            n[e >> 2] = t.charCodeAt(e) + (t.charCodeAt(e + 1) << 8) + (t.charCodeAt(e + 2) << 16) + (t.charCodeAt(e + 3) << 24);
        return n
    }
    function o(t) {
        var e, n = [];
        for (e = 0; e < 64; e += 4)
            n[e >> 2] = t[e] + (t[e + 1] << 8) + (t[e + 2] << 16) + (t[e + 3] << 24);
        return n
    }
    function i(t) {
        var e, o, i, a, c, u, s = t.length, f = [1732584193, -271733879, -1732584194, 271733878];
        for (e = 64; e <= s; e += 64)
            n(f, r(t.substring(e - 64, e)));
        for (o = (t = t.substring(e - 64)).length,
        i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        e = 0; e < o; e += 1)
            i[e >> 2] |= t.charCodeAt(e) << (e % 4 << 3);
        if (i[e >> 2] |= 128 << (e % 4 << 3),
        e > 55)
            for (n(f, i),
            e = 0; e < 16; e += 1)
                i[e] = 0;
        return a = (a = 8 * s).toString(16).match(/(.*?)(.{0,8})$/),
        c = parseInt(a[2], 16),
        u = parseInt(a[1], 16) || 0,
        i[14] = c,
        i[15] = u,
        n(f, i),
        f
    }
    function a(t) {
        var e, r, i, a, c, u, s = t.length, f = [1732584193, -271733879, -1732584194, 271733878];
        for (e = 64; e <= s; e += 64)
            n(f, o(t.subarray(e - 64, e)));
        for (r = (t = e - 64 < s ? t.subarray(e - 64) : new Uint8Array(0)).length,
        i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        e = 0; e < r; e += 1)
            i[e >> 2] |= t[e] << (e % 4 << 3);
        if (i[e >> 2] |= 128 << (e % 4 << 3),
        e > 55)
            for (n(f, i),
            e = 0; e < 16; e += 1)
                i[e] = 0;
        return a = (a = 8 * s).toString(16).match(/(.*?)(.{0,8})$/),
        c = parseInt(a[2], 16),
        u = parseInt(a[1], 16) || 0,
        i[14] = c,
        i[15] = u,
        n(f, i),
        f
    }
    function c(t) {
        var n, r = "";
        for (n = 0; n < 4; n += 1)
            r += e[t >> 8 * n + 4 & 15] + e[t >> 8 * n & 15];
        return r
    }
    function u(t) {
        var e;
        for (e = 0; e < t.length; e += 1)
            t[e] = c(t[e]);
        return t.join("")
    }
    function s(t) {
        return /[\u0080-\uFFFF]/.test(t) && (t = unescape(encodeURIComponent(t))),
        t
    }
    function f(t, e) {
        var n, r = t.length, o = new ArrayBuffer(r), i = new Uint8Array(o);
        for (n = 0; n < r; n += 1)
            i[n] = t.charCodeAt(n);
        return e ? i : o
    }
    function l(t) {
        return String.fromCharCode.apply(null, new Uint8Array(t))
    }
    function p(t, e, n) {
        var r = new Uint8Array(t.byteLength + e.byteLength);
        return r.set(new Uint8Array(t)),
        r.set(new Uint8Array(e), t.byteLength),
        n ? r : r.buffer
    }
    function h(t) {
        var e, n = [], r = t.length;
        for (e = 0; e < r - 1; e += 2)
            n.push(parseInt(t.substr(e, 2), 16));
        return String.fromCharCode.apply(String, n)
    }
    function v() {
        this.reset()
    }
    return u(i("hello")),
    "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || function() {
        function e(t, e) {
            return (t = 0 | t || 0) < 0 ? Math.max(t + e, 0) : Math.min(t, e)
        }
        ArrayBuffer.prototype.slice = function(n, r) {
            var o, i, a, c, u = this.byteLength, s = e(n, u), f = u;
            return r !== t && (f = e(r, u)),
            s > f ? new ArrayBuffer(0) : (o = f - s,
            i = new ArrayBuffer(o),
            a = new Uint8Array(i),
            c = new Uint8Array(this,s,o),
            a.set(c),
            i)
        }
    }(),
    v.prototype.append = function(t) {
        return this.appendBinary(s(t)),
        this
    }
    ,
    v.prototype.appendBinary = function(t) {
        this._buff += t,
        this._length += t.length;
        var e, o = this._buff.length;
        for (e = 64; e <= o; e += 64)
            n(this._hash, r(this._buff.substring(e - 64, e)));
        return this._buff = this._buff.substring(e - 64),
        this
    }
    ,
    v.prototype.end = function(t) {
        var e, n, r = this._buff, o = r.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (e = 0; e < o; e += 1)
            i[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
        return this._finish(i, o),
        n = u(this._hash),
        t && (n = h(n)),
        this.reset(),
        n
    }
    ,
    v.prototype.reset = function() {
        return this._buff = "",
        this._length = 0,
        this._hash = [1732584193, -271733879, -1732584194, 271733878],
        this
    }
    ,
    v.prototype.getState = function() {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash.slice()
        }
    }
    ,
    v.prototype.setState = function(t) {
        return this._buff = t.buff,
        this._length = t.length,
        this._hash = t.hash,
        this
    }
    ,
    v.prototype.destroy = function() {
        delete this._hash,
        delete this._buff,
        delete this._length
    }
    ,
    v.prototype._finish = function(t, e) {
        var r, o, i, a = e;
        if (t[a >> 2] |= 128 << (a % 4 << 3),
        a > 55)
            for (n(this._hash, t),
            a = 0; a < 16; a += 1)
                t[a] = 0;
        r = (r = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/),
        o = parseInt(r[2], 16),
        i = parseInt(r[1], 16) || 0,
        t[14] = o,
        t[15] = i,
        n(this._hash, t)
    }
    ,
    v.hash = function(t, e) {
        return v.hashBinary(s(t), e)
    }
    ,
    v.hashBinary = function(t, e) {
        var n = u(i(t));
        return e ? h(n) : n
    }
    ,
    v.ArrayBuffer = function() {
        this.reset()
    }
    ,
    v.ArrayBuffer.prototype.append = function(t) {
        var e, r = p(this._buff.buffer, t, !0), i = r.length;
        for (this._length += t.byteLength,
        e = 64; e <= i; e += 64)
            n(this._hash, o(r.subarray(e - 64, e)));
        return this._buff = e - 64 < i ? new Uint8Array(r.buffer.slice(e - 64)) : new Uint8Array(0),
        this
    }
    ,
    v.ArrayBuffer.prototype.end = function(t) {
        var e, n, r = this._buff, o = r.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (e = 0; e < o; e += 1)
            i[e >> 2] |= r[e] << (e % 4 << 3);
        return this._finish(i, o),
        n = u(this._hash),
        t && (n = h(n)),
        this.reset(),
        n
    }
    ,
    v.ArrayBuffer.prototype.reset = function() {
        return this._buff = new Uint8Array(0),
        this._length = 0,
        this._hash = [1732584193, -271733879, -1732584194, 271733878],
        this
    }
    ,
    v.ArrayBuffer.prototype.getState = function() {
        var t = v.prototype.getState.call(this);
        return t.buff = l(t.buff),
        t
    }
    ,
    v.ArrayBuffer.prototype.setState = function(t) {
        return t.buff = f(t.buff, !0),
        v.prototype.setState.call(this, t)
    }
    ,
    v.ArrayBuffer.prototype.destroy = v.prototype.destroy,
    v.ArrayBuffer.prototype._finish = v.prototype._finish,
    v.ArrayBuffer.hash = function(t, e) {
        var n = u(a(new Uint8Array(t)));
        return e ? h(n) : n
    }
    ,
    v
}

data=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,0,0,0,0,0,0,0,10,11,12,13,14,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,11,12,13,14,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

let genkey = function (t, e) {
    function transformString(str) {
      let transformed = ''
      for (let i = 0; i < str.length; i += 2) {
        let e = str.charCodeAt(i)
        let n = str.charCodeAt(i + 1)
        transformed += String.fromCharCode((data[e] << 4) + data[n])
      }
      return transformed
    }
    let u = t + transformString(e)
    let s = []
    s[0] = Qe().hashBinary(u, true)
    let f = s[0]
    for (let l = 1; l < 3; l++) {
      s[l] = Qe().hashBinary(s[l - 1] + u, true)
      f += s[l]
    }
    function toUint8Array(str) {
      let array = new Uint8Array(str.length)
      for (let i = 0; i < str.length; ++i) {
        array[i] = str.charCodeAt(i)
      }
      return array
    }
    return toUint8Array(f.substring(0, 32))
  }

randsigbyte=function(e) {
    for (var r, n = [], i = function(e) {
        var r = 987654321
          , n = 4294967295;
        return function() {
            var i = ((r = 36969 * (65535 & r) + (r >> 16) & n) << 16) + (e = 18e3 * (65535 & e) + (e >> 16) & n) & n;
            return i /= 4294967296,
            (i += .5) * (Math.random() > .5 ? 1 : -1)
        }
    }, o = 0; o < e; o += 4) {
        var s = i(4294967296 * (r || Math.random()));
        r = 987654071 * s(),
        n.push(4294967296 * s() | 0)
    }
    return n
}

var x64Add = function (t, r) {
    (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]),
        (r = [r[0] >>> 16, 65535 & r[0], r[1] >>> 16, 65535 & r[1]]);
    var e = [0, 0, 0, 0];
    return ((e[3] += t[3] + r[3]),
        (e[2] += e[3] >>> 16),
        (e[3] &= 65535),
        (e[2] += t[2] + r[2]),
        (e[1] += e[2] >>> 16),
        (e[2] &= 65535),
        (e[1] += t[1] + r[1]),
        (e[0] += e[1] >>> 16),
        (e[1] &= 65535),
        (e[0] += t[0] + r[0]),
        (e[0] &= 65535),
        [(e[0] << 16) | e[1], (e[2] << 16) | e[3]]);
}, 

x64Multiply = function (t, r) {
    (t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]]),
        (r = [r[0] >>> 16, 65535 & r[0], r[1] >>> 16, 65535 & r[1]]);
    var e = [0, 0, 0, 0];
    return ((e[3] += t[3] * r[3]),
        (e[2] += e[3] >>> 16),
        (e[3] &= 65535),
        (e[2] += t[2] * r[3]),
        (e[1] += e[2] >>> 16),
        (e[2] &= 65535),
        (e[2] += t[3] * r[2]),
        (e[1] += e[2] >>> 16),
        (e[2] &= 65535),
        (e[1] += t[1] * r[3]),
        (e[0] += e[1] >>> 16),
        (e[1] &= 65535),
        (e[1] += t[2] * r[2]),
        (e[0] += e[1] >>> 16),
        (e[1] &= 65535),
        (e[1] += t[3] * r[1]),
        (e[0] += e[1] >>> 16),
        (e[1] &= 65535),
        (e[0] += t[0] * r[3] + t[1] * r[2] + t[2] * r[1] + t[3] * r[0]),
        (e[0] &= 65535),
        [(e[0] << 16) | e[1], (e[2] << 16) | e[3]]);
}, 

x64Rotl = function (t, r) {
    return 32 === (r %= 64)
        ? [t[1], t[0]]
        : r < 32
            ? [
                (t[0] << r) | (t[1] >>> (32 - r)),
                (t[1] << r) | (t[0] >>> (32 - r)),
            ]
            : ((r -= 32),
                [
                    (t[1] << r) | (t[0] >>> (32 - r)),
                    (t[0] << r) | (t[1] >>> (32 - r)),
                ]);
}, 

x64LeftShift = function (t, r) {
    return 0 === (r %= 64)
        ? t
        : r < 32
            ? [(t[0] << r) | (t[1] >>> (32 - r)), t[1] << r]
            : [t[1] << (r - 32), 0];
}, 

x64Xor = function (t, r) {
    return [t[0] ^ r[0], t[1] ^ r[1]];
}, 

x64Fmix = function (t) {
    return ((t = x64Xor(t, [0, t[0] >>> 1])),
        (t = x64Multiply(t, [4283543511, 3981806797])),
        (t = x64Xor(t, [0, t[0] >>> 1])),
        (t = x64Multiply(t, [3301882366, 444984403])),
        (t = x64Xor(t, [0, t[0] >>> 1])));
}, 

x64hash128 = function (t, r) {
    r = r || 0;
    for (var e = (t = t || "").length % 16, o = t.length - e, x = [0, r], c = [0, r], h = [0, 0], a = [0, 0], d = [2277735313, 289559509], i = [1291169091, 658871167], l = 0; l < o; l += 16)
        (h = [
            (255 & t.charCodeAt(l + 4)) |
                ((255 & t.charCodeAt(l + 5)) << 8) |
                ((255 & t.charCodeAt(l + 6)) << 16) |
                ((255 & t.charCodeAt(l + 7)) << 24),
            (255 & t.charCodeAt(l)) |
                ((255 & t.charCodeAt(l + 1)) << 8) |
                ((255 & t.charCodeAt(l + 2)) << 16) |
                ((255 & t.charCodeAt(l + 3)) << 24),
        ]),
            (a = [
                (255 & t.charCodeAt(l + 12)) |
                    ((255 & t.charCodeAt(l + 13)) << 8) |
                    ((255 & t.charCodeAt(l + 14)) << 16) |
                    ((255 & t.charCodeAt(l + 15)) << 24),
                (255 & t.charCodeAt(l + 8)) |
                    ((255 & t.charCodeAt(l + 9)) << 8) |
                    ((255 & t.charCodeAt(l + 10)) << 16) |
                    ((255 & t.charCodeAt(l + 11)) << 24),
            ]),
            (h = x64Multiply(h, d)),
            (h = x64Rotl(h, 31)),
            (h = x64Multiply(h, i)),
            (x = x64Xor(x, h)),
            (x = x64Rotl(x, 27)),
            (x = x64Add(x, c)),
            (x = x64Add(x64Multiply(x, [0, 5]), [0, 1390208809])),
            (a = x64Multiply(a, i)),
            (a = x64Rotl(a, 33)),
            (a = x64Multiply(a, d)),
            (c = x64Xor(c, a)),
            (c = x64Rotl(c, 31)),
            (c = x64Add(c, x)),
            (c = x64Add(x64Multiply(c, [0, 5]), [0, 944331445]));
    switch (((h = [0, 0]), (a = [0, 0]), e)) {
        case 15:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 14)], 48));
        case 14:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 13)], 40));
        case 13:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 12)], 32));
        case 12:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 11)], 24));
        case 11:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 10)], 16));
        case 10:
            a = x64Xor(a, x64LeftShift([0, t.charCodeAt(l + 9)], 8));
        case 9:
            (a = x64Xor(a, [0, t.charCodeAt(l + 8)])),
                (a = x64Multiply(a, i)),
                (a = x64Rotl(a, 33)),
                (a = x64Multiply(a, d)),
                (c = x64Xor(c, a));
        case 8:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 7)], 56));
        case 7:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 6)], 48));
        case 6:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 5)], 40));
        case 5:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 4)], 32));
        case 4:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 3)], 24));
        case 3:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 2)], 16));
        case 2:
            h = x64Xor(h, x64LeftShift([0, t.charCodeAt(l + 1)], 8));
        case 1:
            (h = x64Xor(h, [0, t.charCodeAt(l)])),
                (h = x64Multiply(h, d)),
                (h = x64Rotl(h, 31)),
                (h = x64Multiply(h, i)),
                (x = x64Xor(x, h));
    }
    return ((x = x64Xor(x, [0, t.length])),
        (c = x64Xor(c, [0, t.length])),
        (x = x64Add(x, c)),
        (c = x64Add(c, x)),
        (x = x64Fmix(x)),
        (c = x64Fmix(c)),
        (x = x64Add(x, c)),
        (c = x64Add(c, x)),
        ("00000000" + (x[0] >>> 0).toString(16)).slice(-8) +
            ("00000000" + (x[1] >>> 0).toString(16)).slice(-8) +
            ("00000000" + (c[0] >>> 0).toString(16)).slice(-8) +
            ("00000000" + (c[1] >>> 0).toString(16)).slice(-8));
};