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
            var s = this._state;
            var s0 = s[0];
            var s1 = s[1];
            var s2 = s[2];
            var s3 = s[3];

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

            // Rounds 1..16
            var t = s0 + ((s1 & s2) | (~s1 & s3)) + m0 + 0xd76aa478;
            s0 = ((t << 7)  | (t >>> (32 - 7))) + s1;
            var t = s3 + ((s0 & s1) | (~s0 & s2)) + m1 + 0xe8c7b756;
            s3 = ((t << 12) | (t >>> (32 - 12))) + s0;
            var t = s2 + ((s3 & s0) | (~s3 & s1)) + m2 + 0x242070db;
            s2 = ((t << 17) | (t >>> (32 - 17))) + s3;
            var t = s1 + ((s2 & s3) | (~s2 & s0)) + m3 + 0xc1bdceee;
            s1 = ((t << 22) | (t >>> (32 - 22))) + s2;
            var t = s0 + ((s1 & s2) | (~s1 & s3)) + m4 + 0xf57c0faf;
            s0 = ((t << 7)  | (t >>> (32 - 7))) + s1;
            var t = s3 + ((s0 & s1) | (~s0 & s2)) + m5 + 0x4787c62a;
            s3 = ((t << 12) | (t >>> (32 - 12))) + s0;
            var t = s2 + ((s3 & s0) | (~s3 & s1)) + m6 + 0xa8304613;
            s2 = ((t << 17) | (t >>> (32 - 17))) + s3;
            var t = s1 + ((s2 & s3) | (~s2 & s0)) + m7 + 0xfd469501;
            s1 = ((t << 22) | (t >>> (32 - 22))) + s2;
            var t = s0 + ((s1 & s2) | (~s1 & s3)) + m8 + 0x698098d8;
            s0 = ((t << 7)  | (t >>> (32 - 7))) + s1;
            var t = s3 + ((s0 & s1) | (~s0 & s2)) + m9 + 0x8b44f7af;
            s3 = ((t << 12) | (t >>> (32 - 12))) + s0;
            var t = s2 + ((s3 & s0) | (~s3 & s1)) + m10 + 0xffff5bb1;
            s2 = ((t << 17) | (t >>> (32 - 17))) + s3;
            var t = s1 + ((s2 & s3) | (~s2 & s0)) + m11 + 0x895cd7be;
            s1 = ((t << 22) | (t >>> (32 - 22))) + s2;
            var t = s0 + ((s1 & s2) | (~s1 & s3)) + m12 + 0x6b901122;
            s0 = ((t << 7)  | (t >>> (32 - 7))) + s1;
            var t = s3 + ((s0 & s1) | (~s0 & s2)) + m13 + 0xfd987193;
            s3 = ((t << 12) | (t >>> (32 - 12))) + s0;
            var t = s2 + ((s3 & s0) | (~s3 & s1)) + m14 + 0xa679438e;
            s2 = ((t << 17) | (t >>> (32 - 17))) + s3;
            var t = s1 + ((s2 & s3) | (~s2 & s0)) + m15 + 0x49b40821;
            s1 = ((t << 22) | (t >>> (32 - 22))) + s2;

            // Rounds 17..32
            var t = s0 + ((s1 & s3) | (s2 & ~s3)) + m1 + 0xf61e2562;
            s0 = ((t << 5)  | (t >>> (32 - 5))) + s1;
            var t = s3 + ((s0 & s2) | (s1 & ~s2)) + m6 + 0xc040b340;
            s3 = ((t << 9)  | (t >>> (32 - 9))) + s0;
            var t = s2 + ((s3 & s1) | (s0 & ~s1)) + m11 + 0x265e5a51;
            s2 = ((t << 14) | (t >>> (32 - 14))) + s3;
            var t = s1 + ((s2 & s0) | (s3 & ~s0)) + m0 + 0xe9b6c7aa;
            s1 = ((t << 20) | (t >>> (32 - 20))) + s2;
            var t = s0 + ((s1 & s3) | (s2 & ~s3)) + m5 + 0xd62f105d;
            s0 = ((t << 5)  | (t >>> (32 - 5))) + s1;
            var t = s3 + ((s0 & s2) | (s1 & ~s2)) + m10 + 0x02441453;
            s3 = ((t << 9)  | (t >>> (32 - 9))) + s0;
            var t = s2 + ((s3 & s1) | (s0 & ~s1)) + m15 + 0xd8a1e681;
            s2 = ((t << 14) | (t >>> (32 - 14))) + s3;
            var t = s1 + ((s2 & s0) | (s3 & ~s0)) + m4 + 0xe7d3fbc8;
            s1 = ((t << 20) | (t >>> (32 - 20))) + s2;
            var t = s0 + ((s1 & s3) | (s2 & ~s3)) + m9 + 0x21e1cde6;
            s0 = ((t << 5)  | (t >>> (32 - 5))) + s1;
            var t = s3 + ((s0 & s2) | (s1 & ~s2)) + m14 + 0xc33707d6;
            s3 = ((t << 9)  | (t >>> (32 - 9))) + s0;
            var t = s2 + ((s3 & s1) | (s0 & ~s1)) + m3 + 0xf4d50d87;
            s2 = ((t << 14) | (t >>> (32 - 14))) + s3;
            var t = s1 + ((s2 & s0) | (s3 & ~s0)) + m8 + 0x455a14ed;
            s1 = ((t << 20) | (t >>> (32 - 20))) + s2;
            var t = s0 + ((s1 & s3) | (s2 & ~s3)) + m13 + 0xa9e3e905;
            s0 = ((t << 5)  | (t >>> (32 - 5))) + s1;
            var t = s3 + ((s0 & s2) | (s1 & ~s2)) + m2 + 0xfcefa3f8;
            s3 = ((t << 9)  | (t >>> (32 - 9))) + s0;
            var t = s2 + ((s3 & s1) | (s0 & ~s1)) + m7 + 0x676f02d9;
            s2 = ((t << 14) | (t >>> (32 - 14))) + s3;
            var t = s1 + ((s2 & s0) | (s3 & ~s0)) + m12 + 0x8d2a4c8a;
            s1 = ((t << 20) | (t >>> (32 - 20))) + s2;

            // Rounds 33..48
            var t = s0 + (s1 ^ s2 ^ s3) + m5 + 0xfffa3942;
            s0 = ((t << 4)  | (t >>> (32 - 4))) + s1;
            var t = s3 + (s0 ^ s1 ^ s2) + m8 + 0x8771f681;
            s3 = ((t << 11) | (t >>> (32 - 11))) + s0;
            var t = s2 + (s3 ^ s0 ^ s1) + m11 + 0x6d9d6122;
            s2 = ((t << 16) | (t >>> (32 - 16))) + s3;
            var t = s1 + (s2 ^ s3 ^ s0) + m14 + 0xfde5380c;
            s1 = ((t << 23) | (t >>> (32 - 23))) + s2;
            var t = s0 + (s1 ^ s2 ^ s3) + m1 + 0xa4beea44;
            s0 = ((t << 4)  | (t >>> (32 - 4))) + s1;
            var t = s3 + (s0 ^ s1 ^ s2) + m4 + 0x4bdecfa9;
            s3 = ((t << 11) | (t >>> (32 - 11))) + s0;
            var t = s2 + (s3 ^ s0 ^ s1) + m7 + 0xf6bb4b60;
            s2 = ((t << 16) | (t >>> (32 - 16))) + s3;
            var t = s1 + (s2 ^ s3 ^ s0) + m10 + 0xbebfbc70;
            s1 = ((t << 23) | (t >>> (32 - 23))) + s2;
            var t = s0 + (s1 ^ s2 ^ s3) + m13 + 0x289b7ec6;
            s0 = ((t << 4)  | (t >>> (32 - 4))) + s1;
            var t = s3 + (s0 ^ s1 ^ s2) + m0 + 0xeaa127fa;
            s3 = ((t << 11) | (t >>> (32 - 11))) + s0;
            var t = s2 + (s3 ^ s0 ^ s1) + m3 + 0xd4ef3085;
            s2 = ((t << 16) | (t >>> (32 - 16))) + s3;
            var t = s1 + (s2 ^ s3 ^ s0) + m6 + 0x04881d05;
            s1 = ((t << 23) | (t >>> (32 - 23))) + s2;
            var t = s0 + (s1 ^ s2 ^ s3) + m9 + 0xd9d4d039;
            s0 = ((t << 4)  | (t >>> (32 - 4))) + s1;
            var t = s3 + (s0 ^ s1 ^ s2) + m12 + 0xe6db99e5;
            s3 = ((t << 11) | (t >>> (32 - 11))) + s0;
            var t = s2 + (s3 ^ s0 ^ s1) + m15 + 0x1fa27cf8;
            s2 = ((t << 16) | (t >>> (32 - 16))) + s3;
            var t = s1 + (s2 ^ s3 ^ s0) + m2 + 0xc4ac5665;
            s1 = ((t << 23) | (t >>> (32 - 23))) + s2;

            // Rounds 49..64
            var t = s0 + (s2 ^ (s1 | ~s3)) + m0 + 0xf4292244;
            s0 = ((t << 6)  | (t >>> (32 - 6))) + s1;
            var t = s3 + (s1 ^ (s0 | ~s2)) + m7 + 0x432aff97;
            s3 = ((t << 10) | (t >>> (32 - 10))) + s0;
            var t = s2 + (s0 ^ (s3 | ~s1)) + m14 + 0xab9423a7;
            s2 = ((t << 15) | (t >>> (32 - 15))) + s3;
            var t = s1 + (s3 ^ (s2 | ~s0)) + m5 + 0xfc93a039;
            s1 = ((t << 21) | (t >>> (32 - 21))) + s2;
            var t = s0 + (s2 ^ (s1 | ~s3)) + m12 + 0x655b59c3;
            s0 = ((t << 6)  | (t >>> (32 - 6))) + s1;
            var t = s3 + (s1 ^ (s0 | ~s2)) + m3 + 0x8f0ccc92;
            s3 = ((t << 10) | (t >>> (32 - 10))) + s0;
            var t = s2 + (s0 ^ (s3 | ~s1)) + m10 + 0xffeff47d;
            s2 = ((t << 15) | (t >>> (32 - 15))) + s3;
            var t = s1 + (s3 ^ (s2 | ~s0)) + m1 + 0x85845dd1;
            s1 = ((t << 21) | (t >>> (32 - 21))) + s2;
            var t = s0 + (s2 ^ (s1 | ~s3)) + m8 + 0x6fa87e4f;
            s0 = ((t << 6)  | (t >>> (32 - 6))) + s1;
            var t = s3 + (s1 ^ (s0 | ~s2)) + m15 + 0xfe2ce6e0;
            s3 = ((t << 10) | (t >>> (32 - 10))) + s0;
            var t = s2 + (s0 ^ (s3 | ~s1)) + m6 + 0xa3014314;
            s2 = ((t << 15) | (t >>> (32 - 15))) + s3;
            var t = s1 + (s3 ^ (s2 | ~s0)) + m13 + 0x4e0811a1;
            s1 = ((t << 21) | (t >>> (32 - 21))) + s2;
            var t = s0 + (s2 ^ (s1 | ~s3)) + m4 + 0xf7537e82;
            s0 = ((t << 6)  | (t >>> (32 - 6))) + s1;
            var t = s3 + (s1 ^ (s0 | ~s2)) + m11 + 0xbd3af235;
            s3 = ((t << 10) | (t >>> (32 - 10))) + s0;
            var t = s2 + (s0 ^ (s3 | ~s1)) + m2 + 0x2ad7d2bb;
            s2 = ((t << 15) | (t >>> (32 - 15))) + s3;
            var t = s1 + (s3 ^ (s2 | ~s0)) + m9 + 0xeb86d391;
            s1 = ((t << 21) | (t >>> (32 - 21))) + s2;

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
            var s = this._state;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                var word = s[i];
                s[i] = (
                    (((word << 8)  | (word >>> 24)) & 0x00ff00ff) |
                    (((word << 24) | (word >>> 8))  & 0xff00ff00)
                );
            }

            // Return final hash
            return new WordArray(s);
        },

        clone: function () {
            var clone = MD5.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        }
    });
}());
