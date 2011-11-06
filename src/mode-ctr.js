/**
 * Counter block mode.
 */
CryptoJS.mode.CTR = {
    encrypt: function (message, cipher, iv) {
        // Shortcuts
        var messageWords = message.words;
        var messageWordsLength = message.sigBytes / 4;
        var cipherBlockSize = cipher._blockSize;
        var counter = iv.clone();
        var counterWords = counter.words;

        // Encrypt each block
        for (var offset = 0; offset < messageWordsLength; offset += cipherBlockSize) {
            // Generate next keystream block
            var keystream = counter.clone();
            var keystreamWords = keystream.words;
            cipher._encryptBlock(keystreamWords, 0);

            // Encrypt this block
            for (var i = 0; i < cipherBlockSize; i++) {
                messageWords[offset + i] ^= keystreamWords[i];
            }

            // Increment counter
            counterWords[cipherBlockSize - 1]++;
        }
    },

    decrypt: function () {
        // Encrypt and decryption are identical operations
        this.encrypt.apply(this, arguments);
    }
};
