/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    'use strict';

    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_LIB = C.lib = {};

    /**
     * Base CryptoJS object.
     */
    var O = C_LIB.Object = (function () {
        /**
         * Constructor.
         */
        function O() {
        }

        /**
         * Creates a new object that inherits from another.
         *
         * @param {Object} superObj The object from which the newly-created object should inherit.
         *
         * @return {Object} The new object.
         *
         * @static
         *
         * @example
         *
         *     var newObject = CryptoJS.lib.Object.create(superObj);
         */
        O.create = (function () {
            function F() {}

            return function (superObj) {
                F.prototype = superObj;
                return new F();
            };
        }());

        /**
         * Copies properties from one object into another.
         *
         * @param {Object} receiver The object to receive properties.
         * @param {Object} supplier The object to supply properties.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.lib.Object.mixIn(receiver, supplier);
         */
        O.mixIn = (function () {
            // If a property on Object.prototype is non-enumerable,
            // then IE <= 8 won't enumerate different properties of the same name on child objects,
            // so we have to check for those explicitly.
            var NON_ENUMERABLES = [
                'toString'/*,
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'toLocaleString',
                'propertyIsEnumerable'*/
            ];

            // Shortcut
            var NON_ENUMERABLES_LENGTH = NON_ENUMERABLES.length;

            return function (receiver, supplier) {
                // Copy properties
                for (var propertyName in supplier) {
                    if (supplier.hasOwnProperty(propertyName)) {
                        receiver[propertyName] = supplier[propertyName];
                    }
                }

                // Copy non-enumerable properties
                for (var i = 0; i < NON_ENUMERABLES_LENGTH; i++) {
                    var propertyName = NON_ENUMERABLES[i];
                    if (supplier.hasOwnProperty(propertyName)) {
                        receiver[propertyName] = supplier[propertyName];
                    }
                }
            };
        }());

        /**
         * Creates a new object type that inherits from this object type.
         *
         * @param {Object} bodyInstance (Optional) The object type body instance definition.
         * @param {Object} bodyStatic (Optional) The object type body static definition.
         *
         * @return {Function} The new object type constructor function.
         *
         * @static
         *
         * @example
         *
         *     var MyType = CryptoJS.lib.Object.extend();
         *
         *     var MyType = CryptoJS.lib.Object.extend({
         *         field: 'value',
         *
         *         constructor: function () {
         *         },
         *
         *         method: function () {
         *         }
         *     });
         *
         *     var MyType = CryptoJS.lib.Object.extend(
         *         {
         *             field: 'value',
         *
         *             constructor: function () {
         *             },
         *
         *             method: function () {
         *             }
         *         },
         *         {
         *             staticField: 'value',
         *
         *             staticMethod: function () {
         *             }
         *         }
         *     );
         *
         *     var MySubType = MyType.extend();
         */
        O.extend = function (bodyInstance, bodyStatic) {
            // Get or create constructor
            if (bodyInstance && bodyInstance.hasOwnProperty('constructor')) {
                var Subtype = bodyInstance.constructor;
            } else {
                var Subtype = function Constructor() {
                    Constructor.$super.apply(this, arguments);
                };
            }

            // Inherit instance properties
            var subtypePrototype = Subtype.prototype = O.create(this.prototype);
            subtypePrototype.constructor = Subtype;

            // "Inherit" static properties
            O.mixIn(Subtype, this);

            // Own instance properties
            if (bodyInstance) {
                O.mixIn(subtypePrototype, bodyInstance);
            }

            // Own static properties
            if (bodyStatic) {
                O.mixIn(Subtype, bodyStatic);
            }

            // Reference supertype
            Subtype.$super = this;

            return Subtype;
        };

        /**
         * Creates a copy of this instance object.
         *
         * The new, cloned object should be independent of this object.
         * To achieve this, subtypes may need to modify fields of the cloned object.
         * Typically this means deep-copying any internal objects.
         * If this object contains only primitives, then no fields need to be modified.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = instance.clone();
         */
        O.prototype.clone = function () {
            var clone = O.create(this.constructor.prototype);
            O.mixIn(clone, this);

            return clone;
        };

        // Expose base object constructor
        return O;
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_LIB.WordArray = O.extend(
        {
            /**
             * Constructor.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = new CryptoJS.lib.WordArray();
             *     var wordArray = new CryptoJS.lib.WordArray([0x00010203, 0x04050607]);
             *     var wordArray = new CryptoJS.lib.WordArray([0x00010203, 0x04050607], 6);
             */
            constructor: function (words, sigBytes) {
                // Default values
                if (!words) {
                    words = [];
                }
                if (sigBytes === undefined) {
                    sigBytes = words.length * 4;
                }

                // Set properties
                this.words = words;
                this.sigBytes = sigBytes;
            },

            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function (encoder) {
                // Default value
                if (!encoder) {
                    encoder = Hex;
                }

                // Stringify
                return encoder.stringify(this);
            },

            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function (wordArray) {
                // Shortcuts
                var thisWords = this.words;
                var thatWords = wordArray.words;
                var thisSigBytes = this.sigBytes;
                var thatSigBytes = wordArray.sigBytes;

                // Clamp excess bits
                this.clamp();

                // Concat
                if (thisSigBytes % 4) {
                    // Copy one byte at a time
                    for (var i = 0; i < thatSigBytes; i++) {
                        // Extract byte
                        var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;

                        // Shortcuts
                        var thisNextByteIndex = thisSigBytes + i;
                        var thisNextWordIndex = thisNextByteIndex >>> 2;

                        // Initialize word to zero to avoid ORing with undefined
                        if (thisNextByteIndex % 4 === 0) {
                            thisWords[thisNextWordIndex] = 0;
                        }

                        // Copy byte
                        thisWords[thisNextWordIndex] |= thatByte << (24 - (thisNextByteIndex % 4) * 8);
                    }
                } else {
                    // Copy one word at a time
                    for (var i = 0; i < thatSigBytes; i += 4) {
                        thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                    }
                }
                this.sigBytes += thatSigBytes;

                // Chainable
                return this;
            },

            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function () {
                // Shortcuts
                var words = this.words;
                var sigBytes = this.sigBytes;

                // Clamp
                words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                words.length = Math.ceil(sigBytes / 4);
            },

            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function () {
                var clone = WordArray.$super.prototype.clone.call(this);
                clone.words = clone.words.slice(0);

                return clone;
            }
        },
        {
            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words[i >>> 2] = (Math.random() * 0x100000000) | 0;
                }

                return new WordArray(words, nBytes);
            }
        }
    );

    /**
     * Encoder namespace.
     */
    var C_ENC = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_ENC.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexStr = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexStr = '';
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexStr += (bite >>> 4).toString(16) + (bite & 0xf).toString(16);
            }

            return hexStr;
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @throws OctetError
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexStr);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // <?php if ($debug): ?>
            {
                if (hexStrLength % 2 !== 0) {
                    throw new OctetError('The hex string must represent a whole number of bytes.');
                }
            }
            // <?php endif ?>

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                // Shortcut
                var wordIndex = i >>> 3;

                // Initialize word to zero to avoid ORing with undefined
                if (i % 8 === 0) {
                    words[wordIndex] = 0;
                }

                // Parse
                words[wordIndex] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_ENC.Latin1 = {
        /**
         * Converts a word array of Latin1 bytes to a string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1Str = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Str = '';
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Str += String.fromCharCode(bite);
            }

            return latin1Str;
        },

        /**
         * Converts a string to a word array of Latin1 bytes.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1Str);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                // Shortcut
                var wordIndex = i >>> 2;

                // Initialize word to zero to avoid ORing with undefined
                if (i % 4 === 0) {
                    words[wordIndex] = 0;
                }

                // Parse
                words[wordIndex] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_ENC.Utf8 = {
        /**
         * Converts a word array of UTF-8 bytes to a string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @throws BitPatternError
         *
         * @example
         *
         *     var utf8Str = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            /*jshint nonstandard:true */

            // <?php if ($debug): ?>
            {
                try {
                    return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                } catch (e) {
                    if (e instanceof URIError) {
                        throw new BitPatternError('Malformed UTF-8 bytes.');
                    } else {
                        throw e;
                    }
                }
            }
            // <?php endif ?>

            return decodeURIComponent(escape(Latin1.stringify(wordArray)));
        },

        /**
         * Converts a string to a word array of UTF-8 bytes.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8Str);
         */
        parse: function (utf8Str) {
            /*jshint nonstandard:true */

            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     */
    var BufferedBlockAlgorithm = C_LIB.BufferedBlockAlgorithm = O.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._reset();
         */
        _reset: function () {
            // The data buffer
            this._data = new WordArray();

            // The cumulative data length in bits, represented as a 64-bit number
            this._nDataBitsMsw = 0;
            this._nDataBitsLsw = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} newData The data to append. Strings are converted to a WordArray as UTF-8 bytes.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('string');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (newData) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof newData === 'string') {
                newData = Utf8.parse(newData);
            }

            // Append
            this._data.concat(newData);

            // Add new data length to the cumulative 64-bit data length
            var oldNDataBitsLsw = this._nDataBitsLsw;
            var newNDataBitsLsw = this._nDataBitsLsw = (oldNDataBitsLsw + newData.sigBytes * 8) | 0;
            if ((newNDataBitsLsw >>> 0) < (oldNDataBitsLsw >>> 0)) {
                this._nDataBitsMsw = (this._nDataBitsMsw + 1) | 0;
            }
        },

        /**
         * Processes available data blocks.
         *
         * @param {boolean} flush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (flush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / (blockSize * 4);
            if (flush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords.slice(offset, offset + blockSize));
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray(processedWords, nBytesReady);
        },

        /**
         * Abstract number of words that this block algorithm operates on at a time.
         *
         * @type {number}
         */
        /*
        blockSize,
        */

        /**
         * Abstract method to process a data block.
         *
         * @param {Array} dataWords An array of 32-bit numbers.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._doProcessBlock(words);
         */
        /*
        _doProcessBlock: function (dataWords),
        */

        /**
         * The number of blocks that should be kept unprocessed in the buffer. Default: 0
         *
         * @type {number}
         */
        _minBufferSize: 0,

        /**
         * Creates a copy of this buffered block algorithm object.
         *
         * @return {BufferedBlockAlgorithm} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = BufferedBlockAlgorithm.$super.prototype.clone.call(this);
            clone._data = clone._data.clone();

            return clone;
        }
    });

    /**
     * Abstract base hasher template.
     */
    C_LIB.Hasher = BufferedBlockAlgorithm.extend(
        {
            /**
             * Configuration options.
             */
            cfg: O.extend(),

            /**
             * Constructor.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             */
            constructor: function (cfg) {
                // Apply config defaults
                this.cfg = new (this.cfg.extend(cfg))();

                // Perform concrete-hasher logic
                this._doInit();

                // Set initial values
                this.reset();
            },

            /**
             * Abstract method to initialize this hasher.
             */
            /*
            _doInit: function (),
            */

            /**
             * Resets this hasher to its initial state.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function () {
                // Reset data buffer
                this._reset();

                // Perform concrete-hasher logic
                this._doReset();

                // Chainable
                return this;
            },

            /**
             * Abstract method to reset this hasher to its initial state.
             */
            /*
            _doReset: function (),
            */

            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate A message part to hash.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function (messageUpdate) {
                // Add message to data buffer
                this._append(messageUpdate);

                // Update the hash
                this._process();

                // Chainable
                return this;
            },

            /**
             * Finalizes the hash computation and resets this hasher to its initial state.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function (messageUpdate) {
                // Final message update
                if (messageUpdate) {
                    this._append(messageUpdate);
                }

                // Perform concrete-hasher logic
                var hash = this._doFinalize();

                // Reset this hasher to its initial state
                this.reset();

                return hash;
            },

            /**
             * Abstract method to finalize the hash computation.
             *
             * @return {WordArray} The final hash.
             */
            /*
            _doFinalize: function (),
            */

            /**
             * The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
             *
             * @type {number}
             */
            blockSize: 512 / 32
        },
        {
            /**
             * Shortcut to a hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA256.hash('message');
             */
            hash: function (message, cfg) {
                var ConcreteHasher = this;
                return (new ConcreteHasher(cfg)).finalize(message);
            }
        }
    );

    // <?php if ($debug): ?>
    {
        /**
         * Error namespace.
         */
        var C_ERR = C.err = {};

        /**
         * Octet error.
         */
        var OctetError = C_ERR.OctetError = O.extend.call(Error);

        /**
         * Bit pattern error.
         */
        var BitPatternError = C_ERR.BitPatternError = O.extend.call(Error);
    }
    // <?php endif ?>

    // Expose CryptoJS namespace object
    return C;
}(Math));
