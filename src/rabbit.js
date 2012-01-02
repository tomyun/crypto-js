(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Cipher = C_lib.Cipher;
    var C_lib_Cipher_Stream = C_lib_Cipher.Stream;
    var C_algo = C.algo;

    // Private static inner state
    var x = [];
    var c = [], c_ = [];
    var b;
    var g = [];
    var s = [];

    /**
     * Rabbit stream cipher algorithm.
     */
    var C_algo_Rabbit = C_algo.Rabbit = C_lib_Cipher_Stream.extend({
        _doEncrypt: function (data, key, cfg) {
            // Shortcut
            var iv = cfg.iv;

            // Init
            keySetup(key.words);
            if (iv) {
                ivSetup(iv.words);
            }

            // Shortcuts
            var dataWords = data.words;
            var dataWordsLength = data.sigBytes / 4;

            // Encrypt each block
            for (var offset = 0; offset < dataWordsLength; offset += 4) {
                // Iterate the system
                nextState();

                // Generate four keystream words
                s[0] = x[0] ^ (x[5] >>> 16) ^ (x[3] << 16);
                s[1] = x[2] ^ (x[7] >>> 16) ^ (x[5] << 16);
                s[2] = x[4] ^ (x[1] >>> 16) ^ (x[7] << 16);
                s[3] = x[6] ^ (x[3] >>> 16) ^ (x[1] << 16);

                for (var i = 0; i < 4; i++) {
                    // Swap endian
                    s[i] = (((s[i] <<  8) | (s[i] >>> 24)) & 0x00ff00ff) |
                           (((s[i] << 24) | (s[i] >>>  8)) & 0xff00ff00);

                    // Encrypt
                    dataWords[offset + i] ^= s[i];
                }
            }
        },

        _ivSize: 64/32
    });

    function keySetup(k) {
        // Generate initial state values
        x[0] = k[0];
        x[2] = k[1];
        x[4] = k[2];
        x[6] = k[3];
        x[1] = (k[3] << 16) | (k[2] >>> 16);
        x[3] = (k[0] << 16) | (k[3] >>> 16);
        x[5] = (k[1] << 16) | (k[0] >>> 16);
        x[7] = (k[2] << 16) | (k[1] >>> 16);

        // Generate initial counter values
        c[0] = (k[2] << 16) | (k[2] >>> 16);
        c[2] = (k[3] << 16) | (k[3] >>> 16);
        c[4] = (k[0] << 16) | (k[0] >>> 16);
        c[6] = (k[1] << 16) | (k[1] >>> 16);
        c[1] = (k[0] & 0xffff0000) | (k[1] & 0x0000ffff);
        c[3] = (k[1] & 0xffff0000) | (k[2] & 0x0000ffff);
        c[5] = (k[2] & 0xffff0000) | (k[3] & 0x0000ffff);
        c[7] = (k[3] & 0xffff0000) | (k[0] & 0x0000ffff);

        // Clear carry bit
        b = 0;

        // Iterate the system four times
        for (var i = 0; i < 4; i++) {
            nextState();
        }

        // Modify the counters
        for (var i = 0; i < 8; i++) {
            c[i] ^= x[(i + 4) & 7];
        }
    }

    function ivSetup(iv) {
        // Generate four subvectors
        var i0 = (((iv[0] << 8) | (iv[0] >>> 24)) & 0x00ff00ff) | (((iv[0] << 24) | (iv[0] >>> 8)) & 0xff00ff00);
        var i2 = (((iv[1] << 8) | (iv[1] >>> 24)) & 0x00ff00ff) | (((iv[1] << 24) | (iv[1] >>> 8)) & 0xff00ff00);
        var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
        var i3 = (i2 <<  16) | (i0 & 0x0000ffff);

        // Modify counter values
        c[0] ^= i0;
        c[1] ^= i1;
        c[2] ^= i2;
        c[3] ^= i3;
        c[4] ^= i0;
        c[5] ^= i1;
        c[6] ^= i2;
        c[7] ^= i3;

        // Iterate the system four times
        for (var i = 0; i < 4; i++) {
            nextState();
        }
    }

    function nextState() {
        // Save old counter values
        for (var i = 0; i < 8; i++) {
            c_[i] = c[i];
        }

        // Calculate new counter values
        c[0] = (c[0] + 0x4d34d34d + b) | 0;
        c[1] = (c[1] + 0xd34d34d3 + ((c[0] >>> 0) < (c_[0] >>> 0) ? 1 : 0)) | 0;
        c[2] = (c[2] + 0x34d34d34 + ((c[1] >>> 0) < (c_[1] >>> 0) ? 1 : 0)) | 0;
        c[3] = (c[3] + 0x4d34d34d + ((c[2] >>> 0) < (c_[2] >>> 0) ? 1 : 0)) | 0;
        c[4] = (c[4] + 0xd34d34d3 + ((c[3] >>> 0) < (c_[3] >>> 0) ? 1 : 0)) | 0;
        c[5] = (c[5] + 0x34d34d34 + ((c[4] >>> 0) < (c_[4] >>> 0) ? 1 : 0)) | 0;
        c[6] = (c[6] + 0x4d34d34d + ((c[5] >>> 0) < (c_[5] >>> 0) ? 1 : 0)) | 0;
        c[7] = (c[7] + 0xd34d34d3 + ((c[6] >>> 0) < (c_[6] >>> 0) ? 1 : 0)) | 0;
        b = (c[7] >>> 0) < (c_[7] >>> 0) ? 1 : 0;

        // Calculate the g-values
        for (var i = 0; i < 8; i++) {
            var gx = (x[i] + c[i]) | 0;

            // Construct high and low argument for squaring
            var ga = gx & 0x0000ffff;
            var gb = gx >>> 16;

            // Calculate high and low result of squaring
            var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
            var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

            // High XOR low
            g[i] = gh ^ gl;
        }

        // Calculate new state values
        x[0] = g[0] + ((g[7] << 16) | (g[7] >>> 16)) + ((g[6] << 16) | (g[6] >>> 16));
        x[1] = g[1] + ((g[0] <<  8) | (g[0] >>> 24)) + g[7];
        x[2] = g[2] + ((g[1] << 16) | (g[1] >>> 16)) + ((g[0] << 16) | (g[0] >>> 16));
        x[3] = g[3] + ((g[2] <<  8) | (g[2] >>> 24)) + g[1];
        x[4] = g[4] + ((g[3] << 16) | (g[3] >>> 16)) + ((g[2] << 16) | (g[2] >>> 16));
        x[5] = g[5] + ((g[4] <<  8) | (g[4] >>> 24)) + g[3];
        x[6] = g[6] + ((g[5] << 16) | (g[5] >>> 16)) + ((g[4] << 16) | (g[4] >>> 16));
        x[7] = g[7] + ((g[6] <<  8) | (g[6] >>> 24)) + g[5];
    }

    // Helper
    C.Rabbit = C_lib_Cipher._createHelper(C_algo_Rabbit);
}());
