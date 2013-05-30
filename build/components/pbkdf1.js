(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var C_algo = C.algo;

    /**
     * Password-Based Key Derivation Function 1 algorithm.
     */
    var PBKDF1 = C_algo.PBKDF1 = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
            keySize: 128/32,
            hasher: C_algo.SHA1,
            iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.PBKDF1.create();
         *     var kdf = CryptoJS.algo.PBKDF1.create({ keySize: 4 });
         *     var kdf = CryptoJS.algo.PBKDF1.create({ keySize: 4, iterations: 1000 });
         */
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Computes the Password-Based Key Derivation Function 1.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init hasher
            var hasher = cfg.hasher.create();

            // Shortcuts
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            var derivedKey = hasher.update(password).finalize(salt);
            hasher.reset();
            for (var i = 1; i < iterations; i++) {
                derivedKey = hasher.finalize(derivedKey);
                hasher.reset();
            }

            var desiredSigBytes = keySize * 4;
            if (desiredSigBytes <= derivedKey.sigBytes) {
                derivedKey.sigBytes = desiredSigBytes;
            } else {
                throw new Error('Key size cannot be longer than the hash');
            }

            return derivedKey;
        }
    });

    /**
     * Computes the Password-Based Key Derivation Function 1.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     * @param {Object} cfg (Optional) The configuration options to use for this computation.
     *
     * @return {WordArray} The derived key.
     *
     * @static
     *
     * @example
     *
     *     var key = CryptoJS.PBKDF1(password, salt);
     *     var key = CryptoJS.PBKDF1(password, salt, { keySize: 4 });
     *     var key = CryptoJS.PBKDF1(password, salt, { keySize: 4, iterations: 1000 });
     */
    C.PBKDF1 = function (password, salt, cfg) {
        return PBKDF1.create(cfg).compute(password, salt);
    };
}());
