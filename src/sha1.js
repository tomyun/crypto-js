(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Hash = C_lib.Hash;
    var C_algo = C.algo;

    /**
     * SHA-1 hash algorithm.
     */
    var C_algo_SHA1 = C_algo.SHA1 = C_lib_Hash.extend({
        _doReset: function () {
            // Shortcut
            var H = this._hash.words;

            // Initial values
            H[0] = 0x67452301;
            H[1] = 0xefcdab89;
            H[2] = 0x98badcfe;
            H[3] = 0x10325476;
            H[4] = 0xc3d2e1f0;
        },

        _doHashBlock: function (offset) {
            // Shortcuts
            var m = this._message.words;
            var H = this._hash.words;

            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            var w = [];
            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    w[i] = m[offset + i] | 0;
                } else {
                    var n = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
                    w[i] = (n << 1) | (n >>> 31);
                }

                var t = ((a << 5) | (a >>> 27)) + e + w[i];
                if      (i < 20) t += ((b & c) | (~b & d)) + 0x5a827999;
                else if (i < 40) t += (b ^ c ^ d) + 0x6ed9eba1;
                else if (i < 60) t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                else             t += (b ^ c ^ d) - 0x359d3e2a;

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
        },

        _doCompute: function () {
            // Shortcuts
            var message = this._message;
            var messageWords = message.words;

            var nBitsTotal = this._length * 8;
            var nBitsLeft = message.sigBytes * 8;

            // Add padding
            messageWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            messageWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            message.sigBytes = messageWords.length * 4;

            // Hash final blocks
            this._hashBlocks();
        }
    });

    // Helpers
    C.SHA1 = C_lib_Hash._createHelper(C_algo_SHA1);
    C.HMAC_SHA1 = C_lib_Hash._createHmacHelper(C_algo_SHA1);
}());
