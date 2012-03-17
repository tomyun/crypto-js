/**
 * A noop padding strategy.
 */
CryptoJS.pad.NoPadding = {
    pad: function () {
    },

    unpad: function () {
    },

    toString: function () {
        return 'NoPadding';
    }
};
