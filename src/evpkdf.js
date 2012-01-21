(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_lib_WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var C_algo_MD5 = C_algo.MD5;

    /**
     * This key derivation function is meant to conform with EVP_BytesToKey.
     * www.openssl.org/docs/crypto/EVP_BytesToKey.html
     */
    var C_algo_EvpKDF = C_algo.EvpKDF = {
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {CryptoJS.lib.Hash} hasher The hash algorithm to use. Default: CryptoJS.algo.MD5
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        _cfg: C_lib_Base.extend({
            keySize: 128/32,
            hasher: C_algo_MD5,
            iterations: 1
        }),

        /**
         * Derives a key from a password.
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

            // Init hasher
            var hasher = cfg.hasher.create();

            // Initial values
            var derivedKey = C_lib_WordArray.create();

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                if (block) {
                    hasher.update(block);
                }
                var block = hasher.update(password).compute(salt);

                // Iterations
                for (var i = 1; i < iterations; i++) {
                    block = hasher.compute(block);
                }

                derivedKey.concat(block);
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    };

    // Helper
    C.EvpKDF = function (password, salt, cfg) {
        return C_algo_EvpKDF.compute(password, salt, cfg);
    };
}());
