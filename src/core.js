var CryptoJS;

// Don't overwrite
if ( ! CryptoJS) {
    // Private scope
    (function (undefined) {
        var C = CryptoJS = {};

        /* OOP
        ------------------------------------------------------------ */
        var oop = C.oop = {};

        /* OOP / Base
        --------------------------------------------- */
        var BaseObj = oop.BaseObj = extendObject.call(Object.prototype, {
            extend: extendObject
        });

        var BaseFn = oop.BaseFn = extendFunction.call(Object, {
            init: function () {
            }
        });

        function F() {}

        function extendObject(overrides) {
            // Create subtype
            F.prototype = this;
            var subtype = new F();

            // Override properties
            if (overrides) {
                for (var p in overrides) {
                    subtype[p] = overrides[p];
                }

                // IE won't copy toString using the loop
                if (overrides.hasOwnProperty('toString')) {
                    subtype.toString = overrides.toString;
                }
            }

            // Reference supertype
            subtype.$super = this;

            return subtype;
        }

        function extendFunction(overrides) {
            // Create subtype constructor
            function Subtype() {
                return Subtype.prototype.init.apply(this, arguments);
            }

            // Make subtype extendable
            Subtype.extend = extendFunction;

            // Create subtype prototype that inherits from supertype prototype
            Subtype.prototype = extendObject.call(this.prototype, overrides);

            // Fix constructor property
            Subtype.prototype.constructor = Subtype;

            return Subtype;
        }

        /* Library
        ------------------------------------------------------------ */
        var lib = C.lib = {};

        /* Library / WordArray
        --------------------------------------------- */
        var WordArray = lib.WordArray = BaseFn.extend({
            init: function (words, sigBytes) {
                this.words = words || [];

                if (sigBytes != undefined) {
                    this.setSigBytes(sigBytes);
                }
            },

            getSigBytes: function () {
                // Shortcuts
                var sigBytes = this._sigBytes;

                if (sigBytes != undefined) {
                    return sigBytes;
                } else {
                    return this.words.length * 4;
                }
            },

            setSigBytes: function (sigBytes) {
                this._sigBytes = sigBytes;

                // Shortcuts
                var words = this.words;

                // Clear excess bits (necessary for Base64)
                words[sigBytes >>> 2] &= 0xFFFFFFFF << (32 - (sigBytes % 4) * 8);
                words.length = Math.ceil(sigBytes / 4);
            },

            concat: function (wordArray) {
                // Shortcuts
                var thisWords = this.words;
                var thatWords = wordArray.words;
                var thisSigBytes = this.getSigBytes();
                var thatSigBytes = wordArray.getSigBytes();

                for (var i = 0; i < thatSigBytes; i++) {
                    var bite = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
                    thisWords[thisSigBytes >>> 2] |= bite << (24 - (thisSigBytes % 4) * 8);
                    thisSigBytes++
                }
                this.setSigBytes(thisSigBytes);

                return this;
            },

            clone: function () {
                return new this.constructor(this.words.slice(0), this.getSigBytes());
            },

            _defaultEncoder: Hex,

            toString: function (encoder) {
                return (encoder || this._defaultEncoder).encode(this);
            },

            fromString: function (str, encoder) {
                return (encoder || this._defaultEncoder).decode(str);
            }
        });

        /* Encoding
        ------------------------------------------------------------ */
        var enc = C.enc = {};

        /* Encoding / Hex
        --------------------------------------------- */
        var Hex = enc.Hex = BaseObj.extend({
            encode: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.getSigBytes();

                var hexStr = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
                    hexStr.push((bite >>> 4).toString(16));
                    hexStr.push((bite & 0xF).toString(16));
                }

                return hexStr.join('');
            },

            decode: function (hexStr) {
                // Shortcuts
                var hexStrLength = hexStr.length;

                var words = [];
                for (var i = 0; i < hexStrLength; i += 2) {
                    words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                }

                return new WordArray(words, hexStrLength / 2);
            }
        });

        /* Encoding / ByteStr
        --------------------------------------------- */
        var ByteStr = enc.ByteStr = BaseObj.extend({
            encode: function (wordArray) {
                // Shortcuts
                var words = wordArray.words;
                var sigBytes = wordArray.getSigBytes();

                var byteStr = [];
                for (var i = 0; i < sigBytes; i++) {
                    var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xFF;
                    byteStr.push(String.fromCharCode(bite));
                }

                return byteStr.join('');
            },

            decode: function (byteStr) {
                // Shortcuts
                var byteStrLength = byteStr.length;

                var words = [];
                for (var i = 0; i < byteStrLength; i++) {
                    words[i >>> 2] |= byteStr.charCodeAt(i) << (24 - (i % 4) * 8);
                }

                return new WordArray(words, byteStrLength);
            }
        });

        /* Encoding / Utf8Str
        --------------------------------------------- */
        var Utf8Str = enc.Utf8Str = BaseObj.extend({
            encode: function (wordArray) {
                return decodeURIComponent(escape(ByteStr.encode(wordArray)));
            },

            decode: function (utf8Str) {
                return ByteStr.decode(unescape(encodeURIComponent(utf8Str)));
            }
        });
    })();
}
