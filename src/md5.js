(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C.MD5 = Hasher.extend({
        _doInit: function () {
        },

        _doReset: function () {
            this._state = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
        },

        _doProcessBlock: function (m, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var wordIndex = offset + i;
                var word = m[wordIndex];

                // Swap
                m[wordIndex] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcuts
            var mOffset0  = m[offset];
            var mOffset1  = m[offset + 1];
            var mOffset2  = m[offset + 2];
            var mOffset3  = m[offset + 3];
            var mOffset4  = m[offset + 4];
            var mOffset5  = m[offset + 5];
            var mOffset6  = m[offset + 6];
            var mOffset7  = m[offset + 7];
            var mOffset8  = m[offset + 8];
            var mOffset9  = m[offset + 9];
            var mOffset10 = m[offset + 10];
            var mOffset11 = m[offset + 11];
            var mOffset12 = m[offset + 12];
            var mOffset13 = m[offset + 13];
            var mOffset14 = m[offset + 14];
            var mOffset15 = m[offset + 15];

            var s = this._state;

            // Working varialbes
            var a = s[0];
            var b = s[1];
            var c = s[2];
            var d = s[3];

            // Computation
            a = FF(a, b, c, d, mOffset0,  7,  0xd76aa478);
            d = FF(d, a, b, c, mOffset1,  12, 0xe8c7b756);
            c = FF(c, d, a, b, mOffset2,  17, 0x242070db);
            b = FF(b, c, d, a, mOffset3,  22, 0xc1bdceee);
            a = FF(a, b, c, d, mOffset4,  7,  0xf57c0faf);
            d = FF(d, a, b, c, mOffset5,  12, 0x4787c62a);
            c = FF(c, d, a, b, mOffset6,  17, 0xa8304613);
            b = FF(b, c, d, a, mOffset7,  22, 0xfd469501);
            a = FF(a, b, c, d, mOffset8,  7,  0x698098d8);
            d = FF(d, a, b, c, mOffset9,  12, 0x8b44f7af);
            c = FF(c, d, a, b, mOffset10, 17, 0xffff5bb1);
            b = FF(b, c, d, a, mOffset11, 22, 0x895cd7be);
            a = FF(a, b, c, d, mOffset12, 7,  0x6b901122);
            d = FF(d, a, b, c, mOffset13, 12, 0xfd987193);
            c = FF(c, d, a, b, mOffset14, 17, 0xa679438e);
            b = FF(b, c, d, a, mOffset15, 22, 0x49b40821);

            a = GG(a, b, c, d, mOffset1,  5,  0xf61e2562);
            d = GG(d, a, b, c, mOffset6,  9,  0xc040b340);
            c = GG(c, d, a, b, mOffset11, 14, 0x265e5a51);
            b = GG(b, c, d, a, mOffset0,  20, 0xe9b6c7aa);
            a = GG(a, b, c, d, mOffset5,  5,  0xd62f105d);
            d = GG(d, a, b, c, mOffset10, 9,  0x02441453);
            c = GG(c, d, a, b, mOffset15, 14, 0xd8a1e681);
            b = GG(b, c, d, a, mOffset4,  20, 0xe7d3fbc8);
            a = GG(a, b, c, d, mOffset9,  5,  0x21e1cde6);
            d = GG(d, a, b, c, mOffset14, 9,  0xc33707d6);
            c = GG(c, d, a, b, mOffset3,  14, 0xf4d50d87);
            b = GG(b, c, d, a, mOffset8,  20, 0x455a14ed);
            a = GG(a, b, c, d, mOffset13, 5,  0xa9e3e905);
            d = GG(d, a, b, c, mOffset2,  9,  0xfcefa3f8);
            c = GG(c, d, a, b, mOffset7,  14, 0x676f02d9);
            b = GG(b, c, d, a, mOffset12, 20, 0x8d2a4c8a);

            a = HH(a, b, c, d, mOffset5,  4,  0xfffa3942);
            d = HH(d, a, b, c, mOffset8,  11, 0x8771f681);
            c = HH(c, d, a, b, mOffset11, 16, 0x6d9d6122);
            b = HH(b, c, d, a, mOffset14, 23, 0xfde5380c);
            a = HH(a, b, c, d, mOffset1,  4,  0xa4beea44);
            d = HH(d, a, b, c, mOffset4,  11, 0x4bdecfa9);
            c = HH(c, d, a, b, mOffset7,  16, 0xf6bb4b60);
            b = HH(b, c, d, a, mOffset10, 23, 0xbebfbc70);
            a = HH(a, b, c, d, mOffset13, 4,  0x289b7ec6);
            d = HH(d, a, b, c, mOffset0,  11, 0xeaa127fa);
            c = HH(c, d, a, b, mOffset3,  16, 0xd4ef3085);
            b = HH(b, c, d, a, mOffset6,  23, 0x04881d05);
            a = HH(a, b, c, d, mOffset9,  4,  0xd9d4d039);
            d = HH(d, a, b, c, mOffset12, 11, 0xe6db99e5);
            c = HH(c, d, a, b, mOffset15, 16, 0x1fa27cf8);
            b = HH(b, c, d, a, mOffset2,  23, 0xc4ac5665);

            a = II(a, b, c, d, mOffset0,  6,  0xf4292244);
            d = II(d, a, b, c, mOffset7,  10, 0x432aff97);
            c = II(c, d, a, b, mOffset14, 15, 0xab9423a7);
            b = II(b, c, d, a, mOffset5,  21, 0xfc93a039);
            a = II(a, b, c, d, mOffset12, 6,  0x655b59c3);
            d = II(d, a, b, c, mOffset3,  10, 0x8f0ccc92);
            c = II(c, d, a, b, mOffset10, 15, 0xffeff47d);
            b = II(b, c, d, a, mOffset1,  21, 0x85845dd1);
            a = II(a, b, c, d, mOffset8,  6,  0x6fa87e4f);
            d = II(d, a, b, c, mOffset15, 10, 0xfe2ce6e0);
            c = II(c, d, a, b, mOffset6,  15, 0xa3014314);
            b = II(b, c, d, a, mOffset13, 21, 0x4e0811a1);
            a = II(a, b, c, d, mOffset4,  6,  0xf7537e82);
            d = II(d, a, b, c, mOffset11, 10, 0xbd3af235);
            c = II(c, d, a, b, mOffset2,  15, 0x2ad7d2bb);
            b = II(b, c, d, a, mOffset9,  21, 0xeb86d391);

            // Update state
            s[0] = (s[0] + a) | 0;
            s[1] = (s[1] + b) | 0;
            s[2] = (s[2] + c) | 0;
            s[3] = (s[3] + d) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsLeft = data.sigBytes * 8;
            var nBitsTotalLsw = this._nDataBitsLsw;
            var nBitsTotalMsw = this._nDataBitsMsw;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var lengthStartIndex = (((nBitsLeft + 64) >>> 9) << 4) + 14;
            dataWords[lengthStartIndex] = (
                (((nBitsTotalLsw << 8)  | (nBitsTotalLsw >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalLsw << 24) | (nBitsTotalLsw >>> 8))  & 0xff00ff00)
            );
            dataWords[lengthStartIndex + 1] = (
                (((nBitsTotalMsw << 8)  | (nBitsTotalMsw >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalMsw << 24) | (nBitsTotalMsw >>> 8))  & 0xff00ff00)
            );

            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcut
            var state = this._state;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                var word = state[i];
                state[i] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }

            // Return final hash
            return new WordArray(state);
        },

        clone: function () {
            var clone = MD5.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        }
    });

    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }
}());
