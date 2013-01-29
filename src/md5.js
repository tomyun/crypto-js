(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Constants tables
    var ROUND_CONSTANTS  = [];
    var ROTATION_OFFSETS = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

    // Compute round constants
    (function () {
        for (var i = 0; i < 64; i++) {
            ROUND_CONSTANTS[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
    }());

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
            var _s0 = s0;
            var _s1 = s1;
            var _s2 = s2;
            var _s3 = s3;

            // Rounds
            for (var round = 0; round < 64; round++) {
                // Inline round 1
                {
                    if (round < 16) {
                        var f = (s1 & s2) | (~s1 & s3);
                        var mIndex = round;
                    } else if (round < 32) {
                        var f = (s1 & s3) | (s2 & ~s3);
                        var mIndex = round * 5 + 1;
                    } else if (round < 48) {
                        var f = s1 ^ s2 ^ s3;
                        var mIndex = round * 3 + 5;
                    } else {
                        var f = s2 ^ (s1 | ~s3);
                        var mIndex = round * 7;
                    }

                    var t = f + s0 + m[mIndex % 16] + ROUND_CONSTANTS[round];
                    var rotationOffset = ROTATION_OFFSETS[((round >>> 2) & 0xc) | (round & 0x3)];
                    s0 = (s1 + ((t << rotationOffset) | (t >>> (32 - rotationOffset)))) | 0;
                }

                // Inline round 2
                {
                    if (++round < 16) {
                        var f = (s0 & s1) | (~s0 & s2);
                        var mIndex = round;
                    } else if (round < 32) {
                        var f = (s0 & s2) | (s1 & ~s2);
                        var mIndex = round * 5 + 1;
                    } else if (round < 48) {
                        var f = s0 ^ s1 ^ s2;
                        var mIndex = round * 3 + 5;
                    } else {
                        var f = s1 ^ (s0 | ~s2);
                        var mIndex = round * 7;
                    }

                    var t = f + s3 + m[mIndex % 16] + ROUND_CONSTANTS[round];
                    var rotationOffset = ROTATION_OFFSETS[((round >>> 2) & 0xc) | (round & 0x3)];
                    s3 = (s0 + ((t << rotationOffset) | (t >>> (32 - rotationOffset)))) | 0;
                }

                // Inline round 3
                {
                    if (++round < 16) {
                        var f = (s3 & s0) | (~s3 & s1);
                        var mIndex = round;
                    } else if (round < 32) {
                        var f = (s3 & s1) | (s0 & ~s1);
                        var mIndex = round * 5 + 1;
                    } else if (round < 48) {
                        var f = s3 ^ s0 ^ s1;
                        var mIndex = round * 3 + 5;
                    } else {
                        var f = s0 ^ (s3 | ~s1);
                        var mIndex = round * 7;
                    }

                    var t = f + s2 + m[mIndex % 16] + ROUND_CONSTANTS[round];
                    var rotationOffset = ROTATION_OFFSETS[((round >>> 2) & 0xc) | (round & 0x3)];
                    s2 = (s3 + ((t << rotationOffset) | (t >>> (32 - rotationOffset)))) | 0;
                }

                // Inline round 4
                {
                    if (++round < 16) {
                        var f = (s2 & s3) | (~s2 & s0);
                        var mIndex = round;
                    } else if (round < 32) {
                        var f = (s2 & s0) | (s3 & ~s0);
                        var mIndex = round * 5 + 1;
                    } else if (round < 48) {
                        var f = s2 ^ s3 ^ s0;
                        var mIndex = round * 3 + 5;
                    } else {
                        var f = s3 ^ (s2 | ~s0);
                        var mIndex = round * 7;
                    }

                    var t = f + s1 + m[mIndex % 16] + ROUND_CONSTANTS[round];
                    var rotationOffset = ROTATION_OFFSETS[((round >>> 2) & 0xc) | (round & 0x3)];
                    s1 = (s2 + ((t << rotationOffset) | (t >>> (32 - rotationOffset)))) | 0;
                }
            }

            // Update state
            s[0] = (_s0 + s0) | 0;
            s[1] = (_s1 + s1) | 0;
            s[2] = (_s2 + s2) | 0;
            s[3] = (_s3 + s3) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsLeft = data.sigBytes * 8;
            var nBitsTotalMsw = this._nDataBitsMsw;
            var nBitsTotalLsw = this._nDataBitsLsw;

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
}(Math));
