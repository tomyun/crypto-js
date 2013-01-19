YUI.add('sha512-test', function (Y) {
    var SHA512 = CryptoJS.SHA512;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA512',

        _should: {
            ignore: {
                // This test will hash 768MB of data; it takes a while.
                // So it's disabled by default, but can be switched on at any time.
                testUpdateAndLongMessage: true
            }
        },

        testVector1: function () {
            Y.Assert.areEqual(
                'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce' +
                '47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
                SHA512.hash('').toString()
            );
        },

        testVector2: function () {
            Y.Assert.areEqual(
                '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb64' +
                '2e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6',
                SHA512.hash('The quick brown fox jumps over the lazy dog').toString()
            );
        },

        testVector3: function () {
            Y.Assert.areEqual(
                '91ea1245f20d46ae9a037a989f54f1f790f0a47607eeb8a14d12890cea77a1bb' +
                'c6c7ed9cf205e67b7f2b8fd4c7dfd3a7a8617e45f3c463d481c7e586c39ac1ed',
                SHA512.hash('The quick brown fox jumps over the lazy dog.').toString()
            );
        },

        testUpdateAndLongMessage: function () {
            var sha512 = new SHA512();
            for (var i = 0; i < 768 * 1024 * 1024 / 32; i++) {
                sha512.update('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');
            }

            Y.Assert.areEqual(
                'e4472b07852a20f929382adb7b617115dba17b9fa59f09322d4d208947d0e5c0' +
                'b72c4b1d3e6be635b188752e8471f6da6504c016df98404032627bae9b211bb9',
                sha512.finalize().toString()
            );
        },

        testClone: function () {
            var sha512 = new SHA512();

            Y.Assert.areEqual(SHA512.hash('a').toString(), sha512.update('a').clone().finalize().toString());
            Y.Assert.areEqual(SHA512.hash('ab').toString(), sha512.update('b').clone().finalize().toString());
            Y.Assert.areEqual(SHA512.hash('abc').toString(), sha512.update('c').clone().finalize().toString());
        },

        testInputIntegrity: function () {
            var message = new CryptoJS.lib.WordArray([0x12345678]);
            var expected = message.toString();
            SHA512.hash(message);

            Y.Assert.areEqual(expected, message.toString());
        }
    }));
}, '$Rev$');
