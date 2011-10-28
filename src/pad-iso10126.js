(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_WordArray = C_lib.WordArray;
    var C_pad = C.pad;

    /**
     * ISO 10126 padding strategy.
     */
    C_pad.Iso10126 = {
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = (blockSizeBytes - data.sigBytes % blockSizeBytes) || blockSizeBytes;

            // Pad
            data.concat(C_lib_WordArray.random(nPaddingBytes - 1)).
                 concat(C_lib_WordArray.create([nPaddingBytes << 24], 1));
        },

        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };
}());
