(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Rotate constants
    var R = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
        5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
        4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
        6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];

    // Constants table constructed from the sine function
    var K = [];
    (function () {
        for (var i = 0; i < 64; i++) {
            K[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
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

            // Shortcut
            var state = this._state;

            // Working variables
            var a = state[0];
            var b = state[1];
            var c = state[2];
            var d = state[3];

            // Rounds
            for (var round = 0; round < 64; round++) {
                if (round < 16) {
                    var f = (b & c) | (~b & d);
                    var g = round;
                } else if (round < 32) {
                    var f = (d & b) | (~d & c);
                    var g = 5 * round + 1;
                } else if (round < 48) {
                    var f = b ^ c ^ d;
                    var g = 3 * round + 5;
                } else {
                    var f = c ^ (b | ~d);
                    var g = 7 * round;
                }

                var n = a + f + K[round] + m[offset + (g % 16)];
                var r = R[round];

                var t = d;
                d = c;
                c = b;
                b = (b + ((n << r) | (n >>> (32 - r)))) | 0;
                a = t;
            }

            // Update state
            state[0] = (state[0] + a) | 0;
            state[1] = (state[1] + b) | 0;
            state[2] = (state[2] + c) | 0;
            state[3] = (state[3] + d) | 0;
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
}(Math));
