(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Hash = C_lib.Hash;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            for (var factor = 2; factor * factor <= n; factor++) {
                if (n % factor == 0) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var nPrime = 0, n = 2;
        while (nPrime < 64) {
            if (isPrime(n)) {
                K[nPrime] = getFractionalBits(Math.pow(n, 1/3));
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1/2));
                }

                nPrime++;
            }

            n++;
        }
    }());

    /**
     * SHA-256 hash algorithm.
     */
    var C_algo_SHA256 = C_algo.SHA256 = C_lib_Hash.extend({
        _doReset: function () {
            this._hash.words = H.slice(0);
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
            var f = H[5];
            var g = H[6];
            var h = H[7];

            var w = [];
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    w[i] = m[offset + i] | 0;
                } else {
                    var gamma0x = w[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>>  7)) ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                  ((gamma0x >>> 3)                   );

                    var gamma1x = w[i - 2];
                    var gamma1  = ((gamma1x <<  15) | (gamma1x >>> 17)) ^
                                  ((gamma1x <<  13) | (gamma1x >>> 19)) ^
                                  ((gamma1x >>> 10)                   );

                    w[i] = gamma0 + w[i - 7] + gamma1 + w[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>>  2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>>  6)) ^ ((e << 21) | (e >>> 11)) ^ ((e <<  7) | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + w[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
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
    C.SHA256 = C_lib_Hash._createHelper(C_algo_SHA256);
    C.HMAC_SHA256 = C_lib_Hash._createHmacHelper(C_algo_SHA256);
}());
