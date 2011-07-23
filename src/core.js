var CryptoJS;

// Private scope
(function (undefined) {
    // Don't overwrite
    if (CryptoJS) {
        return;
    }

    // CryptoJS namespace
    var C = CryptoJS = {};

    // Library namespace
    var C_lib = C.lib = {};

    // BaseObj
    var BaseObj = C_lib.BaseObj = {
        extend: function (overrides) {
            // Spawn
            function F() {}
            F.prototype = this;
            var subtype = new F();

            // Augment
            if (overrides) {
                for (var p in overrides) {
                    if (overrides.hasOwnProperty(p)) {
                        subtype[p] = overrides[p];
                    }
                }

                // IE won't copy toString using the loop above
                if (overrides.hasOwnProperty('toString')) {
                    subtype.toString = overrides.toString;
                }
            }

            // Reference supertype
            subtype.$super = this;

            return subtype;
        },

        create: function () {
            var instance = this.extend();
            instance.init.apply(instance, arguments);

            return instance;
        },

        init: function () {
            // Stub
        },

        clone: function () {
            return this.$super.extend(this);
        }
    };

    // Encoding namespace
    var C_enc = C.enc = {};

    // Hex
    var Hex = C_enc.Hex = BaseObj.extend({
        encode: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            var hexStr = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexStr.push((bite >>> 4).toString(16));
                hexStr.push((bite & 0xf).toString(16));
            }

            return hexStr.join('');
        },

        decode: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return WordArray_Hex.create(words, hexStrLength / 2);
        }
    });

    // Latin-1
    var Latin1 = C_enc.Latin1 = BaseObj.extend({
        encode: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            var latin1Str = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Str.push(String.fromCharCode(bite));
            }

            return latin1Str.join('');
        },

        decode: function (latin1Str) {
            // Shortcut
            var latin1StrStrLength = latin1Str.length;

            var words = [];
            for (var i = 0; i < latin1StrStrLength; i++) {
                words[i >>> 2] |= latin1Str.charCodeAt(i) << (24 - (i % 4) * 8);
            }

            return WordArray_Latin1.create(words, latin1StrStrLength);
        }
    });

    // Utf8
    var Utf8 = C_enc.Utf8 = BaseObj.extend({
        encode: function (wordArray) {
            return decodeURIComponent(escape(Latin1.encode(wordArray)));
        },

        decode: function (utf8Str) {
            return WordArray_Utf8.extend(Latin1.decode(unescape(encodeURIComponent(utf8Str))));
        }
    });

    // WordArray
    var WordArray = C_lib.WordArray = BaseObj.extend({
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes !== undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        toString: function (encoder) {
            return (encoder || this.encoder).encode(this);
        },

        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            for (var i = 0; i < thatSigBytes; i++) {
                var thatBite = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[thisSigBytes >>> 2] |= thatBite << (24 - (thisSigBytes % 4) * 8);
                thisSigBytes++;
            }
            this.sigBytes = thisSigBytes;

            // Chainable
            return this;
        },

        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        clone: function () {
            var clone = WordArray.$super.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        random: function (nWords) {
            var words = [];
            for (; nWords > 0; nWords--) {
                words.push(Math.floor(Math.random() * 0x100000000));
            }

            return this.create(words);
        }
    });

    // WordArray.Hex
    var WordArray_Hex = WordArray.Hex = WordArray.extend({
        encoder: Hex
    });

    // WordArray.Latin1
    var WordArray_Latin1 = WordArray.Latin1 = WordArray.extend({
        encoder: Latin1
    });

    // WordArray.Utf8
    var WordArray_Utf8 = WordArray.Utf8 = WordArray.extend({
        encoder: Utf8
    });

    // Event
    var Event = C_lib.Event = BaseObj.extend({
        init: function () {
            this.subscribers = [];
        },

        subscribe: function (callback) {
            this.subscribers.push(callback);
        },

        fire: function () {
            // Shortcuts
            var subscribers = this.subscribers;
            var subscribersLength = subscribers.length;

            // Execute callbacks
            for (var i = 0; i < subscribersLength; i++) {
                subscribers[i]();
            }
        }
    });

    // Formatter
    var Formatter = C_lib.Formatter = BaseObj.extend({
        init: function (rawData, salt) {
            this.rawData = rawData;
            this.salt = salt;
        },

        toString: function (encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Shortcuts
            var rawData = this.rawData;
            var salt = this.salt;

            if (salt) {
                // "Salted__" + salt + rawData
                return WordArray.create([0x53616c74, 0x65645f5f]).
                       concat(salt).concat(rawData).toString(encoder);
            } else {
                return rawData.toString(encoder);
            }
        },

        fromString: function (dataStr, encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Decode data string
            var rawData = encoder.decode(dataStr);

            // Shortcut
            var rawDataWords = rawData.words;

            // Test for salt
            if (rawDataWords[0] == 0x53616c74 && rawDataWords[1] == 0x65645f5f) {
                // Remove prefix
                rawDataWords.splice(0, 2);
                rawData.sigBytes -= 8;

                // Separate salt from raw data
                var salt = rawData.clone();
                salt.sigBytes = 8;
                salt.clamp();

                rawDataWords.splice(0, 2);
                rawData.sigBytes -= 8;
            }

            return this.create(rawData, salt);
        }
    });

    // Hash namespace
    var C_hash = C.hash = {};

    // Formatter
    var HashFormatter = C_hash.Formatter = Formatter.extend({
        encoder: Hex
    });

    // Base
    var HashBase = C_hash.Base = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            formatter: HashFormatter,

            salter: function () {
                var hasher = this;

                // Shortcut
                var cfg = hasher.cfg;

                // Use random salt if not defined
                if ( ! cfg.salt) {
                    cfg.salt = WordArray_Hex.random(2);
                }

                // Add salt after reset, before any message updates
                hasher.afterReset.subscribe(function () {
                    hasher.update(cfg.salt);
                });
            }
        }),

        init: function (cfg) {
            // Apply config defaults
            cfg = this.cfg = this.cfg.extend(cfg);

            // Set up events
            this.afterReset    = Event.create();
            this.beforeCompute = Event.create();
            this.afterCompute  = Event.create();

            // Execute salter
            if (cfg.salt !== null) {
                cfg.salter.call(this);
            }

            this.reset();
        },

        reset: function () {
            var hash = this.hash = WordArray_Hex.create();
            this.message = WordArray_Hex.create();
            this.length = 0;

            this.doReset();

            // Update sigBytes using length of hash
            hash.sigBytes = hash.words.length * 4;

            // Notify subscribers
            this.afterReset.fire();
        },

        update: function (messageUpdate) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof messageUpdate == 'string') {
                messageUpdate = Utf8.decode(messageUpdate);
            }

            this.message.concat(messageUpdate);
            this.length += messageUpdate.sigBytes;

            this.hashBlocks();

            // Chainable
            return this;
        },

        hashBlocks: function () {
            // Shortcuts
            var message = this.message;
            var sigBytes = message.sigBytes;
            var blockSize = this.blockSize;

            // Count blocks ready
            var nBlocksReady = Math.floor(sigBytes / (blockSize * 4));

            if (nBlocksReady) {
                // Hash blocks
                var nWordsReady = nBlocksReady * blockSize;
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    this.doHashBlock(offset);
                }

                // Remove processed words
                message.words.splice(0, nWordsReady);
                message.sigBytes = sigBytes - nWordsReady * 4;
            }
        },

        compute: function () {
            if (this.hash) {
                return this.computeInstance.apply(this, arguments);
            } else {
                return this.computeStatic.apply(this, arguments);
            }
        },

        computeInstance: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            // Notify subscribers
            this.beforeCompute.fire();

            this.doCompute();

            // Notify subscribers
            this.afterCompute.fire();

            // Shortcut
            var cfg = this.cfg;

            // Create formatter
            var formatter = cfg.formatter.create(this.hash, cfg.salt);

            this.reset();

            return formatter;
        },

        computeStatic: function (message, cfg) {
            return this.create(cfg).compute(message);
        },

        // Default, because it's common
        blockSize: 16
    });
}());
