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
     * Base object for prototypal inheritance.
     */
    var Base = C_LIB.Base = (function () {
        // Reusable constructor function
        function F() {}

        // If a property on Object.prototype is non-enumerable,
        // then older versions of IE won't enumerate different properties of the same name on child objects,
        // so we have to check for those explicitly.
        var NON_ENUMERABLES = [
            'toString'/*,
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'toLocaleString',
            'propertyIsEnumerable'
            */
        ];

        // Shortcut
        var NON_ENUMERABLES_LENGTH = NON_ENUMERABLES.length;

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} typeDefinition Properties to copy into the new object.
             *
             * @return {Base} The new object.
             *
             * @static
             *
             * @throws ReservedPropertyError
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (typeDefinition) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (typeDefinition) {
                    // <?php if ($debug): ?>
                    if (typeDefinition.hasOwnProperty('$super')) {
                        throw ReservedPropertyError.create('$super');
                    }
                    // <?php endif ?>

                    subtype.mixIn(typeDefinition);
                }

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and initializes the new object.
             *
             * Arguments to "create" will be passed to "init".
             *
             * @return {Base} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create(initArg);
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             *
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function (initParam) {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @return {Base} This object.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            mixIn: function (properties) {
                // Copy properties
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // Copy non-enumerable properties
                for (var i = 0; i < NON_ENUMERABLES_LENGTH; i++) {
                    var propertyName = NON_ENUMERABLES[i];

                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // Chainable
                return this;
            },

            /**
             * Tests if this object is a descendant of the passed type.
             *
             * @param {Base} type The potential ancestor.
             *
             * @return {boolean} True if this object is a descendant.
             *
             * @example
             *
             *     if (instance.isA(MyType)) {
             *     }
             */
            /*
            isA: function (type) {
                var o = this;

                do {
                    if (o == type) {
                        return true;
                    } else {
                        o = o.$super;
                    }
                } while (o);

                return false;
            },
            */

            /**
             * Creates a copy of this object.
             *
             * The new, cloned object should be independent of this object.
             * To achieve this, subtypes may need to modify fields of the clonsed object.
             * Typically this means deep-copying any internal objects.
             * If this object contains only primitives, then no fields need to be modified.
             *
             * @return {Base} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.$super.extend().mixIn(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_LIB.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes !== undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
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
            return (encoder || Hex).stringify(this);
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
                    var thisSigByteOffset = thisSigBytes + i;
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[thisSigByteOffset >>> 2] |= thatByte << (24 - (thisSigByteOffset % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @return {WordArray} This word array.
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

            // Chainable
            return this;
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
            var clone = Base.clone.call(this);
            clone.words = clone.words.slice(0);

            return clone;
        },

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
                words.push((Math.random() * 0x100000000) | 0);
            }

            return WordArray.create(words, nBytes);
        }
    });

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
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
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
         * @throws HexOctetError
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexStr);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // <?php if ($debug): ?>
            if (hexStrLength % 2 !== 0) {
                throw HexOctetError;
            }
            // <?php endif ?>

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return WordArray.create(words, hexStrLength / 2);
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
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
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
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return WordArray.create(words, latin1StrLength);
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
         * @throws MalformedUtf8Error
         *
         * @example
         *
         *     var utf8Str = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            /*jshint nonstandard:true */

            // <?php if ($debug): ?>
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                if (e instanceof URIError) {
                    throw MalformedUtf8Error;
                } else {
                    throw e;
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
    var BufferedBlockAlgorithm = C_LIB.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._reset();
         */
        _reset: function () {
            // The data buffer
            this._data = WordArray.create();

            // The cumulative data length in bits, represented as a 64-bit number
            this._nDataBitsL = 0;
            this._nDataBitsH = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} newData The data to append. Strings are converted to a WordArray as UTF-8 bytes.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (newData) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof newData == 'string') {
                newData = Utf8.parse(newData);
            }

            // Append
            this._data.concat(newData);

            // Add new data length to the cumulative 64-bit data length
            var oldNDataBitsL = this._nDataBitsL;
            var newNDataBitsL = this._nDataBitsL = (oldNDataBitsL + newData.sigBytes * 8) | 0;
            if ((newNDataBitsL >>> 0) < (oldNDataBitsL >>> 0)) {
                this._nDataBitsH++;
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
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
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
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return WordArray.create(processedWords, nBytesReady);
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
         * Abstract method to process a data block at a given offset.
         *
         * @param {Array} dataWords An array of 32-bit numbers.
         * @param {number} offset The offset to the start of the block to be processed.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._doProcessBlock(words, 16);
         */
        /*
        _doProcessBlock: function (dataWords, offset),
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
            var clone = Base.clone.call(this);
            clone._data = clone._data.clone();

            return clone;
        }
    });

    /**
     * Abstract base hasher template.
     */
    C_LIB.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        // cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (/* cfg */) {
            // Apply config defaults
            // this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

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
         * @param {WordArray|string} messageUpdate The message part to hash.
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
         * Finalizes the hash computation.
         *
         * Note that the finalize operation is effectively a destructive, read-once operation.
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
            this._doFinalize();

            return this._hash;
        },

        /**
         * Abstract method to finalize the hash computation.
         */
        /*
        _doFinalize: function (),
        */

        /**
         * The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
         *
         * @type {number}
         */
        blockSize: 512 / 32,

        /**
         * Creates a copy of this hasher object.
         *
         * @return {Hasher} The clone.
         *
         * @example
         *
         *     var clone = hasher.clone();
         */
        clone: function () {
            var clone = BufferedBlockAlgorithm.clone.call(this);
            clone._hash = clone._hash.clone();

            return clone;
        },

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return hasher.create(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return C_ALGO.HMAC.create(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_ALGO = C.algo = {};

    // <?php if ($debug): ?>
    /**
     * Error namespace.
     */
    var C_ERR = C.err = {};

    /**
     * Base error type.
     */
    var Error = C_ERR.Error = Base.extend({
        init: function (message) {
            if (message) {
                this._message = message;
            }
        },

        toString: function () {
            return this._message;
        }
    });

    var ReservedPropertyError = C_ERR.ReservedPropertyError = Error.extend({
        init: function (propertyName) {
            this._message = 'The property name "' + propertyName + '" is reserved.';
        }
    });

    var HexOctetError = C_ERR.HexOctetError = Error.extend({
        _message: 'Hex string must represent octets.'
    });

    var MalformedUtf8Error = C_ERR.MalformedUtf8Error = Error.extend({
        _message: 'Malformed UTF-8 bytes.'
    });
    // <?php endif ?>

    // Expose CryptoJS namespace object.
    return C;
}(Math));
