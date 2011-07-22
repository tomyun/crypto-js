(function (C, undefined) {
    // Core shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;
    var WordArray_Latin1 = WordArray.Latin1;
    var WordArray_Utf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    // Hash namespace
    var C_hash = C.hash = {};

    // Formatter
    var Formatter = C_hash.Formatter = C_lib.Formatter.extend({
        encoder: Hex
    });

    // Base
    var Base = C_hash.Base = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            formatter: Formatter,

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
            this.afterReset = Event.create();
            this.beforeCompute = Event.create();
            this.afterCompute = Event.create();

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
}(CryptoJS));
