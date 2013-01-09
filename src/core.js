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
    {
        /**
         * Constructor.
         */
        var O = C_LIB.Object = function () {
        };

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
         * @param {Function} filter (Optional)
         *     A callback that takes a property name and value as arguments,
         *     and returns true or false to indicate whether this property should be mixed.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.lib.Object.mixIn(receiver, supplier);
         *
         *     CryptoJS.lib.Object.mixIn(receiver, supplier, function (propertyName, propertyValue) {
         *         if (propertyName === '$special') {
         *             return false;
         *         } else {
         *             return true;
         *         }
         *     });
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

            return function (receiver, supplier, filter) {
                // Copy properties
                for (var propertyName in supplier) {
                    if (supplier.hasOwnProperty(propertyName)) {
                        var propertyValue = supplier[propertyName];
                        if (!filter || filter(propertyName, propertyValue)) {
                            receiver[propertyName] = propertyValue;
                        }
                    }
                }

                // Copy non-enumerable properties
                for (var i = 0; i < NON_ENUMERABLES_LENGTH; i++) {
                    var propertyName = NON_ENUMERABLES[i];
                    if (supplier.hasOwnProperty(propertyName)) {
                        var propertyValue = supplier[propertyName];
                        if (!filter || filter(propertyName, propertyValue)) {
                            receiver[propertyName] = propertyValue;
                        }
                    }
                }
            };
        }());

        /**
         * Creates a new object type that inherits from this object type.
         *
         * @param {Object} body The object type body definition.
         *
         * @return {Function} The new object type constructor function.
         *
         * @static
         *
         * @throws ReservedPropertyError
         *
         * @example
         *
         *     var MyType = CryptoJS.lib.Object.extend({
         *         field: 'value',
         *
         *         constructor: function () {
         *         },
         *
         *         method: function () {
         *         },
         *
         *         $static: {
         *             method: function () {
         *             }
         *         }
         *     });
         */
        O.extend = (function () {
            function staticMixInFilter(propertyName) {
                if (propertyName === '$static') {
                    return false;
                } else {
                    return true;
                }
            }

            return function (body) {
                /*jshint validthis:true */

                // Default value
                if (!body) {
                    body = {};
                }

                // <?php if ($debug): ?>
                {
                    // Check reserved properties
                    if (body.$static && body.$static.$super) {
                        throw new ReservedPropertyError('"$super" is reserved.');
                    }
                }
                // <?php endif ?>

                // Get or create constructor
                if (body.hasOwnProperty('constructor')) {
                    var Subtype = body.constructor;
                } else {
                    var Subtype = function Subtype() {
                        Subtype.$super.apply(this, arguments);
                    };
                }

                // Inherit instance properties
                var subtypePrototype = Subtype.prototype = O.create(this.prototype);
                subtypePrototype.constructor = Subtype;

                // "Inherit" static properties
                O.mixIn(Subtype, this);

                // Own instance properties
                O.mixIn(subtypePrototype, body, staticMixInFilter);

                // Own static properties
                var bodyStatic = body.$static;
                if (bodyStatic) {
                    O.mixIn(Subtype, bodyStatic);
                }

                // Reference supertype
                Subtype.$super = this;

                return Subtype;
            };
        }());

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
    }

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_LIB.WordArray = O.extend({
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
                    var thisNextByteOffset = thisSigBytes + i;
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[thisNextByteOffset >>> 2] |= thatByte << (24 - (thisNextByteOffset % 4) * 8);
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
        },

        $static: {
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

                return new WordArray(words, nBytes);
            }
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
            var hexChars = '';
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars += (bite >>> 4).toString(16);
                hexChars += (bite & 0xf).toString(16);
            }

            return hexChars;
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
            {
                if (hexStrLength % 2 !== 0) {
                    throw new HexOctetError('The hex string must represent a whole number of bytes.');
                }
            }
            // <?php endif ?>

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
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
            var latin1Chars = '';
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars += String.fromCharCode(bite);
            }

            return latin1Chars;
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
         * @throws MalformedUtf8Error
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
                        throw new MalformedUtf8Error('Malformed UTF-8 bytes.');
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
            this._nDataBitsLsw = 0;
            this._nDataBitsMsw = 0;
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
            if (nBlocksReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords.slice(offset, blockSize));
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
            var clone = BufferedBlockAlgorithm.$super.prototype.clone.call(this);
            clone._data = clone._data.clone();

            return clone;
        }
    });

    /**
     * Abstract base hasher template.
     */
    C_LIB.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Constructor.
         */
        constructor: function () {
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
        blockSize: 512 / 32,

        $static: {
            /**
             * Shortcut to a hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA256.hash('message');
             */
            hash: function (message) {
                var ConcreteHasher = this;
                return (new ConcreteHasher()).finalize(message);
            }
        }
    });

    // <?php if ($debug): ?>
    {
        /**
         * Error namespace.
         */
        var C_ERR = C.err = {};

        /**
         * Reserved property error.
         */
        var ReservedPropertyError = C_ERR.ReservedPropertyError = O.extend.call(Error);

        /**
         * Hex octet error.
         */
        var HexOctetError = C_ERR.HexOctetError = O.extend.call(Error);

        /**
         * Malformed UTF-8 error.
         */
        var MalformedUtf8Error = C_ERR.MalformedUtf8Error = O.extend.call(Error);
    }
    // <?php endif ?>

    // Expose CryptoJS namespace object
    return C;
}(Math));
