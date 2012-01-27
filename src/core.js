/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function () {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var C_lib_Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             */
            mixIn: function (properties) {
                for (var p in properties) {
                    if (properties.hasOwnProperty(p)) {
                        this[p] = properties[p];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             */
            init: function () {
            },

            /**
             * Tests if this object is a descendant of the passed type.
             *
             * @param {CryptoJS.lib.Base} type The potential ancestor.
             *
             * @return {boolean}
             */
            isA: function (type) {
                var o = this;

                while (o) {
                    if (o == type) {
                        return true;
                    } else {
                        o = o.$super;
                    }
                }

                return false;
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             */
            clone: function () {
                return this.$super.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     * @property {CryptoJS.enc.*} encoder
     *   The default encoding strategy to convert this word array to a string. Default: CryptoJS.enc.Hex
     */
    // Technical note: The default encoder can be set only after the encoders have been defined,
    // therefore that assignment appears farther down in this file.
    var C_lib_WordArray = C_lib.WordArray = C_lib_Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
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
         * @param {CryptoJS.enc.*} encoder (Optional) The encoding strategy to use.
         *
         * @return {string} The stringified word array.
         */
        toString: function (encoder) {
            return (encoder || this.encoder).toString(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {CryptoJS.lib.WordArray} wordArray The word array to append.
         *
         * @return {CryptoJS.lib.WordArray} This word array.
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clear excess bits
            this.clamp();

            // Concat
            for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[thisSigBytes >>> 2] |= thatByte << (24 - (thisSigBytes % 4) * 8);
                thisSigBytes++;
            }
            this.sigBytes = thisSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
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
         * @return {CryptoJS.lib.WordArray} The clone.
         */
        clone: function () {
            var clone = C_lib_WordArray.$super.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {CryptoJS.lib.WordArray} The random word array.
         *
         * @static
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push(Math.floor(Math.random() * 0x100000000));
            }

            return this.create(words, nBytes);
        }
    });

    /**
     * Base hash template.
     *
     * @property {number} _blockSize The number of 32-bit words this hash operates on. Default: 16 (512 bits)
     */
    var C_lib_Hash = C_lib.Hash = C_lib_Base.extend({
        _cfg: C_lib_Base.extend(),

        /**
         * Initializes a newly created hasher.
         */
        init: function (cfg) {
            this._cfg = this._cfg.extend(cfg);

            this.reset();
        },

        /**
         * Resets this hash to its initial state.
         */
        reset: function () {
            // Initial values
            var hash = this._hash = C_lib_WordArray.create();
            this._message = C_lib_WordArray.create();
            this._length = 0;

            // Perform hash-specific logic
            this._doReset();

            // Update sigBytes using length of hash
            hash.sigBytes = hash.words.length * 4;
        },

        /**
         * Updates this hash with a message.
         *
         * @param {CryptoJS.lib.WordArray|string} messageUpdate The message to append.
         *
         * @return {CryptoJS.lib.Hash} This hash instance.
         */
        update: function (messageUpdate) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof messageUpdate == 'string') {
                messageUpdate = C_enc_Utf8.fromString(messageUpdate);
            }

            // Append
            this._message.concat(messageUpdate);
            this._length += messageUpdate.sigBytes;

            // Update the hash
            this._hashBlocks();

            // Chainable
            return this;
        },

        /**
         * Updates this hash.
         */
        _hashBlocks: function () {
            // Shortcuts
            var message = this._message;
            var sigBytes = message.sigBytes;
            var blockSize = this._blockSize;

            // Count blocks ready
            var nBlocksReady = Math.floor(sigBytes / (blockSize * 4));

            if (nBlocksReady) {
                // Hash blocks
                var nWordsReady = nBlocksReady * blockSize;
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform hash-specific logic
                    this._doHashBlock(offset);
                }

                // Remove processed words
                message.words.splice(0, nWordsReady);
                message.sigBytes = sigBytes - nWordsReady * 4;
            }
        },

        /**
         * Completes this hash computation, then resets this hash to its initial state.
         *
         * @param {CryptoJS.lib.WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {CryptoJS.lib.WordArray} The hash.
         */
        compute: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            // Perform hash-specific logic
            this._doCompute();

            // Retain hash after reset
            var hash = this._hash;

            this.reset();

            return hash;
        },

        _blockSize: 512/32,

        /**
         * Creates a shortcut function to a hash algorithm's object interface.
         *
         * @param {CryptoJS.lib.Hash} hasher The hash algorithm to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return hasher.create(cfg).compute(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC algorithm's object interface.
         *
         * @param {CryptoJS.lib.Hash} hasher The hash algorithm to use with this helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return C_algo.HMAC.create(hasher, key).compute(message);
            };
        }
    });

    /**
     * Encoding namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var C_enc_Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {CryptoJS.lib.WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         */
        toString: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexStr = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexStr.push((bite >>> 4).toString(16));
                hexStr.push((bite & 0x0f).toString(16));
            }

            return hexStr.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {CryptoJS.lib.WordArray} The word array.
         *
         * @static
         */
        fromString: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return C_lib_WordArray.create(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var C_enc_Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {CryptoJS.lib.WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         */
        toString: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Str = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Str.push(String.fromCharCode(bite));
            }

            return latin1Str.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {CryptoJS.lib.WordArray} The word array.
         *
         * @static
         */
        fromString: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= latin1Str.charCodeAt(i) << (24 - (i % 4) * 8);
            }

            return C_lib_WordArray.create(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var C_enc_Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {CryptoJS.lib.WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         */
        toString: function (wordArray) {
            return decodeURIComponent(escape(C_enc_Latin1.toString(wordArray)));
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {CryptoJS.lib.WordArray} The word array.
         *
         * @static
         */
        fromString: function (utf8Str) {
            return C_enc_Latin1.fromString(unescape(encodeURIComponent(utf8Str)));
        }
    };

    // Set WordArray default encoder
    C_lib_WordArray.encoder = C_enc_Hex;

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}());
