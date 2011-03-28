(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C.oop.BaseObj;
    var WordArray = C_lib.WordArray;
    var Hex = C.enc.Hex;
    var CustomEvent = C_lib.CustomEvent;

    /* Hash
    ------------------------------------------------------------ */
    var Hash = C_lib.Hash = BaseObj.extend({
        init: function (hash, salt) {
            hash.defaultEncoder = Hex;
            this.rawHash = hash;

            if (salt) {
                salt.defaultEncoder = Hex;
                this.salt = salt;
            }
        },

        toString: function () {
            var hashStr = '';

            // Shortcuts
            var salt = this.salt;

            if (salt) {
                hashStr += 'salt_' + salt + '_';
            }

            return hashStr + this.rawHash;
        },

        fromString: function (hashStr) {
            var rawHashBeginIndex = 0;

            if (hashStr.substr(0, 5) == 'salt_') {
                var saltEndIndex = hashStr.indexOf('_', 5);
                var salt = WordArray.fromString(hashStr.substring(5, saltEndIndex), Hex);

                rawHashBeginIndex = saltEndIndex + 1;
            }

            var rawHash = WordArray.fromString(hashStr.substr(rawHashBeginIndex), Hex);

            return Hash.create(rawHash, salt);
        }
    });

    /* Hasher
    ------------------------------------------------------------ */
    var hasherOptionDefaults = BaseObj.extend({
        hashObj: Hash,

        salter: function (salt) {
            this.afterReset.subscribe({
                fn: function (salt) {
                    this.update(salt);
                },
                context: this,
                args: [salt]
            });
        }
    });

    var Hasher = C_lib.Hasher = BaseObj.extend({
        init: function (options) {
            // Apply option defaults
            options = this.options = hasherOptionDefaults.extend(options);

            // Set up events
            this.afterReset = CustomEvent.create();
            this.beforeCompute = CustomEvent.create();
            this.afterCompute = CustomEvent.create();

            // Shortcuts
            var salt = options.salt;

            // Use random salt if not defined
            if (salt === undefined) {
                salt = options.salt = WordArray.random(8);
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
            var hash = this.hash = WordArray.create();

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
            var hash = options.hashObj.create(this.hash, options.salt);

            this.reset();

            return hash;
        },

        // Default, because it's common
        blockSize: 16
    });
}(CryptoJS));
