(function (C) {
    // Shortcuts
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;

    // Hash
    var Hash = C_lib.Hash = WordArray.extend({
        encoder: C.enc.Hex
    });

    // Hasher template
    var Hasher = C_lib.Hasher = C.oop.BaseObj.extend({
        init: function () {
            this.reset();
        },

        reset: function () {
            this.message = WordArray.create();
            this.length = 0;
            this.hash = Hash.create();

            this.doReset();
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
            if (messageUpdate) {
                this.update(messageUpdate);
            }

            this.doCompute();

            // Keep hash after reset
            var hash = this.hash;

            // Update sigBytes using length of hash
            hash.sigBytes = hash.words.length * 4;

            this.reset();

            return hash;
        },

        // Default, because it's common
        blockSize: 16
    });
}(CryptoJS));
