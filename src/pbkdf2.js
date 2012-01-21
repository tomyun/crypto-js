(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_lib_WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var C_algo_SHA1 = C_algo.SHA1;
    var C_algo_HMAC = C_algo.HMAC;

    /**
     * Password-Based Key Derivation Function 2 algorithm.
     */
    var C_algo_PBKDF2 = C_algo.PBKDF2 = {
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {CryptoJS.lib.Hash} hasher The hash algorithm to use. Default: CryptoJS.algo.SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        _cfg: C_lib_Base.extend({
            keySize: 128/32,
            hasher: C_algo_SHA1,
            iterations: 1
        }),

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {CryptoJS.lib.WordArray|string} password The password.
         * @param {CryptoJS.lib.WordArray|string} salt A salt.
         * @param {Object} cfg (Optional) The configuration options to use for this computation.
         *
         * @return {CryptoJS.lib.WordArray} The derived key.
         *
         * @static
         */
        compute: function (password, salt, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Init HMAC
            var hmac = C_algo_HMAC.create(cfg.hasher, password);

            // Initial values
            var derivedKey = C_lib_WordArray.create();
            var blockIndex = C_lib_WordArray.create([1]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).compute(blockIndex);

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                    intermediate = hmac.compute(intermediate);

                    // Shortcut
                    var intermediateWords = intermediate.words;

                    // XOR intermediate with block
                    for (var j = 0; j < blockWordsLength; j++) {
                        blockWords[j] ^= intermediateWords[j];
                    }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    };

    // Helper
    C.PBKDF2 = function (password, salt, cfg) {
        return C_algo_PBKDF2.compute(password, salt, cfg);
    };
}());
