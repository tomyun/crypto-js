(function (undefined) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_LIB = C.lib;
    var O = C_LIB.Object;
    var X32WordArray = C_LIB.WordArray;

    /**
     * x64 namespace.
     */
    var C_X64 = C.x64 = {};

    /**
     * A 64-bit word.
     *
     * @property {number} msw The most significant 32 bits.
     * @property {number} lsw The least significant 32 bits.
     */
    var X64Word = C_X64.Word = O.extend({
        /**
         * Constructor.
         *
         * @param {number} msw The most significant 32 bits.
         * @param {number} lsw The least significant 32 bits.
         *
         * @example
         *
         *     var x64Word = new CryptoJS.x64.Word(0x00010203, 0x04050607);
         */
        constructor: function (msw, lsw) {
            this.msw = msw;
            this.lsw = lsw;
        },

        /**
         * Bitwise NOTs this word.
         *
         * @return {X64Word} A new x64-Word object after negating.
         *
         * @example
         *
         *     var negated = x64Word.not();
         */
        not: function () {
            return new X64Word(~this.msw, ~this.lsw);
        },

        /**
         * Bitwise ANDs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to AND with this word.
         *
         * @return {X64Word} A new x64-Word object after ANDing.
         *
         * @example
         *
         *     var anded = x64Word.and(anotherX64Word);
         */
        and: function (word) {
            return new X64Word(this.msw & word.msw, this.lsw & word.lsw);
        },

        /**
         * Bitwise ORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to OR with this word.
         *
         * @return {X64Word} A new x64-Word object after ORing.
         *
         * @example
         *
         *     var ored = x64Word.or(anotherX64Word);
         */
        or: function (word) {
            return new X64Word(this.msw | word.msw, this.lsw | word.lsw);
        },

        /**
         * Bitwise XORs this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to XOR with this word.
         *
         * @return {X64Word} A new x64-Word object after XORing.
         *
         * @example
         *
         *     var xored = x64Word.xor(anotherX64Word);
         */
        xor: function (word) {
            return new X64Word(this.msw ^ word.msw, this.lsw ^ word.lsw);
        },

        /**
         * Shifts this word n bits to the left.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftL(25);
         */
        shiftL: function (n) {
            if (n === 0) {
                return this;
            } else if (n < 32) {
                var msw = (this.msw << n) | (this.lsw >>> (32 - n));
                var lsw = this.lsw << n;
            } else {
                var msw = this.lsw << (n - 32);
                var lsw = 0;
            }

            return new X64Word(msw, lsw);
        },

        /**
         * Shifts this word n bits to the right.
         *
         * @param {number} n The number of bits to shift.
         *
         * @return {X64Word} A new x64-Word object after shifting.
         *
         * @example
         *
         *     var shifted = x64Word.shiftR(7);
         */
        shiftR: function (n) {
            if (n === 0) {
                return this;
            } else if (n < 32) {
                var lsw = (this.lsw >>> n) | (this.msw << (32 - n));
                var msw = this.msw >>> n;
            } else {
                var lsw = this.msw >>> (n - 32);
                var msw = 0;
            }

            return new X64Word(msw, lsw);
        },

        /**
         * Rotates this word n bits to the left.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotL(25);
         */
        rotL: function (n) {
            return this.shiftL(n).or(this.shiftR(64 - n));
        },

        /**
         * Rotates this word n bits to the right.
         *
         * @param {number} n The number of bits to rotate.
         *
         * @return {X64Word} A new x64-Word object after rotating.
         *
         * @example
         *
         *     var rotated = x64Word.rotR(7);
         */
        rotR: function (n) {
            return this.shiftR(n).or(this.shiftL(64 - n));
        },

        /**
         * Adds this word with the passed word.
         *
         * @param {X64Word} word The x64-Word to add with this word.
         *
         * @return {X64Word} A new x64-Word object after adding.
         *
         * @example
         *
         *     var added = x64Word.add(anotherX64Word);
         */
        add: function (word) {
            var lsw = (this.lsw + word.lsw) | 0;
            var carry = (lsw >>> 0) < (this.lsw >>> 0) ? 1 : 0;
            var msw = (this.msw + word.msw + carry) | 0;

            return new X64Word(msw, lsw);
        }
    });

    /**
     * An array of 64-bit words.
     *
     * @property {Array} words The array of X64Word objects.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var X64WordArray = C_X64.WordArray = O.extend({
        /**
         * Constructor.
         *
         * @param {Array} words (Optional) An array of X64Word objects.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = new CryptoJS.x64.WordArray();
         *
         *     var wordArray = new CryptoJS.x64.WordArray([
         *         new CryptoJS.x64.Word(0x00010203, 0x04050607),
         *         new CryptoJS.x64.Word(0x18191a1b, 0x1c1d1e1f)
         *     ]);
         *
         *     var wordArray = new CryptoJS.x64.WordArray([
         *         new CryptoJS.x64.Word(0x00010203, 0x04050607),
         *         new CryptoJS.x64.Word(0x18191a1b, 0x1c1d1e1f)
         *     ], 10);
         */
        constructor: function (words, sigBytes) {
            // Default values
            if (!words) {
                words = [];
            }
            if (sigBytes === undefined) {
                sigBytes = words.length * 8;
            }

            // Set properties
            this.words = words;
            this.sigBytes = sigBytes;
        },

        /**
         * Converts this 64-bit word array to a 32-bit word array.
         *
         * @return {X32WordArray} This word array's data as a 32-bit word array.
         *
         * @example
         *
         *     var x32WordArray = x64WordArray.toX32();
         */
        toX32: function () {
            // Shortcuts
            var x64Words = this.words;
            var x64WordsLength = x64Words.length;

            // Convert
            var x32Words = [];
            for (var i = 0; i < x64WordsLength; i++) {
                var x64Word = x64Words[i];
                x32Words[i * 2] = x64Word.msw;
                x32Words[i * 2 + 1] = x64Word.lsw;
            }

            return new X32WordArray(x32Words, this.sigBytes);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {X64WordArray} The clone.
         *
         * @example
         *
         *     var clone = x64WordArray.clone();
         */
        clone: function () {
            var clone = X64WordArray.$super.prototype.clone.call(this);

            // Clone "words" array
            var words = clone.words = clone.words.slice(0);

            // Clone each X64Word object
            var wordsLength = words.length;
            for (var i = 0; i < wordsLength; i++) {
                words[i] = words[i].clone();
            }

            return clone;
        }
    });
}());
