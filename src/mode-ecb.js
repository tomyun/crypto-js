CryptoJS.mode.ECB = {
    encrypt: function (message, cipher) {
        // Shortcuts
        var messageWordsLength = message.words.length;
        var cipherBlockSize = cipher.blockSize;

        // Encrypt each block
        for (var offset = 0; offset < messageWordsLength; offset += cipherBlockSize) {
            cipher._encryptBlock(message, offset);
        }
    },

    decrypt: function (ciphertext, cipher) {
        // Shortcuts
        var ciphertextWordsLength = ciphertext.words.length;
        var cipherBlockSize = cipher.blockSize;

        // Encrypt each block
        for (var offset = 0; offset < ciphertextWordsLength; offset += cipherBlockSize) {
            cipher._decryptBlock(ciphertext, offset);
        }
    }
};
