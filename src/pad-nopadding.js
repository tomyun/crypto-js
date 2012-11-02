(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_pad = C.pad;

    /**
     * A noop padding strategy.
     */
    C_pad.NoPadding = {
        pad: function () {
        },

        unpad: function () {
        }
    };
}());
