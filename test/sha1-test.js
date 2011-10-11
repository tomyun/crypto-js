YUI.add('sha1-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'SHA1',

        testVector1: function () {
            var expected = 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

            var message = '';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector2: function () {
            var expected = '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8';

            var message = 'a';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector3: function () {
            var expected = 'a9993e364706816aba3e25717850c26c9cd0d89d';

            var message = 'abc';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector4: function () {
            var expected = 'c12252ceda8be8994d5fa0290a47231c1d16aae3';

            var message = 'message digest';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector5: function () {
            var expected = '32d10c7b8cf96570ca04ce37f2a19d84240d3a89';

            var message = 'abcdefghijklmnopqrstuvwxyz';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector6: function () {
            var expected = '761c457bf73b14d27e9e9265c46f4b4dda11f940';

            var message = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testVector7: function () {
            var expected = '50abf5706a150990a08b2c5ea40fa0e585554732';

            var message = '12345678901234567890123456789012345678901234567890123456789012345678901234567890';
            var actual = C.SHA1.compute(message);

            Y.Assert.areEqual(expected, actual);
        },

        testLongMessage: function () {
            var expected = '85e4c4b3933d5553ebf82090409a9d90226d845c';

            var sha1 = C.SHA1.create();
            for (var i = 0; i < 100; i++) {
                sha1.update('12345678901234567890123456789012345678901234567890');
            }
            var actual = sha1.compute();

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
