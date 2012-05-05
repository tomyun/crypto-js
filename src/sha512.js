(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Hasher = C_lib.Hasher;
    var C_x64 = C.x64;
    var X64Word = C_x64.Word;
    var X64WordArray = C_x64.WordArray;
    var C_algo = C.algo;

    // Constants
    var K = [
        X64Word.create(0x428a2f98, 0xd728ae22), X64Word.create(0x71374491, 0x23ef65cd),
        X64Word.create(0xb5c0fbcf, 0xec4d3b2f), X64Word.create(0xe9b5dba5, 0x8189dbbc),
        X64Word.create(0x3956c25b, 0xf348b538), X64Word.create(0x59f111f1, 0xb605d019),
        X64Word.create(0x923f82a4, 0xaf194f9b), X64Word.create(0xab1c5ed5, 0xda6d8118),
        X64Word.create(0xd807aa98, 0xa3030242), X64Word.create(0x12835b01, 0x45706fbe),
        X64Word.create(0x243185be, 0x4ee4b28c), X64Word.create(0x550c7dc3, 0xd5ffb4e2),
        X64Word.create(0x72be5d74, 0xf27b896f), X64Word.create(0x80deb1fe, 0x3b1696b1),
        X64Word.create(0x9bdc06a7, 0x25c71235), X64Word.create(0xc19bf174, 0xcf692694),
        X64Word.create(0xe49b69c1, 0x9ef14ad2), X64Word.create(0xefbe4786, 0x384f25e3),
        X64Word.create(0x0fc19dc6, 0x8b8cd5b5), X64Word.create(0x240ca1cc, 0x77ac9c65),
        X64Word.create(0x2de92c6f, 0x592b0275), X64Word.create(0x4a7484aa, 0x6ea6e483),
        X64Word.create(0x5cb0a9dc, 0xbd41fbd4), X64Word.create(0x76f988da, 0x831153b5),
        X64Word.create(0x983e5152, 0xee66dfab), X64Word.create(0xa831c66d, 0x2db43210),
        X64Word.create(0xb00327c8, 0x98fb213f), X64Word.create(0xbf597fc7, 0xbeef0ee4),
        X64Word.create(0xc6e00bf3, 0x3da88fc2), X64Word.create(0xd5a79147, 0x930aa725),
        X64Word.create(0x06ca6351, 0xe003826f), X64Word.create(0x14292967, 0x0a0e6e70),
        X64Word.create(0x27b70a85, 0x46d22ffc), X64Word.create(0x2e1b2138, 0x5c26c926),
        X64Word.create(0x4d2c6dfc, 0x5ac42aed), X64Word.create(0x53380d13, 0x9d95b3df),
        X64Word.create(0x650a7354, 0x8baf63de), X64Word.create(0x766a0abb, 0x3c77b2a8),
        X64Word.create(0x81c2c92e, 0x47edaee6), X64Word.create(0x92722c85, 0x1482353b),
        X64Word.create(0xa2bfe8a1, 0x4cf10364), X64Word.create(0xa81a664b, 0xbc423001),
        X64Word.create(0xc24b8b70, 0xd0f89791), X64Word.create(0xc76c51a3, 0x0654be30),
        X64Word.create(0xd192e819, 0xd6ef5218), X64Word.create(0xd6990624, 0x5565a910),
        X64Word.create(0xf40e3585, 0x5771202a), X64Word.create(0x106aa070, 0x32bbd1b8),
        X64Word.create(0x19a4c116, 0xb8d2d0c8), X64Word.create(0x1e376c08, 0x5141ab53),
        X64Word.create(0x2748774c, 0xdf8eeb99), X64Word.create(0x34b0bcb5, 0xe19b48a8),
        X64Word.create(0x391c0cb3, 0xc5c95a63), X64Word.create(0x4ed8aa4a, 0xe3418acb),
        X64Word.create(0x5b9cca4f, 0x7763e373), X64Word.create(0x682e6ff3, 0xd6b2b8a3),
        X64Word.create(0x748f82ee, 0x5defb2fc), X64Word.create(0x78a5636f, 0x43172f60),
        X64Word.create(0x84c87814, 0xa1f0ab72), X64Word.create(0x8cc70208, 0x1a6439ec),
        X64Word.create(0x90befffa, 0x23631e28), X64Word.create(0xa4506ceb, 0xde82bde9),
        X64Word.create(0xbef9a3f7, 0xb2c67915), X64Word.create(0xc67178f2, 0xe372532b),
        X64Word.create(0xca273ece, 0xea26619c), X64Word.create(0xd186b8c7, 0x21c0c207),
        X64Word.create(0xeada7dd6, 0xcde0eb1e), X64Word.create(0xf57d4f7f, 0xee6ed178),
        X64Word.create(0x06f067aa, 0x72176fba), X64Word.create(0x0a637dc5, 0xa2c898a6),
        X64Word.create(0x113f9804, 0xbef90dae), X64Word.create(0x1b710b35, 0x131c471b),
        X64Word.create(0x28db77f5, 0x23047d84), X64Word.create(0x32caab7b, 0x40c72493),
        X64Word.create(0x3c9ebe0a, 0x15c9bebc), X64Word.create(0x431d67c4, 0x9c100d4c),
        X64Word.create(0x4cc5d4be, 0xcb3e42b6), X64Word.create(0x597f299c, 0xfc657e2a),
        X64Word.create(0x5fcb6fab, 0x3ad6faec), X64Word.create(0x6c44198c, 0x4a475817)
    ];

    // Reusable object
    var W = [];

    /**
     * SHA-512 hash algorithm.
     */
    var SHA512 = C_algo.SHA512 = Hasher.extend({
        _doReset: function () {
            this._hash = X64WordArray.create([
                X64Word.create(0x6a09e667, 0xf3bcc908), X64Word.create(0xbb67ae85, 0x84caa73b),
                X64Word.create(0x3c6ef372, 0xfe94f82b), X64Word.create(0xa54ff53a, 0x5f1d36f1),
                X64Word.create(0x510e527f, 0xade682d1), X64Word.create(0x9b05688c, 0x2b3e6c1f),
                X64Word.create(0x1f83d9ab, 0xfb41bd6b), X64Word.create(0x5be0cd19, 0x137e2179)
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    W[i] = X64Word.create(M[offset + i * 2] | 0, M[offset + i * 2 + 1] | 0);
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = gamma0x.rotR(1).xor(gamma0x.rotR(8)).xor(gamma0x.shiftR(7));

                    var gamma1x = W[i - 2];
                    var gamma1  = gamma1x.rotR(19).xor(gamma1x.rotR(61)).xor(gamma1x.shiftR(6));

                    W[i] = gamma0.add(W[i - 7]).add(gamma1).add(W[i - 16]);
                }

                var ch  = e.and(f).xor(e.not().and(g));
                var maj = a.and(b).xor(a.and(c)).xor(b.and(c));

                var sigma0 = a.rotR(28).xor(a.rotR(34)).xor(a.rotR(39));
                var sigma1 = e.rotR(14).xor(e.rotR(18)).xor(e.rotR(41));

                var t1 = h.add(sigma1).add(ch).add(K[i]).add(W[i]);
                var t2 = sigma0.add(maj);

                h = g;
                g = f;
                f = e;
                e = d.add(t1);
                d = c;
                c = b;
                b = a;
                a = t1.add(t2);
            }

            // Intermediate hash value
            H[0] = H[0].add(a);
            H[1] = H[1].add(b);
            H[2] = H[2].add(c);
            H[3] = H[3].add(d);
            H[4] = H[4].add(e);
            H[5] = H[5].add(f);
            H[6] = H[6].add(g);
            H[7] = H[7].add(h);
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Convert hash to 32-bit word array before returning
            this._hash = this._hash.toX32();
        },

        blockSize: 1024/32
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA512('message');
     *     var hash = CryptoJS.SHA512(wordArray);
     */
    C.SHA512 = Hasher._createHelper(SHA512);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA512(message, key);
     */
    C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
}());
