(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_pad = C.pad;
    var ZeroPadding = C_pad.ZeroPadding;

    /**
     * ISO/IEC 9797-1 Padding Method 2.
     */
    C_pad.Iso97971 = {
        pad: function (data, blockSize) {
            // Add 0x80 byte
            data.concat(WordArray.create([0x80000000], 1));

            // Zero pad the rest
            ZeroPadding.pad(data, blockSize);
        },

        unpad: function (data) {
            // Remove zero padding
            ZeroPadding.unpad(data);

            // Remove one more byte -- the 0x80 byte
            data.sigBytes--;
        },

        toString: function () {
            return 'ISO97971';
        }
    };
}());
