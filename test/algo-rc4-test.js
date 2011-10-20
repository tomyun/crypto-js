YUI.add('algo-rc4-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.RC4',

        testVector1: function () {
            var message = C.enc.Hex.fromString('0000000000000000');
            var key = C.enc.Hex.fromString('0123456789abcdef');
            var actual = C.algo.RC4.encrypt(message, key, { drop: 0 });

            Y.Assert.areEqual('7494c2e7104b0879', actual);
        },

        testVector2: function () {
            var message = C.enc.Hex.fromString('dcee4cf92c');
            var key = C.enc.Hex.fromString('618a63d2fb');
            var actual = C.algo.RC4.encrypt(message, key, { drop: 0 });

            Y.Assert.areEqual('f13829c9de', actual);
        },

        testDrop: function () {
            var key = C.enc.Hex.fromString('0123456789abcdef');

            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var ciphertext = C.algo.RC4.encrypt(message, key, { drop: 0 });
            var expected = C.lib.WordArray.create(ciphertext.words.slice(2)).toString();

            var message = C.enc.Hex.fromString('0000000000000000');
            var actual = C.algo.RC4.encrypt(message, key, { drop: 2 });

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
