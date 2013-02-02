(function (Math) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var WordArray = C_LIB.WordArray;
    var Hasher = C_LIB.Hasher;

    // Constants tables
    var RHO_OFFSETS = [];
    var PI_INDEXES  = [];
    var ROUND_CONSTANTS = [];

    // Compute rho offsets
    (function () {
        var x = 1;
        var y = 0;
        for (var t = 0; t < 24; t++) {
            RHO_OFFSETS[(x + 5 * y) * 2] = ((t + 1) * (t + 2) / 2) % 64;

            var newX = y % 5;
            var newY = (2 * x + 3 * y) % 5;
            x = newX;
            y = newY;
        }
    }());

    // Compute pi indexes
    (function () {
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
                PI_INDEXES[(x + 5 * y) * 2] = (y + ((2 * x + 3 * y) % 5) * 5) * 2;
            }
        }
    }());

    // Compute round constants
    (function () {
        var lfsr = 0x01;
        for (var i = 0; i < 48; i += 2) {
            var roundConstantMsw = 0;
            var roundConstantLsw = 0;

            for (var j = 0; j < 7; j++) {
                if (lfsr & 0x01) {
                    var bitPosition = (1 << j) - 1;
                    if (bitPosition < 32) {
                        roundConstantLsw ^= 1 << bitPosition;
                    } else {
                        roundConstantMsw ^= 1 << (bitPosition - 32);
                    }
                }

                // Compute next LFSR
                if (lfsr & 0x80) {
                    // Primitive polynomial over GF(2)
                    // x^8 + x^6 + x^5 + x^4 + 1
                    lfsr = (lfsr << 1) ^ 0x71;
                } else {
                    lfsr <<= 1;
                }
            }

            ROUND_CONSTANTS[i] = roundConstantMsw;
            ROUND_CONSTANTS[i + 1] = roundConstantLsw;
        }
    }());

    // Reusable objects for temporary values
    var T = [];

    /**
     * SHA-3 hash algorithm.
     */
    var SHA3 = C.SHA3 = Hasher.extend({
        /**
         * Configuration options.
         *
         * @property {number} outputLength
         *   The desired number of bits in the output hash.
         *   The output length must be one of 224, 256, 384, or 512.
         *   Default: 512
         */
        cfg: Hasher.prototype.cfg.extend({
            outputLength: 512
        }),

        _doInit: function () {
            // Shortcut
            var outputLength = this.cfg.outputLength;

            // <?php if ($debug): ?>
            {
                if (
                    outputLength !== 224 && outputLength !== 256 &&
                    outputLength !== 384 && outputLength !== 512
                ) {
                    throw new OutputLengthError('The output length must be one of 224, 256, 384, or 512.');
                }
            }
            // <?php endif ?>

            this.blockSize = 50 - outputLength / 16;
        },

        _doReset: function () {
            this._state = [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ];
        },

        _doProcessBlock: function (m) {
            // Shortcut
            var s = this._state;

            // Absorb
            var blockSize = this.blockSize;
            for (var i = 0; i < blockSize; i += 2) {
                // Shortcuts
                var mi  = m[i];
                var mi1 = m[i + 1];

                // Swap endian
                mi = (
                    (((mi << 8)  | (mi >>> 24)) & 0x00ff00ff) |
                    (((mi << 24) | (mi >>> 8))  & 0xff00ff00)
                );
                mi1 = (
                    (((mi1 << 8)  | (mi1 >>> 24)) & 0x00ff00ff) |
                    (((mi1 << 24) | (mi1 >>> 8))  & 0xff00ff00)
                );

                // Absorb message into state
                s[i] ^= mi1;
                s[i + 1] ^= mi;
            }

            // Rounds
            for (var round = 0; round < 48; round += 2) {
                // Theta
                for (var x = 0; x < 5; x++) {
                    // Mix column lanes
                    var tMsw = 0;
                    var tLsw = 0;
                    for (var y = 0; y < 5; y++) {
                        var laneIndex = (x + 5 * y) * 2;
                        tMsw ^= s[laneIndex];
                        tLsw ^= s[laneIndex + 1];
                    }

                    // Temporary values
                    var TIndex = x * 2;
                    T[TIndex] = tMsw;
                    T[TIndex + 1] = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                    // Shortcuts
                    var Tx1Index = ((x + 1) % 5) * 2;
                    var Tx4Index = ((x + 4) % 5) * 2;
                    var Tx1Msw = T[Tx1Index];
                    var Tx1Lsw = T[Tx1Index + 1];
                    var Tx4Msw = T[Tx4Index];
                    var Tx4Lsw = T[Tx4Index + 1];

                    // Mix surrounding columns
                    var tMsw = Tx4Msw ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                    var tLsw = Tx4Lsw ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                    for (var y = 0; y < 5; y++) {
                        var laneIndex = (x + 5 * y) * 2;
                        s[laneIndex] ^= tMsw;
                        s[laneIndex + 1] ^= tLsw;
                    }
                }

                // Rho Pi
                T[0] = s[0];
                T[1] = s[1];
                for (var laneIndex = 2; laneIndex < 50; laneIndex += 2) {
                    // Shortcuts
                    var laneMsw = s[laneIndex];
                    var laneLsw = s[laneIndex + 1];
                    var rhoOffset = RHO_OFFSETS[laneIndex];
                    var piIndex = PI_INDEXES[laneIndex];

                    // Rotate lanes
                    if (rhoOffset < 32) {
                        var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                        var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                    } else {
                        var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                        var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
                    }

                    // Transpose lanes
                    T[piIndex] = tMsw;
                    T[piIndex + 1] = tLsw;
                }

                // Chi
                for (var x = 0; x < 5; x++) {
                    for (var y = 0; y < 5; y++) {
                        // Shortcuts
                        var laneIndex = (x + 5 * y) * 2;
                        var Tx1LaneIndex = (((x + 1) % 5) + 5 * y) * 2;
                        var Tx2LaneIndex = (((x + 2) % 5) + 5 * y) * 2;

                        // Mix rows
                        s[laneIndex]     = T[laneIndex]     ^ (~T[Tx1LaneIndex]     & T[Tx2LaneIndex]);
                        s[laneIndex + 1] = T[laneIndex + 1] ^ (~T[Tx1LaneIndex + 1] & T[Tx2LaneIndex + 1]);
                    }
                }

                // Iota
                s[0] ^= ROUND_CONSTANTS[round];
                s[1] ^= ROUND_CONSTANTS[round + 1];
            }
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var nBitsLeft = data.sigBytes * 8;
            var blockSizeBits = this.blockSize * 32;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
            dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var s = this._state;
            var outputLengthBytes = this.cfg.outputLength / 8;
            var outputLengthLanes = outputLengthBytes / 8;

            // Squeeze
            var hashWords = [];
            for (var i = 0; i < outputLengthLanes; i++) {
                // Shortcuts
                var laneMsw = s[i * 2];
                var laneLsw = s[i * 2 + 1];

                // Swap endian
                laneMsw = (
                    (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
                    (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
                );
                laneLsw = (
                    (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
                    (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
                );

                // Squeeze state to retrieve hash
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
            }

            // Return final computed hash
            return new WordArray(hashWords, outputLengthBytes);
        },

        clone: function () {
            var clone = SHA3.$super.prototype.clone.call(this);
            clone._state = clone._state.slice(0);

            return clone;
        },

        // The block size varies depending on the output length
        blockSize: null
    });

    // <?php if ($debug): ?>
    {
        // Shortcut
        var C_ERR = C.err;

        /**
         * Output length error.
         */
        var OutputLengthError = C_ERR.OutputLengthError = Hasher.extend.call(Error);
    }
    // <?php endif ?>
}(Math));
