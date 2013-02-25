YUI.add('enc-utf8-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Utf8',

        testStringifyBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', (function () {
                var wordArray = CryptoJS.enc.Utf8.parse('$$$$¢¢€€𤭢');

                return function () {
                    CryptoJS.enc.Utf8.stringify(wordArray);
                };
            }()));

            suite.add('CryptoJS 3', (function () {
                var wordArray = Y.CryptoJS3.enc.Utf8.parse('$$$$¢¢€€𤭢');

                return function () {
                    Y.CryptoJS3.enc.Utf8.stringify(wordArray);
                }
            }()));

            suite.add('CryptoJS 2', (function () {
                var wordArray = Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.charenc.UTF8.stringToBytes('$$$$¢¢€€𤭢'));

                return function () {
                    Y.CryptoJS2.charenc.UTF8.bytesToString(Y.CryptoJS2.util.wordsToBytes(wordArray));
                };
            }()));

            suite.add('sjcl', (function () {
                var bitArray = Y.Sjcl.codec.utf8String.toBits('$$$$¢¢€€𤭢');

                return function () {
                    Y.Sjcl.codec.utf8String.fromBits(bitArray);
                };
            }()));

            suite.add('Forge', (function () {
                var byteBuffer = Y.Forge.util.createBuffer('$$$$¢¢€€𤭢', 'utf8');

                return function () {
                    byteBuffer.toString();
                };
            }()));

            suite.on('cycle', function (e) {
                Y.log(e.target, 'info', 'TestRunner');
            });

            suite.on('complete', (function (testCase) {
                return function () {
                    testCase.resume(function () {
                        Y.Assert.areEqual('CryptoJS 4', suite.filter('fastest').pluck('name'));
                    });
                }
            }(this)));

            suite.run({ async: true });

            this.wait(1000000);
        },

        testParseBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                CryptoJS.enc.Hex.parse('$$$$¢¢€€𤭢');
            });

            suite.add('CryptoJS 3', function () {
                Y.CryptoJS3.enc.Hex.parse('$$$$¢¢€€𤭢');
            });

            suite.add('CryptoJS 2', function () {
                Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.charenc.UTF8.stringToBytes('$$$$¢¢€€𤭢'));
            });

            suite.add('sjcl', function () {
                Y.Sjcl.codec.utf8String.toBits('$$$$¢¢€€𤭢');
            });

            suite.add('Forge', function () {
                Y.Forge.util.createBuffer('$$$$¢¢€€𤭢', 'utf8');
            });

            suite.on('cycle', function (e) {
                Y.log(e.target, 'info', 'TestRunner');
            });

            suite.on('complete', (function (testCase) {
                return function () {
                    testCase.resume(function () {
                        Y.Assert.areEqual('CryptoJS 4', suite.filter('fastest').pluck('name'));
                    });
                }
            }(this)));

            suite.run({ async: true });

            this.wait(1000000);
        }
    }));
}, '$Rev$');
