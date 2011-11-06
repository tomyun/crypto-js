/**
 * ANSI X.923 padding strategy.
 */
CryptoJS.pad.AnsiX923 = {
    pad: function (data, blockSize) {
        // Shortcuts
        var dataSigBytes = data.sigBytes;
        var blockSizeBytes = blockSize * 4;

        // Count padding bytes
        var nPaddingBytes = (blockSizeBytes - dataSigBytes % blockSizeBytes) || blockSizeBytes;

        // Compute last byte position
        var lastBytePos = dataSigBytes + nPaddingBytes - 1;

        // Pad
        data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
        data.sigBytes = dataSigBytes + nPaddingBytes;
    },

    unpad: function (data) {
        // Get number of padding bytes from last byte
        var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

        // Remove padding
        data.sigBytes -= nPaddingBytes;
    }
};
