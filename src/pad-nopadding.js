(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_pad = C.pad;

    /**
     * A noop padding strategy.
     */
    /*var NoPadding =*/ C_pad.NoPadding = {
        pad: function () {
        },

        unpad: function () {
        }
    };
}());
