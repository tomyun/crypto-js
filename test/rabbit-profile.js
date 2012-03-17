YUI.add('algo-rabbit-profile', function (Y) {
    var C = CryptoJS;

    Y.Profiler.add({
        name: 'Rabbit',

        setUp: function () {
            this.data = { key: C.enc.Hex.parse('00000000000000000000000000000000') };
        },

        profileSinglePartMessage: function () {
            var singlePartMessage = '';
            for (var i = 0; i < 500; i++) {
                singlePartMessage += '01234567890123456789012345678901234567890123456789';
            }

            C.Rabbit.encrypt(singlePartMessage, 'Jefe') + '';
        },

        profileMultiPartMessage: function () {
            var rabbit = C.algo.Rabbit.createEncryptor(this.data.key);
            for (var i = 0; i < 500; i++) {
                rabbit.process('01234567890123456789012345678901234567890123456789') + '';
            }
            rabbit.finalize() + '';
        }
    });
}, '$Rev$');
