YUI.add('hash-base-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'hash.Base',

        testUpdate: function () {
            var expected = C.MD5.compute('12345678901234567890123456789012345678901234567890123456789012345678901234567890').toString();

            var md5 = C.MD5.create();
            md5.update('1234567890123456789012345678901234567890');
            md5.update('12345678901234567890');
            var actual = md5.compute('12345678901234567890');

            Y.Assert.areEqual(expected, actual);
        },

        testInputIntegrity: function () {
            var message = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var expected = message.toString();

            C.MD5.compute(message);

            Y.Assert.areEqual(expected, message);
        }
    }));
}, '$Rev$');
