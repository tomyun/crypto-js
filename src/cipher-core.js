/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} rawCiphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams Cipher parameters such as key, IV, salt, and rawCiphertext.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         rawCiphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         format: CryptoJS.format.RawCiphertext
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         * Any arguments beyond the optional formatter will be passed to the formatter.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.enc.Latin1);
         *     var string = cipherParams.toString(CryptoJS.format.RawCiphertext, CryptoJS.enc.Latin1);
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (arg0) {
            // Make array
            var args = Array.prototype.slice.call(arguments, 0);

            // Get formatter from arguments or from this cipher params object
            if (arg0 && arg0.isA && arg0.isA(Formatter)) {
                var formatter = args.shift();
            } else {
                var formatter = this.formatter;
            }

            // This cipher params object will always be the first argument
            args.unshift(this);

            return formatter.stringify.apply(formatter, args);
        }
    });

    /**
     * Abstract base formatter.
     */
    var Formatter = C_lib.Formatter = Base.extend();

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * Raw ciphertext formatting strategy.
     */
    var RawCiphertext = C_format.RawCiphertext = Formatter.extend({
        /**
         * Converts the raw ciphertext of a cipher params object to a string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         * @param {Encoder} encoder (Optional) The encoding strategy to use.
         *
         * @return {string} The stringified cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var rawCiphertextString = CryptoJS.format.RawCiphertext.stringify(cipherParams);
         */
        stringify: function (cipherParams, encoder) {
            return cipherParams.rawCiphertext.toString(encoder);
        },

        /**
         * Converts a raw ciphertext string to a cipher params object.
         *
         * @param {string} rawCiphertext The raw ciphertext string.
         * @param {Encoder} encoder (Optional) The encoding strategy to use.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.RawCiphertext.parse(rawCiphertextString);
         */
        parse: function (rawCiphertext, encoder) {
            return CipherParams.create({ rawCiphertext: (encoder || WordArray.encoder).parse(rawCiphertext) });
        }
    });

    /**
     * Abstract base cipher template.
     *
     * @property {number} _keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} _ivSize This cipher's IV size. Default: 4 (128 bits)
     */
    var Cipher = C_lib.Cipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         * @property {Formatter} format
         *   The default formatting strategy to convert cipher params to and from a string. Default: RawCiphertext
         */
        _cfg: Base.extend({
            format: RawCiphertext
        }),

        /**
         * Encrypts a message.
         *
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} The ciphertext.
         *
         * @static
         */
        encrypt: function (message, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                message = Utf8.fromString(message);
            } else {
                message = message.clone();
            }

            // Perform cipher-specific logic
            this._doEncrypt(message, key, cfg);

            // Return the now-encrypted message
            return CipherParams.create({
                rawCiphertext: message,
                key: key,
                iv: cfg.iv,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts ciphertext.
         *
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         */
        decrypt: function (ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams, else assume CipherParams already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.parse(ciphertext);
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
         * @param {Cipher} cipher The cipher algorithm to create a helper for.
         *
         * @return {Object} An object with static encrypt and decrypt methods.
         *
         * @static
         */
        _createHelper: function (cipher) {
            return {
                encrypt: function (message, password, cfg) {
                    if (typeof password == 'string') {
                        return PBE.encrypt(cipher, message, password, cfg);
                    } else {
                        return cipher.encrypt(message, password, cfg);
                    }
                },

                decrypt: function (ciphertext, password, cfg) {
                    if (typeof password == 'string') {
                        return PBE.decrypt(cipher, ciphertext, password, cfg);
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
    var StreamCipher = Cipher.Stream = Cipher.extend({
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
    var PKCS7 = C_pad.PKCS7 = {
        /**
         * Pads data using the algorithm defined in PCKS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.PKCS7.pad(wordArray, 4);
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
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.PKCS7.unpad(wordArray);
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
    var CBC = C_mode.CBC = (function () {
        var CBC = {
            /**
             * Encrypts the message using the cipher and IV.
             *
             * @param {WordArray} message The message to encrypt.
             * @param {BlockCipher} cipher The block cipher to use.
             * @param {WordArray} iv The IV.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.mode.CBC.encrypt(message, CryptoJS.algo.AES, iv);
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
             * @param {WordArray} ciphertext The ciphertext to decrypt.
             * @param {BlockCipher} cipher The block cipher to use.
             * @param {WordArray} iv The IV.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.mode.CBC.decrypt(ciphertext, CryptoJS.algo.AES, iv);
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
    BlockCipher = Cipher.Block = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Padding} padding The padding strategy to use. Default: PKCS7
         * @property {Mode} mode The block mode to use. Default: CBC
         */
        _cfg: Cipher._cfg.extend({
            padding: PKCS7,
            mode: CBC
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
    var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {Cipher} cipher The cipher to generate a key for.
         * @param {CipherParams} cipherParams
         *   (Optional) A cipher params object with a salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
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
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: cipherKeySize + cipherIvSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(cipherKeySize));
            key.sigBytes = cipherKeySize * 4;

            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = Formatter.extend({
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
            // Shortcuts
            var rawCiphertext = cipherParams.rawCiphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var openSSLStr = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(rawCiphertext);
            } else {
                var openSSLStr = rawCiphertext;
            }

            return openSSLStr.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
            var rawData = Base64.parse(openSSLStr);

            // Shortcut
            var rawDataWords = rawData.words;

            // Test for salt
            if (rawDataWords[0] == 0x53616c74 && rawDataWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(rawDataWords.slice(2, 4));

                // Remove salt from raw data
                rawDataWords.splice(0, 4);
                rawData.sigBytes -= 16;
            }

            return CipherParams.create({ rawCiphertext: rawData, salt: salt });
        }
    });

    /**
     * Password-based encryption.
     */
    var PBE = C_algo.PBE = {
        /**
         * Configuration options.
         *
         * @property {KDF} kdf
         *   The key derivation function to use to generate a key, IV, and salt from a password. Default: OpenSSL
         * @property {Formatter} format
         *   The default formatting strategy to convert cipher params objects to and from a string. Default: OpenSSL
         */
        _cfg: Base.extend({
            kdf: OpenSSLKdf,
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password to derive from.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
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
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password to derive from.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The decrypted plaintext.
         *
         * @static
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams, else assume CipherParams already
            if (typeof ciphertext == 'string') {
                ciphertext = cfg.format.parse(ciphertext);
            }

            // Derive key
            var cipherParams = cfg.kdf.execute(password, cipher, ciphertext);

            // Decrypt
            var plaintext = cipher.decrypt(ciphertext.rawCiphertext, cipherParams.key, { iv: cipherParams.iv });

            return plaintext;
        }
    };
}());
