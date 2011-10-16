YUI.add('rc4-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'RC4',

        testVector1: function () {
            var message = C.enc.Hex.fromString('0000000000000000');
            var key = C.enc.Hex.fromString('0123456789abcdef');
            var actual = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;

            Y.Assert.areEqual('7494c2e7104b0879', actual);
        },

        testVector2: function () {
            var message = C.enc.Hex.fromString('dcee4cf92c');
            var key = C.enc.Hex.fromString('618a63d2fb');
            var actual = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;

            Y.Assert.areEqual('f13829c9de', actual);
        },

        testDrop: function () {
            var key = C.enc.Hex.fromString('0123456789abcdef');

            var message = C.enc.Hex.fromString('00000000000000000000000000000000');
            var rawCiphertext = C.RC4.encrypt(message, key, { drop: 0 }).rawCiphertext;
            var expected = C.lib.WordArray.create(rawCiphertext.words.slice(2)).toString();

            var message = C.enc.Hex.fromString('0000000000000000');
            var actual = C.RC4.encrypt(message, key, { drop: 2 }).rawCiphertext;

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
