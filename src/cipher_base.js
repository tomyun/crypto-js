(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_lib_WordArray = C_lib.WordArray;
    var C_enc = C.enc;
    var C_enc_Utf8 = C_enc.Utf8;
    var C_enc_Base64 = C_enc.Base64;
    var C_EvpKDF = C.EvpKDF;

    /**
     * Cipher namespace.
     */
    var C_cipher = C.cipher = {};

    /**
     * A collection of ciphertext properties.
     *
     * @property {CryptoJS.lib.WordArray} rawCiphertext The raw ciphertext.
     * @property {CryptoJS.lib.WordArray} key (Optional) The key to this ciphertext.
     * @property {CryptoJS.lib.WordArray} iv (Optional) The IV used in the ciphering operation.
     * @property {CryptoJS.lib.WordArray} salt (Optional) The salt used with a key derivation function.
     * @property {CryptoJS.cipher.format.*} formatter The default formatting strategy to use to
     *                                                convert this ciphertext object to a string.
     */
    var C_cipher_Ciphertext = C_cipher.Ciphertext = C_lib_Base.extend({
        /**
         * Initializes a newly created ciphertext object.
         *
         * @param {CryptoJS.lib.WordArray} rawCiphertext The raw ciphertext.
         * @param {Object} optionalProperties (Optional) Any additional properties such as key, IV, or salt.
         */
        init: function (rawCiphertext, optionalProperties) {
            if (optionalProperties) {
                this.mixIn(optionalProperties);
            }

            this.rawCiphertext = rawCiphertext;
        },

        /**
         * Converts this ciphertext object to a string.
         *
         * @param {CryptoJS.cipher.format.*} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified ciphertext.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         */
        toString: function (formatter) {
            return (formatter || this.formatter).toString(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_cipher_format = C_cipher.format = {};

    /**
     * OpenSSL-compatible formatting strategy.
     */
    var C_cipher_format_OpenSSL = C_cipher_format.OpenSSL = C_lib_Base.extend({
        /**
         * Converts the passed ciphertext object to an OpenSSL-compatible string.
         *
         * @param {CryptoJS.cipher.Ciphertext} ciphertext The ciphertext object.
         *
         * @return {Base-64 string} The OpenSSL-compatible string.
         *
         * @static
         */
        toString: function (ciphertext) {
            // Shortcuts
            var rawCiphertext = ciphertext.rawCiphertext;
            var salt = ciphertext.salt;

            // Format
            if (salt) {
                var openSSLStr = C_lib_WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(rawCiphertext);
            } else {
                var openSSLStr = rawCiphertext;
            }

            return openSSLStr.toString(C_enc_Base64);
        },

        /**
         * Converts the passed OpenSSL-compatible string to a ciphertext object.
         *
         * @param {Base-64 string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CryptoJS.cipher.Ciphertext} The ciphertext object.
         *
         * @static
         */
        fromString: function (openSSLStr) {
            var rawCiphertext = C_enc_Base64.fromString(openSSLStr);

            // Shortcut
            var rawCiphertextWords = rawCiphertext.words;

            // Test for salt
            if (rawCiphertextWords[0] == 0x53616c74 && rawCiphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = rawCiphertext.$super.create(rawCiphertextWords.slice(2, 4));

                // Remove salt from raw data
                rawCiphertextWords.splice(0, 4);
                rawCiphertext.sigBytes -= 16;
            }

            return C_cipher_Ciphertext.create(rawCiphertext, { salt: salt });
        }
    });

    /**
     * Key derivation function namespace.
     */
    var C_cipher_kdf = C_cipher.kdf = {};

    /**
     * OpenSSL-compatible key derivation function.
     */
    var C_cipher_kdf_OpenSSL = C_cipher_kdf.OpenSSL = C_lib_Base.extend({
        /**
         * Derives a key and IV from the passed password.
         *
         * @param {CryptoJS.cipher.Base} cipher The cipher to generate a key for.
         * @param {UTF-8 string} password The password to derive from.
         * @param {CryptoJS.lib.WordArray|UTF-8 string} salt
         *   (Optional) A salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {Object} An object with properties "key", "iv", and "salt".
         *
         * @static
         */
        execute: function (cipher, password, salt) {
            // Generate random salt
            if ( ! salt) {
                salt = C_lib_WordArray.random(8);
            }

            // Shortcuts
            var cipherKeySize = cipher.keySize;
            var cipherIvSize = cipher.ivSize;

            // Derive key and IV
            var key = C_EvpKDF.compute(password, salt, { keySize: cipherKeySize + cipherIvSize });

            // Separate key and IV
            var iv = key.$super.create(key.words.slice(cipherKeySize));
            key.sigBytes = cipherKeySize * 4;

            return { key: key, iv: iv, salt: salt };
        }
    });

    /**
     * Base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4
     * @property {number} ivSize This cipher's IV size. Default: 4
     */
    var C_cipher_Base = C_cipher.Base = (function () {
        var Base = C_lib_Base.extend({
            /**
             * Configuration options.
             *
             * @property {CryptoJS.cipher.format.*} format The formatting strategy to use when converting the ciphertext
             *                                             to and from a string. Default: CryptoJS.cipher.format.OpenSSL
             * @property {CryptoJS.cipher.kdf.*} kdf The key derivation function to use to generate a key, IV and salt
             *                                       from a password. Default: CryptoJS.cipher.kdf.OpenSSL
             * @property {CryptoJS.lib.WordArray} iv The IV to use for this operation.
             */
            _cfg: C_lib_Base.extend({
                format: C_cipher_format_OpenSSL,
                kdf: C_cipher_kdf_OpenSSL
            }),

            /**
             * Initializes a newly created cipher.
             *
             * @param {CryptoJS.lib.WordArray|UTF-8 string} password
             *   If password is a UTF-8 string, then it's passed to a key derivation function.
             *   If password is a WordArray, then it's treated as the key itself.
             *   If you pass the key itself, then you must also provide an IV in the configuration
             *   options if this cipher needs one.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             */
            init: function (password, cfg) {
                // Apply config defaults
                this._cfg = this._cfg.extend(cfg);

                // Remember password
                this._key = password;
            },

            /**
             * If called on a cipher instance, encrypts the passed message using this cipher's key and configuration.
             *
             *   @param {CryptoJS.lib.WordArray|UTF-8 string} message The message to encrypt.
             *
             *   @return {CryptoJS.cipher.Ciphertext} A ciphertext object.
             *
             * If called statically, creates a new cipher instance and completes the entire encryption operation.
             *
             *   @param {CryptoJS.lib.WordArray|UTF-8 string} message The message to encrypt.
             *   @param {CryptoJS.lib.WordArray|UTF-8 string} password
             *     If password is a UTF-8 string, then it's passed to a key derivation function.
             *     If password is a WordArray, then it's treated as the key itself.
             *     If you pass the key itself, then you must also provide an IV in the configuration
             *     options if this cipher needs one.
             *   @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             *   @return {CryptoJS.cipher.Ciphertext} A ciphertext object.
             */
            encrypt: function () {
                return (this._key ? encryptInstance : encryptStatic).apply(this, arguments);
            },

            /**
             * If called on a cipher instance, decrypts the passed ciphertext using this cipher's key and configuration.
             *
             *   @param {CryptoJS.cipher.Ciphertext|formatted ciphertext string} ciphertext The ciphertext to decrypt.
             *
             *   @return {CryptoJS.lib.WordArray} The decrypted plaintext.
             *
             * If called statically, creates a new cipher instance and completes the entire decryption operation.
             *
             *   @param {CryptoJS.cipher.Ciphertext|formatted ciphertext string} ciphertext The ciphertext to decrypt.
             *   @param {CryptoJS.lib.WordArray|UTF-8 string} password
             *     If password is a UTF-8 string, then it's passed to a key derivation function.
             *     If password is a WordArray, then it's treated as the key itself.
             *     If you pass the key itself, then you must also provide an IV in the configuration
             *     options if this cipher needs one.
             *   @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             *   @return {CryptoJS.lib.WordArray} The decrypted plaintext.
             */
            decrypt: function () {
                return (this._key ? decryptInstance : decryptStatic).apply(this, arguments);
            },

            keySize: 4,

            ivSize: 4
        });

        function encryptInstance(message) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                this._data = C_enc_Utf8.fromString(message);
            } else {
                this._data = message.clone();
            }

            // Init key
            initKey.call(this);

            // Perform cipher-specific logic
            this._doEncrypt();

            // Shortcut
            var cfg = this._cfg;

            // Create ciphertext object
            var ciphertext = C_cipher_Ciphertext.create(this._data, {
                key: this._key,
                iv: cfg.iv,
                salt: this._salt,
                formatter: cfg.format
            });

            return ciphertext;
        }

        function encryptStatic(message, password, cfg) {
            return this.create(password, cfg).encrypt(message);
        }

        function decryptInstance(ciphertext) {
            // Convert string to ciphertext object, else assume ciphertext object already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.fromString(ciphertext);
            }

            // Extract parts
            this._data = ciphertext.rawCiphertext.clone();
            this._salt = ciphertext.salt;

            // Init key
            initKey.call(this);

            // Perform cipher-specific logic
            this._doDecrypt();

            return this._data;
        }

        function decryptStatic(ciphertext, password, cfg) {
            return this.create(password, cfg).decrypt(ciphertext);
        }

        function initKey() {
            // Shortcut
            var cfg = this._cfg;
            var password = this._key;

            // Convert password to key, else assume key already
            if (typeof password == 'string') {
                var o = cfg.kdf.execute(this, password, this._salt);

                this._key = o.key;
                this._salt = o.salt;
                cfg.iv = o.iv;
            }
        }

        return Base;
    }());

    /**
     * Base stream cipher template.
     */
    var C_cipher_Stream = C_cipher.Stream = C_cipher_Base.extend({
        _doDecrypt: function () {
            return this._doEncrypt.apply(this, arguments);
        }
    });
}());
