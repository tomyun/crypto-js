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
     * A collection of ciphertext properties.
     *
     * @property {CryptoJS.lib.WordArray} rawCiphertext The raw ciphertext.
     * @property {CryptoJS.lib.WordArray} key (Optional) The key to this ciphertext.
     * @property {CryptoJS.lib.WordArray} iv (Optional) The IV used in the ciphering operation.
     * @property {CryptoJS.lib.WordArray} salt (Optional) The salt used with a key derivation function.
     * @property {CryptoJS.cipher.format.*} formatter
     *   The default formatting strategy to use to convert this ciphertext object to a string.
     */
    var C_lib_Ciphertext = C_lib.Ciphertext = C_lib_Base.extend({
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
     * Cipher namespace.
     */
    var C_cipher = C.cipher = {};

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
         * @param {CryptoJS.lib.Ciphertext} ciphertext The ciphertext object.
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
         * @return {CryptoJS.lib.Ciphertext} The ciphertext object.
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

            return C_lib_Ciphertext.create(rawCiphertext, { salt: salt });
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
         * @param {CryptoJS.lib.Cipher} cipher The cipher to generate a key for.
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
    var C_lib_Cipher = C_lib.Cipher = (function () {
        var Cipher = C_lib_Base.extend({
            /**
             * Configuration options.
             *
             * @property {CryptoJS.cipher.format.*} format
             *   The formatting strategy to use when converting the ciphertext to and from a string.
             *   Default: CryptoJS.cipher.format.OpenSSL
             * @property {CryptoJS.cipher.kdf.*} kdf
             *   The key derivation function to use to generate a key, IV and salt from a password.
             *   Default: CryptoJS.cipher.kdf.OpenSSL
             * @property {CryptoJS.lib.WordArray} iv The IV to use for this operation.
             */
            _cfg: C_lib_Base.extend({
                format: C_cipher_format_OpenSSL,
                kdf: C_cipher_kdf_OpenSSL
            }),

            /**
             * Encrypts the passed message using the password and configuration.
             *
             * @param {CryptoJS.lib.WordArray|UTF-8 string} message The message to encrypt.
             * @param {CryptoJS.lib.WordArray|UTF-8 string} password
             *   If password is a UTF-8 string, then it's passed to a key derivation function.
             *   If password is a WordArray, then it's treated as the key itself.
             *   If you pass the key itself, then you must also provide an IV in the configuration
             *   options if this cipher needs one.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CryptoJS.lib.Ciphertext} A ciphertext object.
             *
             * @static
             */
            encrypt: function () {
                var instance = this.create();

                return encryptInstance.apply(instance, arguments);
            },

            /**
             * Decrypts the passed ciphertext using the password and configuration.
             *
             * @param {CryptoJS.lib.Ciphertext|formatted ciphertext string} ciphertext The ciphertext to decrypt.
             * @param {CryptoJS.lib.WordArray|UTF-8 string} password
             *   If password is a UTF-8 string, then it's passed to a key derivation function.
             *   If password is a WordArray, then it's treated as the key itself.
             *   If you pass the key itself, then you must also provide an IV in the configuration
             *   options if this cipher needs one.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CryptoJS.lib.WordArray} The decrypted plaintext.
             *
             * @static
             */
            decrypt: function () {
                var instance = this.create();

                return decryptInstance.apply(instance, arguments);
            },

            keySize: 4,

            ivSize: 4
        });

        function encryptInstance(message, password, cfg) {
            // Apply config defaults
            this._cfg = cfg = this._cfg.extend(cfg);

            // Derive key
            deriveKey.call(this, password);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                this._data = C_enc_Utf8.fromString(message);
            } else {
                this._data = message.clone();
            }

            // Perform cipher-specific logic
            this._doEncrypt();

            // Create ciphertext object
            var ciphertext = C_lib_Ciphertext.create(this._data, {
                key: this._key,
                iv: cfg.iv,
                salt: this._salt,
                formatter: cfg.format
            });

            return ciphertext;
        }

        function decryptInstance(ciphertext, password, cfg) {
            // Apply config defaults
            this._cfg = cfg = this._cfg.extend(cfg);

            // Convert string to Ciphertext object, else assume Ciphertext object already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.fromString(ciphertext);
            }

            // Extract parts
            this._data = ciphertext.rawCiphertext.clone();
            this._salt = ciphertext.salt;

            // Derive key
            deriveKey.call(this, password);

            // Perform cipher-specific logic
            this._doDecrypt();

            return this._data;
        }

        function deriveKey(password) {
            // Shortcut
            var cfg = this._cfg;

            // Convert password to key, else assume key already
            if (typeof password == 'string') {
                var o = cfg.kdf.execute(this, password, this._salt);

                this._key = o.key;
                this._salt = o.salt;
                cfg.iv = o.iv;
            } else {
                this._key = password;
            }
        }

        return Cipher;
    }());

    /**
     * Base stream cipher template.
     */
    var C_lib_Cipher_Stream = C_lib_Cipher.Stream = C_lib_Cipher.extend({
        _doDecrypt: function () {
            // Encryption and decryption are identical operations
            return this._doEncrypt.apply(this, arguments);
        }
    });

    /**
     * Padding namespace.
     */
    var C_pad = C.pad = {};

    /**
     * PKCS #5/7 padding strategy.
     */
    var C_pad_PKCS5 = C_pad.PKCS5 = C_lib_Base.extend({
        /**
         * Pads the passed data using the algorithm defined in PCKS #5/7.
         *
         * @param {CryptoJS.lib.WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         */
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = (blockSizeBytes - data.sigBytes % blockSizeBytes) || 1;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var padding = C_lib_WordArray.create();
            var paddingWords = padding.words;
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            padding.sigBytes = nPaddingBytes;

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads the passed data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {CryptoJS.lib.WordArray} data The data to unpad.
         *
         * @static
         */
        unpad: function (data) {
            // Shortcut
            var dataSigBytes = data.sigBytes;

            // Get number of padding bytes from the last byte
            var nPaddingBytes = (data.words[dataSigBytes >>> 2] >>> (24 - (dataSigBytes % 4) * 8)) & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    });

    var C_pad_NoPad = C_pad.NoPad = C_lib_Base.extend({
        pad: function () {},

        unpad: function () {}
    });

    /**
     * Mode namespace.
     */
    var C_cipher_mode = C_cipher.mode = {};

    /**
     * CBC block mode.
     */
    var C_cipher_mode_CBC = C_cipher_mode.CBC = C_lib_Base.extend({
        /**
         * TODO: Write stuff.
         */
        encrypt: function (cipher) {
            // Shortcuts
            var cipherBlockSize = cipher.blockSize;
            var ivWords = cipher._cfg.iv.words;
            var dataWords = cipher._data.words;
            var dataWordsLength = dataWords.length;

            // Encrypt each block
            for (var offset = 0; offset < dataWordsLength; offset += cipherBlockSize) {
                if (offset == 0) {
                    // XOR first block with IV
                    for (var i = 0; i < cipherBlockSize; i++) {
                        dataWords[i] ^= ivWords[i];
                    }
                } else {
                    // XOR this block with previous crypted block
                    for (var i = 0; i < cipherBlockSize; i++) {
                        dataWords[offset + i] ^ dataWords[offset + i - cipherBlockSize];
                    }
                }

                // Encrypt this block
                cipher._encryptBlock(offset);
            }
        },

        /**
         * TODO: Write stuff.
         */
        decrypt: function (cipher) {
            // Shortcuts
            var cipherBlockSize = cipher.blockSize;
            var ivWords = cipher._cfg.iv.words;
            var dataWords = cipher._data.words;

            // Decrypt each block
            for (var offset = dataWords.length - cipherBlockSize; offset >= 0; offset -= cipherBlockSize) {
                // Decrypt this block
                cipher._decryptBlock(offset);

                if (offset == 0) {
                    // XOR first block with IV
                    for (var i = 0; i < cipherBlockSize; i++) {
                        dataWords[i] ^= ivWords[i];
                    }
                } else {
                    // XOR this block with previous crypted block
                    dataWords[offset + i] ^ dataWords[offset + i - cipherBlockSize];
                }
            }
        }
    });

    var C_cipher_mode_ECB = C_cipher_mode.ECB = C_lib_Base.extend({
        encrypt: function (cipher) {
            // Shortcuts
            var cipherBlockSize = cipher.blockSize;
            var dataWords = cipher._data.words;
            var dataWordsLength = dataWords.length;

            // Encrypt each block
            for (var offset = 0; offset < dataWordsLength; offset += cipherBlockSize) {
                cipher._encryptBlock(offset);
            }
        },

        decrypt: function (cipher) {
            // Shortcuts
            var cipherBlockSize = cipher.blockSize;
            var dataWords = cipher._data.words;

            // Decrypt each block
            for (var offset = dataWords.length - cipherBlockSize; offset >= 0; offset -= cipherBlockSize) {
                cipher._decryptBlock(offset);
            }
        }
    });

    var C_lib_Cipher_Block = C_lib_Cipher.Block = C_lib_Cipher.extend({
        _cfg: C_lib_Cipher._cfg.extend({
            mode: C_cipher_mode_CBC,
            padding: C_pad_PKCS5
        }),

        _doEncrypt: function () {
            // Pad the data
            this._cfg.padding.pad(this._data, this.blockSize);

            // Perform cipher-specific logic using the configured mode
            this._cfg.mode.encrypt(this);
        },

        _doDecrypt: function () {
            // Perform cipher-specific logic using the configured mode
            this._cfg.mode.decrypt(this);

            // Unpad the data
            this._cfg.padding.unpad(this._data);
        }
    });
}());
