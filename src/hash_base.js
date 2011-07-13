(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray_Hex = C_lib.WordArray.Hex
    var Event = C_lib.Event;

    // Hash formatter
    var HashFormatter = C_lib.HashFormatter = BaseObj.extend({
        init: function (hash, salt) {
            this.rawHash = hash;
            this.salt = salt;
        },

        toString: function () {
            var hashStr = '';

            if (this.salt) {
                hashStr += 'salt:' + this.salt.toString(C.enc.Hex) + ':';
            }

            return hashStr + this.rawHash;
        }
    });

    // Hasher
    var Hasher = C_lib.Hasher = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            formatter: HashFormatter,

            salter: function () {
                var hasher = this;

                // Use random salt if not defined
                if ( ! hasher.cfg.salt) {
                    hasher.cfg.salt = WordArray_Hex.random(2);
                }

                // Add salt after reset, before any message updates
                hasher.afterReset.subscribe(function () {
                    hasher.update(hasher.cfg.salt);
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
            this.message = WordArray_Hex.create();
            this.length = 0;
            var hash = this.hash = WordArray_Hex.create();

            this.doReset();

            // Update sigBytes using length of hash
            hash.sigBytes = hash.words.length * 4;

            // Notify subscribers
            this.afterReset.fire();
        },

        update: function (messageUpdate) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof messageUpdate == 'string') {
                messageUpdate = C.enc.Utf8.decode(messageUpdate);
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

            // Create hash formatter
            var hashFormatter = cfg.formatter.create(this.hash, cfg.salt);

            this.reset();

            return hashFormatter;
        },

        computeStatic: function (message, cfg) {
            return this.create(cfg).compute(message);
        },

        // Default, because it's common
        blockSize: 16
    });
}(CryptoJS));
