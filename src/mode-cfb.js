/**
 * Cipher Feedback block mode.
 */
CryptoJS.mode.CFB = {
    encrypt: function (message, cipher, iv) {
        // Shortcuts
        var messageWords = message.words;
        var messageWordsLength = message.sigBytes / 4;
        var cipherBlockSize = cipher._blockSize;
        var keystream = iv.clone();
        var keystreamWords = keystream.words;

        // Encrypt each block
        for (var offset = 0; offset < messageWordsLength; offset += cipherBlockSize) {
            // Generate next keystream block
            cipher._encryptBlock(keystreamWords, 0);

            // Encrypt this block
            for (var i = 0; i < cipherBlockSize; i++) {
                messageWords[offset + i] ^= keystreamWords[i];

                // Use ciphertext for next keystream
                keystreamWords[i] = messageWords[offset + i];
            }
        }
    },

    decrypt: function (ciphertext, cipher, iv) {
        // Shortcuts
        var ciphertextWords = ciphertext.words;
        var ciphertextWordsLength = ciphertext.sigBytes / 4;
        var cipherBlockSize = cipher._blockSize;
        var keystream = iv.clone();
        var keystreamWords = keystream.words;

        // Encrypt each block
        for (var offset = 0; offset < ciphertextWordsLength; offset += cipherBlockSize) {
            // Generate next keystream block
            cipher._encryptBlock(keystreamWords, 0);

            // Encrypt this block
            for (var i = 0; i < cipherBlockSize; i++) {
                // Remember ciphertext
                var ciphertextWord = ciphertextWords[offset + i];

                // Decrypt
                ciphertextWords[offset + i] ^= keystreamWords[i];

                // Use ciphertext for next keystream
                keystreamWords[i] = ciphertextWord;
            }
        }
    }
};
