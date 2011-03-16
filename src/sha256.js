(function (C) {
    var SHA256 = C.algo.SHA256 = C.lib.Hasher.extend({
        doReset: function () {
            // Shortcuts
            var H = this.hash.words;

            // Initial values
            H[0] = 0x6a09e667;
            H[1] = 0xbb67ae85;
            H[2] = 0x3c6ef372;
            H[3] = 0xa54ff53a;
            H[4] = 0x510e527f;
            H[5] = 0x9b05688c;
            H[6] = 0x1f83d9ab;
            H[7] = 0x5be0cd19;
        },

        doHashBlock: function (offset) {
            // Shortcuts
            var m = this.message.words;
            var H = this.hash.words;

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
                    w[i] = m[i + offset] >>> 0;
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

                var sigma0 = ((a << 30) | (a >>>  2)) ^
                             ((a << 19) | (a >>> 13)) ^
                             ((a << 10) | (a >>> 22));

                var sigma1 = ((e << 26) | (e >>>  6)) ^
                             ((e << 21) | (e >>> 11)) ^
                             ((e <<  7) | (e >>> 25));

                var t1 = (h + sigma1 + ch + K[i] + w[i]) >>> 0;
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = d + t1;
                d = c;
                c = b;
                b = a;
                a = t1 + t2;
            }

            H[0] = (H[0] + a) >>> 0;
            H[1] = (H[1] + b) >>> 0;
            H[2] = (H[2] + c) >>> 0;
            H[3] = (H[3] + d) >>> 0;
            H[4] = (H[4] + e) >>> 0;
            H[5] = (H[5] + f) >>> 0;
            H[6] = (H[6] + g) >>> 0;
            H[7] = (H[7] + h) >>> 0;
        },

        doCompute: function () {
            // Shortcuts
            var message = this.message;
            var m = message.words;

            var nBitsTotal = this.length * 8;
            var nBitsLeft = message.sigBytes * 8;

            // Add padding
            m[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            m[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            message.sigBytes = m.length * 4;

            // Hash final blocks
            this.hashBlocks();
        }
    });

    // Constants
    var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Shortcut
    C.SHA256 = function (message) {
        return SHA256.create().compute(message);
    };
}(CryptoJS));
