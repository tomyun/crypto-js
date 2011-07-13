var CryptoJS;

// Private scope
(function (undefined) {
    // Don't overwrite
    if (CryptoJS) {
        return;
    }

    // CryptoJS namespace
    var C = CryptoJS = {};

    // Library namespace
    var C_lib = C.lib = {};

    // BaseObj
    var BaseObj = C_lib.BaseObj = {
        extend: function (overrides) {
            // Spawn
            function F() {}
            F.prototype = this;
            var subtype = new F();

            // Augment
            if (overrides) {
                for (var p in overrides) {
                    if (overrides.hasOwnProperty(p)) {
                        subtype[p] = overrides[p];
                    }
                }

                // IE won't copy toString using the loop above
                if (overrides.hasOwnProperty('toString')) {
                    subtype.toString = overrides.toString;
                }
            }

            // Reference supertype
            subtype.$super = this;

            return subtype;
        },

        create: function () {
            var instance = this.extend();
            instance.init.apply(instance, arguments);

            return instance;
        },

        init: function () {
            // Stub
        },

        clone: function () {
            return this.$super.extend(this);
        }
    };

    // Encoding namespace
    var C_enc = C.enc = {};

    // Hex
    var Hex = C_enc.Hex = BaseObj.extend({
        encode: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            var hexStr = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexStr.push((bite >>> 4).toString(16));
                hexStr.push((bite & 0xf).toString(16));
            }

            return hexStr.join('');
        },

        decode: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return WordArray_Hex.create(words, hexStrLength / 2);
        }
    });

    // Latin-1
    var Latin1 = C_enc.Latin1 = BaseObj.extend({
        encode: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            var latin1Str = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Str.push(String.fromCharCode(bite));
            }

            return latin1Str.join('');
        },

        decode: function (latin1Str) {
            // Shortcut
            var latin1StrStrLength = latin1Str.length;

            var words = [];
            for (var i = 0; i < latin1StrStrLength; i++) {
                words[i >>> 2] |= latin1Str.charCodeAt(i) << (24 - (i % 4) * 8);
            }

            return WordArray_Latin1.create(words, latin1StrStrLength);
        }
    });

    // Utf8
    var Utf8 = C_enc.Utf8 = BaseObj.extend({
        encode: function (wordArray) {
            return decodeURIComponent(escape(Latin1.encode(wordArray)));
        },

        decode: function (utf8Str) {
            return WordArray_Utf8.extend(Latin1.decode(unescape(encodeURIComponent(utf8Str))));
        }
    });

    // WordArray
    var WordArray = C_lib.WordArray = BaseObj.extend({
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes !== undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        toString: function (encoder) {
            return (encoder || this.encoder).encode(this);
        },

        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            for (var i = 0; i < thatSigBytes; i++) {
                var thatBite = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                thisWords[thisSigBytes >>> 2] |= thatBite << (24 - (thisSigBytes % 4) * 8);
                thisSigBytes++;
            }
            this.sigBytes = thisSigBytes;

            return this;
        },

        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        clone: function () {
            var clone = WordArray.$super.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        random: function (nWords) {
            var words = [];
            for ( ; nWords > 0; nWords--) {
                words.push(Math.floor(Math.random() * 0x100000000));
            }

            return this.create(words);
        }
    });

    // WordArray.Hex
    var WordArray_Hex = WordArray.Hex = WordArray.extend({
        encoder: Hex
    });

    // WordArray.Latin1
    var WordArray_Latin1 = WordArray.Latin1 = WordArray.extend({
        encoder: Latin1
    });

    // WordArray.Utf8
    var WordArray_Utf8 = WordArray.Utf8 = WordArray.extend({
        encoder: Utf8
    });

    // Event
    var Event = C_lib.Event = BaseObj.extend({
        init: function () {
            this.subscribers = [];
        },

        subscribe: function (callback) {
            this.subscribers.push(callback);
        },

        fire: function () {
            // Shortcuts
            var subscribers = this.subscribers;
            var subscribersLength = subscribers.length;

            // Execute callbacks
            for (var i = 0; i < subscribersLength; i++) {
                subscribers[i]();
            }
        }
    });
}());
