YUI.add('algo-aes-profile', function (Y) {
    var C = CryptoJS;

    Y.Profiler.add({
        name: 'AES',

        setUp: function () {
            this.data = {
                key: C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'),
                iv: C.enc.Hex.parse('000102030405060708090a0b0c0d0e0f')
            };
        },

        profileSinglePartMessage: function () {
            var singlePartMessage = '';
            for (var i = 0; i < 500; i++) {
                singlePartMessage += '01234567890123456789012345678901234567890123456789';
            }

            C.AES.encrypt(singlePartMessage, this.data.key, { iv: this.data.iv }) + '';
        },

        profileMultiPartMessage: function () {
            var aes = C.algo.AES.createEncryptor(this.data.key, { iv: this.data.iv });
            for (var i = 0; i < 500; i++) {
                aes.process('01234567890123456789012345678901234567890123456789') + '';
            }
            aes.finalize() + '';
        }
    });
}, '$Rev$');
