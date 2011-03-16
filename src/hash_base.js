(function (C) {
    // Shortcuts
    var WordArray = C.lib.WordArray;

    var Hasher = C.lib.Hasher = C.oop.BaseFn.extend({
        init: function () {
            if (this instanceof Hasher)
            {
                /* New instance */

                this.reset();
            }
            else
            {
                /* Static call */

                var concreteHasher = arguments.callee.caller;
                var message = arguments[0];

                var hasher = new concreteHasher();
                return hasher.finalize(message);
            }
        },

        reset: function () {
            this._message = new WordArray();
            this._length = 0;
            this._hash = new WordArray();

            this._doReset();
        },

        update: function (messageUpdate) {
            // Convert String to WordArray, else assume WordArray already
            if (typeof messageUpdate == 'string') {
                messageUpdate = C.enc.Utf8Str.decode(messageUpdate);
            }

            this._message.concat(messageUpdate);
            this._length += messageUpdate.getSigBytes();

            this._hashBlocks();
        },

        _hashBlocks: function () {
            // Shortcuts
            var message = this._message;
            var blockSize = this.constructor.blockSize;

            // Count blocks ready
            var nBlocksReady = Math.floor(message.getSigBytes() / (blockSize * 4));

            if (nBlocksReady) {
                // Hash blocks
                var nWordsReady = nBlocksReady * blockSize;
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    this._hashBlock(offset);
                }

                // Remove processed words
                message.words.splice(0, nWordsReady);
                message.setSigBytes(message.getSigBytes() - nWordsReady * 4);
            }
        },

        finalize: function (messageUpdate) {
            if (messageUpdate) this.update(messageUpdate);

            this._doFinalize();
            var hash = this._hash;
            this.reset();

            return hash;
        }
    });
})(CryptoJS);
