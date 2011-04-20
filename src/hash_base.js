(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C.oop.BaseObj;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;
    var Event = C_lib.Event;

    /* Hash
    ------------------------------------------------------------ */
    var HashFormatter = C_lib.HashFormatter = BaseObj.extend({
        init: function (hash, salt) {
            this.rawHash = hash;
            this.salt = salt;
        },

        toString: function () {
            var hashStr = '';

            // Shortcuts
            var salt = this.salt;

            if (salt) {
                hashStr += 'salt_' + salt.toString(C.enc.Hex) + '_';
            }

            return hashStr + this.rawHash;
        },

        fromString: function (hashStr) {
            var rawHashBeginIndex = 0;

            // Get salt
            if (hashStr.substr(0, 5) == 'salt_') {
                var saltEndIndex = hashStr.indexOf('_', 5);
                var salt = WordArray_Hex.fromString(hashStr.substring(5, saltEndIndex));

                rawHashBeginIndex = saltEndIndex + 1;
            }

            // Get raw hash
            var rawHash = WordArray_Hex.fromString(hashStr.substr(rawHashBeginIndex));

            return this.create(rawHash, salt);
        }
    });

    /* Hasher
    ------------------------------------------------------------ */
    var Hasher = C_lib.Hasher = BaseObj.extend({
        optionDefaults: BaseObj.extend({
            formatter: HashFormatter,

            salter: function (salt) {
                this.afterReset.subscribe({
                    fn: function (salt) {
                        this.update(salt);
                    },
                    context: this,
                    args: [salt]
                });
            }
        }),

        init: function (options) {
            // Apply option defaults
            options = this.options = this.optionDefaults.extend(options);

            // Set up events
            this.afterReset = Event.create();
            this.beforeCompute = Event.create();
            this.afterCompute = Event.create();

            // Shortcuts
            var salt = options.salt;

            // Use random salt if not defined
            if (salt === undefined) {
                salt = options.salt = WordArray_Hex.random(8);
            }

            // Execute salter
            if (salt) {
                options.salter.call(this, salt);
            }

            this.reset();
        },

        reset: function () {
            this.message = WordArray.create();
            this.length = 0;
            var hash = this.hash = WordArray_Hex.create();

            this.doReset();

            // Update sigBytes using length of hash
            hash.sigBytes = hash.words.length * 4;

            // Notify subscribers
            this.afterReset.fire();
        },

        update: function (messageUpdate) {
            // Convert String to WordArray, else assume WordArray already
            if (typeof messageUpdate == 'string') {
                messageUpdate = WordArray.fromString(messageUpdate);
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

        compute: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            // Notify subscribers
            this.beforeCompute.fire();

            this.doCompute();

            // Notify subscribers
            this.afterCompute.fire();

            // Shortcuts
            var options = this.options;

            // Keep hash after reset
            var hash = options.formatter.create(this.hash, options.salt);

            this.reset();

            return hash;
        },

        // Default, because it's common
        blockSize: 16
    });
}(CryptoJS));
