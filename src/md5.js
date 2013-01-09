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

        _doProcessBlock: function (m) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                var word = m[i];
                m[i] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcuts
            var m0  = m[0];
            var m1  = m[1];
            var m2  = m[2];
            var m3  = m[3];
            var m4  = m[4];
            var m5  = m[5];
            var m6  = m[6];
            var m7  = m[7];
            var m8  = m[8];
            var m9  = m[9];
            var m10 = m[10];
            var m11 = m[11];
            var m12 = m[12];
            var m13 = m[13];
            var m14 = m[14];
            var m15 = m[15];

            var s = this._state;
            var s0 = s[0];
            var s1 = s[1];
            var s2 = s[2];
            var s3 = s[3];

            // Computation
            s0 = FF(s0, s1, s2, s3, m0,  7,  0xd76aa478);
            s3 = FF(s3, s0, s1, s2, m1,  12, 0xe8c7b756);
            s2 = FF(s2, s3, s0, s1, m2,  17, 0x242070db);
            s1 = FF(s1, s2, s3, s0, m3,  22, 0xc1bdceee);
            s0 = FF(s0, s1, s2, s3, m4,  7,  0xf57c0faf);
            s3 = FF(s3, s0, s1, s2, m5,  12, 0x4787c62a);
            s2 = FF(s2, s3, s0, s1, m6,  17, 0xa8304613);
            s1 = FF(s1, s2, s3, s0, m7,  22, 0xfd469501);
            s0 = FF(s0, s1, s2, s3, m8,  7,  0x698098d8);
            s3 = FF(s3, s0, s1, s2, m9,  12, 0x8b44f7af);
            s2 = FF(s2, s3, s0, s1, m10, 17, 0xffff5bb1);
            s1 = FF(s1, s2, s3, s0, m11, 22, 0x895cd7be);
            s0 = FF(s0, s1, s2, s3, m12, 7,  0x6b901122);
            s3 = FF(s3, s0, s1, s2, m13, 12, 0xfd987193);
            s2 = FF(s2, s3, s0, s1, m14, 17, 0xa679438e);
            s1 = FF(s1, s2, s3, s0, m15, 22, 0x49b40821);

            s0 = GG(s0, s1, s2, s3, m1,  5,  0xf61e2562);
            s3 = GG(s3, s0, s1, s2, m6,  9,  0xc040b340);
            s2 = GG(s2, s3, s0, s1, m11, 14, 0x265e5a51);
            s1 = GG(s1, s2, s3, s0, m0,  20, 0xe9b6c7aa);
            s0 = GG(s0, s1, s2, s3, m5,  5,  0xd62f105d);
            s3 = GG(s3, s0, s1, s2, m10, 9,  0x02441453);
            s2 = GG(s2, s3, s0, s1, m15, 14, 0xd8a1e681);
            s1 = GG(s1, s2, s3, s0, m4,  20, 0xe7d3fbc8);
            s0 = GG(s0, s1, s2, s3, m9,  5,  0x21e1cde6);
            s3 = GG(s3, s0, s1, s2, m14, 9,  0xc33707d6);
            s2 = GG(s2, s3, s0, s1, m3,  14, 0xf4d50d87);
            s1 = GG(s1, s2, s3, s0, m8,  20, 0x455a14ed);
            s0 = GG(s0, s1, s2, s3, m13, 5,  0xa9e3e905);
            s3 = GG(s3, s0, s1, s2, m2,  9,  0xfcefa3f8);
            s2 = GG(s2, s3, s0, s1, m7,  14, 0x676f02d9);
            s1 = GG(s1, s2, s3, s0, m12, 20, 0x8d2a4c8a);

            s0 = HH(s0, s1, s2, s3, m5,  4,  0xfffa3942);
            s3 = HH(s3, s0, s1, s2, m8,  11, 0x8771f681);
            s2 = HH(s2, s3, s0, s1, m11, 16, 0x6d9d6122);
            s1 = HH(s1, s2, s3, s0, m14, 23, 0xfde5380c);
            s0 = HH(s0, s1, s2, s3, m1,  4,  0xa4beea44);
            s3 = HH(s3, s0, s1, s2, m4,  11, 0x4bdecfa9);
            s2 = HH(s2, s3, s0, s1, m7,  16, 0xf6bb4b60);
            s1 = HH(s1, s2, s3, s0, m10, 23, 0xbebfbc70);
            s0 = HH(s0, s1, s2, s3, m13, 4,  0x289b7ec6);
            s3 = HH(s3, s0, s1, s2, m0,  11, 0xeaa127fa);
            s2 = HH(s2, s3, s0, s1, m3,  16, 0xd4ef3085);
            s1 = HH(s1, s2, s3, s0, m6,  23, 0x04881d05);
            s0 = HH(s0, s1, s2, s3, m9,  4,  0xd9d4d039);
            s3 = HH(s3, s0, s1, s2, m12, 11, 0xe6db99e5);
            s2 = HH(s2, s3, s0, s1, m15, 16, 0x1fa27cf8);
            s1 = HH(s1, s2, s3, s0, m2,  23, 0xc4ac5665);

            s0 = II(s0, s1, s2, s3, m0,  6,  0xf4292244);
            s3 = II(s3, s0, s1, s2, m7,  10, 0x432aff97);
            s2 = II(s2, s3, s0, s1, m14, 15, 0xab9423a7);
            s1 = II(s1, s2, s3, s0, m5,  21, 0xfc93a039);
            s0 = II(s0, s1, s2, s3, m12, 6,  0x655b59c3);
            s3 = II(s3, s0, s1, s2, m3,  10, 0x8f0ccc92);
            s2 = II(s2, s3, s0, s1, m10, 15, 0xffeff47d);
            s1 = II(s1, s2, s3, s0, m1,  21, 0x85845dd1);
            s0 = II(s0, s1, s2, s3, m8,  6,  0x6fa87e4f);
            s3 = II(s3, s0, s1, s2, m15, 10, 0xfe2ce6e0);
            s2 = II(s2, s3, s0, s1, m6,  15, 0xa3014314);
            s1 = II(s1, s2, s3, s0, m13, 21, 0x4e0811a1);
            s0 = II(s0, s1, s2, s3, m4,  6,  0xf7537e82);
            s3 = II(s3, s0, s1, s2, m11, 10, 0xbd3af235);
            s2 = II(s2, s3, s0, s1, m2,  15, 0x2ad7d2bb);
            s1 = II(s1, s2, s3, s0, m9,  21, 0xeb86d391);

            // Update state
            s[0] = (s[0] + s0) | 0;
            s[1] = (s[1] + s1) | 0;
            s[2] = (s[2] + s2) | 0;
            s[3] = (s[3] + s3) | 0;
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
