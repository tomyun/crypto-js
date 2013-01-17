(function () {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var SHA256 = C.SHA256;

    /**
     * SHA-224 hash algorithm.
     */
    var SHA224 = C.SHA224 = SHA256.extend({
        _doReset: function () {
            this._state = [
                0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
                0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
            ];
        },

        _doFinalize: function () {
            var hash = SHA224.$super.prototype._doFinalize.call(this);

            hash.sigBytes -= 4;

            return hash;
        }
    });
}());
