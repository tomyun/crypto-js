/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_lib_WordArray = C_lib.WordArray;
    var C_enc = C.enc;
    var C_enc_Utf8 = C_enc.Utf8;
    var C_enc_Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var C_algo_EvpKDF = C_algo.EvpKDF;

    /**
     * A collection of cipher parameters.
     *
     * @property {CryptoJS.lib.WordArray} rawCiphertext The raw ciphertext.
     * @property {CryptoJS.lib.WordArray} key The key to this ciphertext.
     * @property {CryptoJS.lib.WordArray} iv The IV used in the ciphering operation.
     * @property {CryptoJS.lib.WordArray} salt The salt used with a key derivation function.
     * @property {CryptoJS.lib.Format} formatter
     *   The default formatting strategy to convert this cipher params object to a string.
     */
    var C_lib_CipherParams = C_lib.CipherParams = C_lib_Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams Cipher parameters such as key, IV, salt, and rawCiphertext.
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * Any arguments beyond the optional formatter will be passed to the formatter.
         *
         * @param {CryptoJS.lib.Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         */
        toString: function (arg0) {
            // Make array
            var args = Array.prototype.slice.call(arguments, 0);

            // Get formatter from arguments or from this cipher params object
            if (arg0 && arg0.isA && arg0.isA(C_lib_Formatter)) {
                var formatter = args.shift();
            } else {
                var formatter = this.formatter;
            }

            // This cipher params object will always be the first argument
            args.unshift(this);

            return formatter.toString.apply(formatter, args);
        }
    });

    /**
     * Base formatter.
     */
    var C_lib_Formatter = C_lib.Formatter = C_lib_Base.extend();

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * Raw ciphertext formatting strategy.
     */
    var C_format_RawCiphertext = C_format.RawCiphertext = C_lib_Formatter.extend({
        /**
         * Converts the raw ciphertext of a cipher params object to a string.
         *
         * @param {CryptoJS.lib.CipherParams} cipherParams The cipher params object.
         * @param {CryptoJS.lib.Encoder} encoder (Optional) The encoding strategy to use.
         *
         * @return {string} The stringified cipher params object.
         *
         * @static
         */
        toString: function (cipherParams, encoder) {
            return cipherParams.rawCiphertext.toString(encoder);
        },

        /**
         * Converts a raw ciphertext string to a cipher params object.
         *
         * @param {string} rawCiphertext The raw ciphertext string.
         * @param {CryptoJS.enc.*} encoder (Optional) The encoding strategy to use.
         *
         * @return {CryptoJS.lib.CipherParams} The cipher params object.
         *
         * @static
         */
        fromString: function (rawCiphertext, encoder) {
            rawCiphertext = (encoder || C_lib_WordArray.encoder).fromString(rawCiphertext);

            return C_lib_CipherParams.create({
                rawCiphertext: rawCiphertext
            });
        }
    });

    /**
     * Base cipher template.
     *
     * @property {number} _keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} _ivSize This cipher's IV size. Default: 4 (128 bits)
     */
    var C_lib_Cipher = C_lib.Cipher = C_lib_Base.extend({
        /**
         * Configuration options.
         *
         * @property {CryptoJS.lib.WordArray} iv The IV to use for this operation.
         * @property {CryptoJS.lib.Formatter} format
         *   The default formatting strategy to convert cipher params to and from a string.
         *   Default: CryptoJS.format.RawCiphertext
         */
        _cfg: C_lib_Base.extend({
            format: C_format_RawCiphertext
        }),

        /**
         * Encrypts a message.
         *
         * @param {CryptoJS.lib.WordArray|string} message The message to encrypt.
         * @param {CryptoJS.lib.WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CryptoJS.lib.CipherParams} The ciphertext.
         *
         * @static
         */
        encrypt: function (message, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                message = C_enc_Utf8.fromString(message);
            } else {
                message = message.clone();
            }

            // Perform cipher-specific logic
            this._doEncrypt(message, key, cfg);

            // Return the now-encrypted message
            return C_lib_CipherParams.create({
                rawCiphertext: message,
                key: key,
                iv: cfg.iv,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts ciphertext.
         *
         * @param {CryptoJS.lib.CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {CryptoJS.lib.WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CryptoJS.lib.WordArray} The plaintext.
         *
         * @static
         */
        decrypt: function (ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams, else assume CipherParams already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.fromString(ciphertext);
            } else {
                ciphertext = ciphertext.clone();
            }

            // Shortcut
            var rawCiphertext = ciphertext.rawCiphertext;

            // Perform cipher-specific logic
            this._doDecrypt(rawCiphertext, key, cfg);

            // Return the now-decrypted ciphertext
            return rawCiphertext;
        },

        _keySize: 128/32,

        _ivSize: 128/32,

        /**
         * Creates a helper object with static encrypt and decrypt functions that intelligently branch between
         * password-based encryption and low-level algorithm usage.
         *
         * @param {CryptoJS.lib.Cipher} cipher The cipher algorithm to create a helper for.
         *
         * @return {Object} An object with static encrypt and decrypt methods.
         *
         * @static
         */
        _createHelper: function (cipher) {
            return {
                encrypt: function (message, password, cfg) {
                    if (typeof password == 'string') {
                        return C_algo_PBE.encrypt(cipher, message, password, cfg);
                    } else {
                        return cipher.encrypt(message, password, cfg);
                    }
                },

                decrypt: function (ciphertext, password, cfg) {
                    if (typeof password == 'string') {
                        return C_algo_PBE.decrypt(cipher, ciphertext, password, cfg);
                    } else {
                        return cipher.decrypt(ciphertext, password, cfg);
                    }
                }
            };
        }
    });

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
    var C_pad_PKCS7 = C_pad.PKCS7 = {
        /**
         * Pads data using the algorithm defined in PCKS #5/7.
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
            var nPaddingBytes = (blockSizeBytes - data.sigBytes % blockSizeBytes) || blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = C_lib_WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {CryptoJS.lib.WordArray} data The data to unpad.
         *
         * @static
         */
        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * CBC block cipher mode.
     */
    var C_mode_CBC = C_mode.CBC = (function () {
        var CBC = {
            /**
             * Encrypts the message using the cipher and IV.
             *
             * @param {CryptoJS.lib.WordArray} message The message to encrypt.
             * @param {CryptoJS.lib.Cipher.Block} cipher The block cipher to use.
             * @param {CryptoJS.lib.WordArray} iv The IV.
             *
             * @static
             */
            encrypt: function (message, cipher, iv) {
                // Shortcuts
                var messageWords = message.words;
                var messageWordsLength = message.sigBytes / 4;
                var cipherBlockSize = cipher._blockSize;
                var ivWords = iv.words;

                // Encrypt each block
                for (var offset = 0; offset < messageWordsLength; offset += cipherBlockSize) {
                    xorBlock(messageWords, ivWords, offset, cipherBlockSize);
                    cipher._encryptBlock(messageWords, offset);
                }
            },

            /**
             * Decrypts the ciphertext using the cipher and IV.
             *
             * @param {CryptoJS.lib.WordArray} ciphertext The ciphertext to decrypt.
             * @param {CryptoJS.lib.Cipher.Block} cipher The block cipher to use.
             * @param {CryptoJS.lib.WordArray} iv The IV.
             *
             * @static
             */
            decrypt: function (ciphertext, cipher, iv) {
                // Shortcuts
                var ciphertextWords = ciphertext.words;
                var ciphertextWordsLength = ciphertext.sigBytes / 4;
                var cipherBlockSize = cipher._blockSize;
                var ivWords = iv.words;

                // Decrypt each block
                for (var offset = ciphertextWordsLength - cipherBlockSize; offset >= 0; offset -= cipherBlockSize) {
                    cipher._decryptBlock(ciphertextWords, offset);
                    xorBlock(ciphertextWords, ivWords, offset, cipherBlockSize);
                }
            }
        };

        function xorBlock(dataWords, ivWords, offset, blockSize) {
            if (offset == 0) {
                // XOR first block with IV
                for (var i = 0; i < blockSize; i++) {
                    dataWords[i] ^= ivWords[i];
                }
            } else {
                // XOR this block with previous crypted block
                for (var i = 0; i < blockSize; i++) {
                    dataWords[offset + i] ^= dataWords[offset + i - blockSize];
                }
            }
        }

        return CBC;
    }());

    /**
     * Base block cipher template.
     *
     * @property {number} _blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    C_lib_Cipher_Block = C_lib_Cipher.Block = C_lib_Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {CryptoJS.pad.*} padding The padding strategy to use. Default: CryptoJS.pad.PKCS7
         * @property {CryptoJS.mode.*} mode The block mode to use. Default: CryptoJS.mode.CBC
         */
        _cfg: C_lib_Cipher._cfg.extend({
            padding: C_pad_PKCS7,
            mode: C_mode_CBC
        }),

        _doEncrypt: function (message, key, cfg) {
            // Pad
            cfg.padding.pad(message, this._blockSize);

            // Encrypt
            this._init(key);
            cfg.mode.encrypt(message, this, cfg.iv);
        },

        _doDecrypt: function (ciphertext, key, cfg) {
            // Decrypt
            this._init(key);
            cfg.mode.decrypt(ciphertext, this, cfg.iv);

            // Unpad
            cfg.padding.unpad(ciphertext);
        },

        _blockSize: 128/32
    });

    /**
     * Key derivation function namespace.
     */
    var C_kdf = C.kdf = {};

    /**
     * OpenSSL key derivation function.
     */
    var C_kdf_OpenSSL = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {CryptoJS.lib.Cipher} cipher The cipher to generate a key for.
         * @param {CryptoJS.lib.CipherParams} cipherParams
         *   (Optional) A cipher params object with a salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CryptoJS.lib.CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         */
        execute: function (password, cipher, cipherParams) {
            // Shortcuts
            var cipherKeySize = cipher._keySize;
            var cipherIvSize = cipher._ivSize;
            var salt = cipherParams && cipherParams.salt;

            // Generate random salt
            if ( ! salt) {
                salt = C_lib_WordArray.random(64/8);
            }

            // Derive key and IV
            var key = C_algo_EvpKDF.compute(password, salt, { keySize: cipherKeySize + cipherIvSize });

            // Separate key and IV
            var iv = key.$super.create(key.words.slice(cipherKeySize));
            key.sigBytes = cipherKeySize * 4;

            return C_lib_CipherParams.create({
                key: key,
                iv: iv,
                salt: salt
            });
        }
    };

    /**
     * OpenSSL formatting strategy.
     */
    var C_format_OpenSSL = C_format.OpenSSL = C_lib_Formatter.extend({
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CryptoJS.lib.CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         */
        toString: function (cipherParams) {
            // Shortcuts
            var rawCiphertext = cipherParams.rawCiphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var openSslStr = C_lib_WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(rawCiphertext);
            } else {
                var openSslStr = rawCiphertext;
            }

            return openSslStr.toString(C_enc_Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CryptoJS.lib.CipherParams} The cipher params object.
         *
         * @static
         */
        fromString: function (openSslStr) {
            var rawCiphertext = C_enc_Base64.fromString(openSslStr);

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

            return C_lib_CipherParams.create({
                rawCiphertext: rawCiphertext,
                salt: salt
            });
        }
    });

    /**
     * Password-based encryption.
     */
    var C_algo_PBE = C_algo.PBE = {
        /**
         * Configuration options.
         *
         * @property {CryptoJS.kdf.*} kdf
         *   The key derivation function to use to generate a key, IV, and salt from a password.
         *   Default: CryptoJS.kdf.OpenSSL
         * @property {CryptoJS.lib.Formatter} format
         *   The default formatting strategy to convert cipher params objects to and from a string.
         *   Default: CryptoJS.format.OpenSSL
         */
        _cfg: C_lib_Base.extend({
            kdf: C_kdf_OpenSSL,
            format: C_format_OpenSSL
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {CryptoJS.lib.Cipher} cipher The cipher algorithm to use.
         * @param {CryptoJS.lib.WordArray|string} message The message to encrypt.
         * @param {string} password The password to derive from.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CryptoJS.lib.CipherParams} A cipher params object.
         *
         * @static
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Derive key
            var cipherParams = cfg.kdf.execute(password, cipher);

            // Encrypt
            cipherParams.rawCiphertext = cipher.encrypt(
                message, cipherParams.key, { iv: cipherParams.iv }
            ).rawCiphertext;

            // Set default formatter
            cipherParams.formatter = cfg.format;

            return cipherParams;
        },

        /**
         * Decrypts ciphertext using a password.
         *
         * @param {CryptoJS.lib.Cipher} cipher The cipher algorithm to use.
         * @param {CryptoJS.lib.CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password to derive from.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CryptoJS.lib.WordArray} The decrypted plaintext.
         *
         * @static
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams, else assume CipherParams already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.fromString(ciphertext);
            }

            // Derive key
            var cipherParams = cfg.kdf.execute(password, cipher, ciphertext);

            // Decrypt
            var plaintext = cipher.decrypt(ciphertext.rawCiphertext, cipherParams.key, { iv: cipherParams.iv });

            return plaintext;
        }
    };
}());
