CryptoJS.mode.ECB = {
    encrypt: function (message, cipher) {
        // Shortcuts
        var messageWords = message.words;
        var messageWordsLength = messageWords.length;
        var cipherBlockSize = cipher.blockSize;

        // Encrypt each block
        for (var offset = 0; offset < messageWordsLength; offset += cipherBlockSize) {
            cipher._encryptBlock(messageWords, offset);
        }
    },

    decrypt: function (ciphertext, cipher) {
        // Shortcuts
        var ciphertextWords = ciphertext.words
        var ciphertextWordsLength = ciphertextWords.length;
        var cipherBlockSize = cipher.blockSize;

        // Encrypt each block
        for (var offset = 0; offset < ciphertextWordsLength; offset += cipherBlockSize) {
            cipher._decryptBlock(ciphertextWords, offset);
        }
    }
};
