/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function (undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} _keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} _ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption transformation mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption transformation mode.
     */
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        _cfg: Base.extend(),

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
            // Apply config defaults
            this._cfg = this._cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
        },

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
            // Reset data buffer
            this._resetData();

            // Perform concrete-cipher logic
            this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
            // Append
            this._addData(dataUpdate);

            // Process available blocks
            return this._processData(1);
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
                this._addData(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
        },

        _keySize: 128/32,

        _ivSize: 128/32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: (function () {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }

            return function (cipher) {
                return {
                    encrypt: function (message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },

                    decrypt: function (ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            };
        }())
    });

    /**
     * Base stream cipher template.
     *
     * @property {number} _blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = Cipher.Stream = Cipher.extend({
        _doFinalize: function () {
            // Shortcut
            var data = this._data;

            // Remember sigBytes
            var sigBytes = data.sigBytes;

            // Pad data to ensure at least one complete block
            data.sigBytes += this._blockSize * 4;

            // Process final blocks
            var finalProcessedBlocks = this._processData();

            // Remove padding
            finalProcessedBlocks.sigBytes = sigBytes;

            return finalProcessedBlocks;
        },

        _blockSize: 1
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
         * Pads data using the algorithm defined in PKCS #5/7.
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
        },

        /**
         * Returns the serializable name of this padding scheme.
         *
         * @return {string} The serializable name.
         *
         * @static
         *
         * @example
         *
         *     var serializedPaddingScheme = CryptoJS.pad.PKCS7 + '';
         *     var serializedPaddingScheme = CryptoJS.pad.PKCS7.toString();
         */
        toString: function () {
            return 'PKCS7';
        }
    };

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * Abstract base mode template.
     */
    var CipherMode = Cipher.Mode = Base.extend({
        /**
         * Initializes a newly create mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {WordArray} iv (Optional) The IV.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv);
         */
        init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        },

        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {WordArray} iv (Optional) The IV.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv);
         */
        createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {WordArray} iv (Optional) The IV.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv);
         */
        createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        }
    });

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = C_mode.CBC = (function () {
        var CBC = CipherMode.extend({
            /**
             * Returns the serializable name of this block mode.
             *
             * @return {string} The serializable name.
             *
             * @static
             *
             * @example
             *
             *     var serializedBlockMode = CryptoJS.mode.CBC + '';
             *     var serializedBlockMode = CryptoJS.mode.CBC.toString();
             */
            toString: function () {
                return 'CBC';
            }
        });

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} dataWords The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (dataWords, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher._blockSize;

                // XOR and encrypt
                xorBlock.call(this, dataWords, offset, blockSize);
                cipher._encryptBlock(offset);

                // Remember this block to use with next block
                this._previousBlock = dataWords.slice(offset, blockSize);
            }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} dataWords The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (dataWords, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher._blockSize;

                // Remember this block to use with next block
                var thisBlock = dataWords.slice(offset, blockSize);

                // Decrypt and XOR
                cipher._decryptBlock(offset);
                xorBlock.call(this, dataWords, offset, blockSize);

                // This block becomes the previous block
                this._previousBlock = thisBlock;
            }
        });

        function xorBlock(dataWords, offset, blockSize) {
            // Shortcut
            var iv = this._iv;

            if (iv) {
                // Shortcut
                var IV = iv.words;

                // XOR first block with IV
                for (var i = 0; i < blockSize; i++) {
                    dataWords[i] ^= IV[i];
                }

                // Remove IV for subsequent blocks
                this._iv = undefined;
            } else {
                // Shortcut
                var previousBlock = this._previousBlock;

                // XOR this block with previous block
                for (var i = 0; i < blockSize; i++) {
                    dataWords[offset + i] ^= previousBlock[i];
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
    var BlockCipher = Cipher.Block = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Padding} padding The padding scheme to use. Default: PKCS7
         * @property {Mode} mode The block mode to use. Default: CBC
         */
        _cfg: Cipher._cfg.extend({
            padding: PKCS7,
            mode: CBC
        }),

        reset: function () {
            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this._cfg;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                var modeCreator = mode.createDecryptor;
            }
            this._mode = modeCreator.call(mode, this, cfg.iv);
        },

        _doProcessBlock: function (offset) {
            this._mode.processBlock(this._data.words, offset);
        },

        _doFinalize: function () {
            if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                this._cfg.padding.pad(this._data, this._blockSize);

                // Process final blocks
                var finalProcessedBlocks = this._processData();
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                // Process final blocks
                var finalProcessedBlocks = this._processData();

                // Unpad data
                this._cfg.padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
        },

        _blockSize: 128/32
    });

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher|string} algorithm The cipher algorithm, represented either as a string or the algorithm object itself.
     * @property {Mode|string} mode The block mode used in the ciphering operation, represented either as a string or the mode object itself.
     * @property {Padding|string} padding The padding scheme used in the ciphering operation, represented either as a string or the padding object itself.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = Cipher.Params = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
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
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = {
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
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var openSSLStr = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var openSSLStr = ciphertext;
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
            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(ciphertextWords.slice(2, 4));

                // Remove salt from ciphertext
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
    };

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = Cipher.Serializable = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        _cfg: Base.extend({
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.Cipher.Serializable.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.Cipher.Serializable.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.Cipher.Serializable.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Encrypt
            var ciphertext = cipher.createEncryptor(key, cfg).finalize(message);

            // Create and return serializable cipher params
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cfg.iv,
                algorithm: cipher,
                mode: cfg.mode,
                padding: cfg.padding,
                blockSize: cipher._blockSize,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.Cipher.Serializable.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.Cipher.Serializable.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.Cipher.Serializable._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext);
            } else {
                return ciphertext;
            }
        }
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
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', CryptoJS.algo.AES);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', CryptoJS.algo.AES, 'saltsalt');
         */
        execute: function (password, cipher, salt) {
            // Shortcuts
            var keySize = cipher._keySize;
            var ivSize = cipher._ivSize;

            // Generate random salt
            if ( ! salt) {
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * A cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = Cipher.PBE = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        _cfg: SerializableCipher._cfg.extend({
            kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.Cipher.PBE.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.Cipher.PBE.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.Cipher.PBE.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.Cipher.PBE.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this._cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher, ciphertext.salt);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
        }
    });
}());
