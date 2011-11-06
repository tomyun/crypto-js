/**
 * Zero padding strategy.
 */
CryptoJS.pad.ZeroPadding = {
    pad: function (data, blockSize) {
        // Shortcut
        var blockSizeBytes = blockSize * 4;

        // Pad
        data.sigBytes += blockSizeBytes - data.sigBytes % blockSizeBytes;
    },

    unpad: function (data) {
        // Shortcut
        var dataWords = data.words;

        // Unpad
        var i = data.sigBytes - 1;
        while (((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff) == 0) {
            i--;
        }
        data.sigBytes = i + 1;
    }
};
