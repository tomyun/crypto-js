// Module pattern
var CryptoJS = CryptoJS || (function () {
    // CryptoJS namespace
    var C = {};

    // Library namespace
    var C_lib = C.lib = {};

    // Base
    var C_lib_Base = C_lib.Base = {
        extend: function (overrides) {
            // Spawn
            C_lib_Base_F.prototype = this;
            var subtype = new C_lib_Base_F();

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

        isA: function (objectType) {
            var o = this;

            do {
                if (o == objectType) {
                    return true;
                }
            } while (o = o.$super);
        },

        cast: function (o) {
            return this.extend(o);
        },

        clone: function () {
            return this.$super.extend(this);
        }
    };

    function C_lib_Base_F() {}

    // WordArray
    var C_lib_WordArray = C_lib.WordArray = C_lib_Base.extend({
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes !== undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        toString: function (encoder) {
            return ((encoder && encoder.cast(this)) || this).doToString();
        },

        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            for (var i = 0; i < thatSigBytes; i++) {
                var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[thisSigBytes >>> 2] |= thatByte << (24 - (thisSigBytes % 4) * 8);
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
            var clone = C_lib_WordArray.$super.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push(Math.floor(Math.random() * 0x100000000));
            }

            return this.create(words, nBytes);
        }
    });

    // Encoding namespace
    var C_enc = C.enc = {};

    // Hex encoder
    var C_enc_Hex = C_enc.Hex = C_lib_WordArray.extend({
        doToString: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            var hexStr = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexStr.push((bite >>> 4).toString(16));
                hexStr.push((bite & 0xf).toString(16));
            }

            return hexStr.join('');
        },

        fromString: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return this.create(words, hexStrLength / 2);
        }
    });

    // Latin1 encoder
    var C_enc_Latin1 = C_enc.Latin1 = C_lib_WordArray.extend({
        doToString: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            var latin1Str = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Str.push(String.fromCharCode(bite));
            }

            return latin1Str.join('');
        },

        fromString: function (latin1Str) {
            // Shortcut
            var latin1StrStrLength = latin1Str.length;

            var words = [];
            for (var i = 0; i < latin1StrStrLength; i++) {
                words[i >>> 2] |= latin1Str.charCodeAt(i) << (24 - (i % 4) * 8);
            }

            return this.create(words, latin1StrStrLength);
        }
    });

    // Utf8 encoder
    var C_enc_Utf8 = C_enc.Utf8 = C_lib_WordArray.extend({
        doToString: function () {
            return decodeURIComponent(escape(this.toString(C_enc_Latin1)));
        },

        fromString: function (utf8Str) {
            return C_enc_Utf8.cast(C_enc_Latin1.fromString(unescape(encodeURIComponent(utf8Str))));
        }
    });

    // Event
    var C_lib_Event = C_lib.Event = C_lib_Base.extend({
        init: function () {
            this._callbacks = [];
        },

        subscribe: function (callback) {
            this._callbacks.push(callback);
        },

        fire: function () {
            // Shortcuts
            var callbacks = this._callbacks;
            var callbacksLength = callbacks.length;

            for (var i = 0; i < callbacksLength; i++) {
                callbacks[i]();
            }
        }
    });

    // Base formatter
    var C_lib_Formatter = C_lib.Formatter = C_lib_Base.extend({
        init: function (rawData, salt) {
            this.rawData = rawData;
            this.salt = salt;
        }
    });

    // Hash namespace
    var C_hash = C.hash = {};

    // Hash formatter namespace
    var C_hash_formatter = C_hash.formatter = {};

    // OpenSSL hash formatter
    var C_hash_formatter_OpenSSL = C_hash_formatter.OpenSSL = C_lib_Formatter.extend({
        toString: function (encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Shortcuts
            var rawData = this.rawData;
            var salt = this.salt;

            if (salt) {
                // Ensure correct size
                if (salt.sigBytes != 8) {
                    throw new Error('Salt must be 64 bits');
                }

                // "Salted__" + salt + rawData
                return C_lib_WordArray.create([0x53616c74, 0x65645f5f]).
                       concat(salt).concat(rawData).toString(encoder);
            } else {
                return rawData.toString(encoder);
            }
        },

        fromString: function (dataStr, encoder) {
            // Default encoder
            encoder = encoder || this.encoder;

            // Decode data string
            var rawData = encoder.fromString(dataStr);

            // Shortcut
            var rawDataWords = rawData.words;

            // Test for salt
            if (rawDataWords[0] == 0x53616c74 && rawDataWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = rawData.$super.create(rawDataWords.slice(2, 4));

                // Remove salt from raw data
                rawDataWords.splice(0, 4);
                rawData.sigBytes -= 16;
            }

            return this.create(rawData, salt);
        },

        encoder: C_enc_Hex
    });

    // Hash salter namespace
    var C_hash_salter = C_hash.salter = {};

    // OpenSSL-ish hash salter
    var C_hash_salter_OpenSSLish = C_hash_salter.OpenSSLish = {
        execute: function (hasher) {
            // Shortcuts
            var cfg = hasher.cfg;
            var salt = cfg.salt;

            // Use random salt if not defined
            if ( ! salt) {
                salt = cfg.salt = C_enc_Hex.random(8);
            }

            // Add salt after reset, before any message updates
            hasher.afterReset.subscribe(function () {
                hasher.update(salt);
            });
        }
    };

    // Base hash
    var C_hash_Base = C_hash.Base = C_lib_Base.extend({
        // Config defaults
        cfg: C_lib_Base.extend({
            formatter: C_hash_formatter_OpenSSL,
            salter: C_hash_salter_OpenSSLish
        }),

        init: function (cfg) {
            // Apply config defaults
            cfg = this.cfg = this.cfg.extend(cfg);

            // Set up events
            this.afterReset    = C_lib_Event.create();
            this.beforeCompute = C_lib_Event.create();
            this.afterCompute  = C_lib_Event.create();

            // Execute salter
            if (cfg.salt !== null) {
                cfg.salter.execute(this);
            }

            this.reset();
        },

        reset: function () {
            var hash = this.hash = C_enc_Hex.create();

            this.message = C_lib_WordArray.create();
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
                messageUpdate = C_enc_Utf8.fromString(messageUpdate);
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
            return (
                this.hash ?
                    C_hash_Base_computeInstance :
                    C_hash_Base_computeStatic
            ).apply(this, arguments);
        },

        // Default, because it's common
        blockSize: 16
    });

    function C_hash_Base_computeInstance(messageUpdate) {
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

        // Store extra data
        formatter.hasher = this.$super;

        this.reset();

        return formatter;
    }

    function C_hash_Base_computeStatic(message, cfg) {
        return this.create(cfg).compute(message);
    }

    // Module pattern
    return C;
}());
