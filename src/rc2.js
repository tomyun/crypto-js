(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var BlockCipher = C_lib.BlockCipher;
    var C_algo = C.algo;

    // an array of "random" bytes based on the digits of PI = 3.14159...
    var PITABLE = [
        0xd9, 0x78, 0xf9, 0xc4, 0x19, 0xdd, 0xb5, 0xed, 0x28, 0xe9, 0xfd, 0x79, 0x4a, 0xa0, 0xd8, 0x9d,
        0xc6, 0x7e, 0x37, 0x83, 0x2b, 0x76, 0x53, 0x8e, 0x62, 0x4c, 0x64, 0x88, 0x44, 0x8b, 0xfb, 0xa2,
        0x17, 0x9a, 0x59, 0xf5, 0x87, 0xb3, 0x4f, 0x13, 0x61, 0x45, 0x6d, 0x8d, 0x09, 0x81, 0x7d, 0x32,
        0xbd, 0x8f, 0x40, 0xeb, 0x86, 0xb7, 0x7b, 0x0b, 0xf0, 0x95, 0x21, 0x22, 0x5c, 0x6b, 0x4e, 0x82,
        0x54, 0xd6, 0x65, 0x93, 0xce, 0x60, 0xb2, 0x1c, 0x73, 0x56, 0xc0, 0x14, 0xa7, 0x8c, 0xf1, 0xdc,
        0x12, 0x75, 0xca, 0x1f, 0x3b, 0xbe, 0xe4, 0xd1, 0x42, 0x3d, 0xd4, 0x30, 0xa3, 0x3c, 0xb6, 0x26,
        0x6f, 0xbf, 0x0e, 0xda, 0x46, 0x69, 0x07, 0x57, 0x27, 0xf2, 0x1d, 0x9b, 0xbc, 0x94, 0x43, 0x03,
        0xf8, 0x11, 0xc7, 0xf6, 0x90, 0xef, 0x3e, 0xe7, 0x06, 0xc3, 0xd5, 0x2f, 0xc8, 0x66, 0x1e, 0xd7,
        0x08, 0xe8, 0xea, 0xde, 0x80, 0x52, 0xee, 0xf7, 0x84, 0xaa, 0x72, 0xac, 0x35, 0x4d, 0x6a, 0x2a,
        0x96, 0x1a, 0xd2, 0x71, 0x5a, 0x15, 0x49, 0x74, 0x4b, 0x9f, 0xd0, 0x5e, 0x04, 0x18, 0xa4, 0xec,
        0xc2, 0xe0, 0x41, 0x6e, 0x0f, 0x51, 0xcb, 0xcc, 0x24, 0x91, 0xaf, 0x50, 0xa1, 0xf4, 0x70, 0x39,
        0x99, 0x7c, 0x3a, 0x85, 0x23, 0xb8, 0xb4, 0x7a, 0xfc, 0x02, 0x36, 0x5b, 0x25, 0x55, 0x97, 0x31,
        0x2d, 0x5d, 0xfa, 0x98, 0xe3, 0x8a, 0x92, 0xae, 0x05, 0xdf, 0x29, 0x10, 0x67, 0x6c, 0xba, 0xc9,
        0xd3, 0x00, 0xe6, 0xcf, 0xe1, 0x9e, 0xa8, 0x2c, 0x63, 0x16, 0x01, 0x3f, 0x58, 0xe2, 0x89, 0xa9,
        0x0d, 0x38, 0x34, 0x1b, 0xab, 0x33, 0xff, 0xb0, 0xbb, 0x48, 0x0c, 0x5f, 0xb9, 0xb1, 0xcd, 0x2e,
        0xc5, 0xf3, 0xdb, 0x47, 0xe5, 0xa5, 0x9c, 0x77, 0x0a, 0xa6, 0x20, 0x68, 0xfe, 0x7f, 0xc1, 0xad
    ];

    function getUint8(B, i) {
        return B[i/4 | 0] >>> (8 * (3 - i%4)) & 0xff;
    }

    function getUint16(B, i) {
        return getUint8(B, 2*i) + 256 * getUint8(B, 2*i+1);
    }

    function setUint8(B, i, L) {
        var I = i/4 | 0,
            s = (8 * (3 - i%4));
        B[I] &= ~(0xff << s);
        B[I] += (L & 0xff) << s;
    }

    function setUint16(B, i, K) {
        setUint8(B, 2*i,    K & 0xff);
        setUint8(B, 2*i+1, (K & 0xff00) >> 8);
    }

    function mod(a, n) {
        return ((a % n) + n) % n;
    }

    function rol(K, s) {
        return (K << s | K >>> (16 - s)) & 0xffff;
    }

    function ror(K, s) {
        return (K >>> s | K << (16 - s)) & 0xffff;
    }

    function expand(key, bits) {
        var T  = Math.min(key.sigBytes, 128),
            T1 = bits,
            T8 = (T1+7) / 8 | 0,
            TM = 0xff % Math.pow(2, 8 + T1 - 8*T8);

        var L = new Uint8Array(128+1);
        for (var i = 0; i < T; i++) {
            L[i] = getUint8(key.words, i);
        }
        for (var i = T; i <= 127; i++) {
            L[i] = PITABLE[(L[i-1] + L[i-T]) % 256];
        }
        L[128-T8] = PITABLE[L[128-T8] & TM];
        for (var i = 127-T8; i >= 0; i--) {
            L[i] = PITABLE[L[i+1] ^ L[i+T8]];
        }
        L = new Uint8Array(L.subarray(0, 128));

        //HACK: couldn't import lib-typedarray.js on Safari
        function bytes2words(array) {
            var words = [];
            for (var i = 0; i < array.byteLength; i++) {
                words[i >>> 2] |= array[i] << (24 - (i % 4) * 8);
            }
            return words;
        }
        var dK = WordArray.create(bytes2words(L), L.byteLength),
        //var dK = WordArray.create(L),
            j = 0;
        return {
            reset: function (index) {
                j = index || 0;
                return this;
            },

            front: function () {
                return this.reset(0);
            },

            back: function () {
                return this.reset(dK.words.length*2 - 1);
            },

            rewind: function () {
                if (j >= dK.words.length*2) {
                    this.front();
                } else if (j < 0) {
                    this.back();
                }
                return this;
            },

            at: function (index) {
                return getUint16(dK.words, index);
            },

            next: function () {
                var sK = this.at(j++);
                this.rewind();
                return sK;
            },

            prev: function () {
                var sK = this.at(j--);
                this.rewind();
                return sK;
            }
        }
    }

    function round(B, K) {
        function R(i) {
            return getUint16(B, mod(i, 4));
        }

        function W(i, R) {
            setUint16(B, mod(i, 4), R);
        }

        function s(i) {
            return [1, 2, 3, 5][mod(i, 4)];
        }

        function mix(i, reverse) {
            if (reverse) {
                W(i, ror(R(i), s(i)));
                W(i, R(i) - K.prev() - (R(i-1) & R(i-2)) - (~R(i-1) & R(i-3)));
            } else {
                W(i, R(i) + K.next() + (R(i-1) & R(i-2)) + (~R(i-1) & R(i-3)));
                W(i, rol(R(i), s(i)));
            }
        }

        function mash(i, reverse) {
            if (reverse) {
                W(i, R(i) - K.at(R(i-1) & 63));
            } else {
                W(i, R(i) + K.at(R(i-1) & 63));
            }
        }

        function indices(reverse) {
            I = [0, 1, 2, 3];
            if (reverse) {
                I.reverse();
            }
            return I;
        }

        return {
            init: function (reverse) {
                this.reverse = reverse;
                this.indices = indices(reverse);
                return this;
            },

            encrypt: function () {
                return this.init(false);
            },

            decrypt: function () {
                return this.init(true);
            },

            mix: function (count) {
                for (var c = 0; c < count; c++) {
                    this.indices.forEach(function (i) {
                        mix(i, this.reverse);
                    }, this);
                }
                return this;
            },

            mash: function (count) {
                for (var c = 0; c < count; c++) {
                    this.indices.forEach(function (i) {
                        mash(i, this.reverse);
                    }, this);
                }
                return this;
            }
        }
    }

    /**
     * RC2 block cipher algorithm.
     */
    var RC2 = C_algo.RC2 = BlockCipher.extend({
        /**
         * Configuration options.
         *
         * @property {number} effectiveKeyBits The effective key size in bits. Default: 32 (0 - 1024)
         */
        cfg: BlockCipher.cfg.extend({
            effectiveKeyBits: 32
        }),

        _doReset: function () {
            // Key expansion stage
            this._expandedKey = expand(this._key, this.cfg.effectiveKeyBits);
        },

        encryptBlock: function (M, offset) {
            // Encryption stage
            var B = M.slice(offset, offset + 2),
                K = this._expandedKey.front();
            round(B, K).encrypt().mix(5).mash(1).mix(6).mash(1).mix(5);

            // Set output
            M.splice(offset, 2, B[0], B[1]);
        },

        decryptBlock: function (M, offset) {
            // Decryption stage
            var B = M.slice(offset, offset + 2),
                K = this._expandedKey.back();
            round(B, K).decrypt().mix(5).mash(1).mix(6).mash(1).mix(5);

            // Set output
            M.splice(offset, 2, B[0], B[1]);
        },

        keySize: 128/32,

        ivSize: 64/32,

        blockSize: 64/32
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.RC2.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.RC2.decrypt(message, key, cfg);
     */
    C.RC2 = BlockCipher._createHelper(RC2);
}());
