YUI.add('algo-rc4-profile', function (Y) {
    var C = CryptoJS;

    Y.Profiler.add({
        name: 'RC4',

        setUp: function () {
            this.data = { key: C.enc.Hex.parse('0123456789abcdef') };
        },

        profileSinglePartMessage: function () {
            var singlePartMessage = '';
            for (var i = 0; i < 500; i++) {
                singlePartMessage += '01234567890123456789012345678901234567890123456789';
            }

            C.RC4.encrypt(singlePartMessage, 'Jefe') + '';
        },

        profileMultiPartMessage: function () {
            var rc4 = C.algo.RC4.createEncryptor(this.data.key);
            for (var i = 0; i < 500; i++) {
                rc4.process('01234567890123456789012345678901234567890123456789') + '';
            }
            rc4.finalize() + '';
        }
    });
}, '$Rev$');
