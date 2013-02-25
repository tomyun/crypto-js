YUI.add('enc-hex-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Hex',

        testStringifyBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', (function () {
                var wordArray = CryptoJS.enc.Hex.parse('6162636461626364');

                return function () {
                    CryptoJS.enc.Hex.stringify(wordArray);
                };
            }()));

            suite.add('CryptoJS 3', (function () {
                var wordArray = Y.CryptoJS3.enc.Hex.parse('6162636461626364');

                return function () {
                    Y.CryptoJS3.enc.Hex.stringify(wordArray);
                }
            }()));

            suite.add('CryptoJS 2', (function () {
                var wordArray = Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.util.hexToBytes('6162636461626364'));

                return function () {
                    Y.CryptoJS2.util.bytesToHex(Y.CryptoJS2.util.wordsToBytes(wordArray));
                };
            }()));

            suite.add('sjcl', (function () {
                var bitArray = Y.Sjcl.codec.hex.toBits('6162636461626364');

                return function () {
                    Y.Sjcl.codec.hex.fromBits(bitArray);
                };
            }()));

            suite.add('Forge', (function () {
                var byteBuffer = Y.Forge.util.createBuffer(Y.Forge.util.hexToBytes('6162636461626364'));

                return function () {
                    byteBuffer.toHex();
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
                CryptoJS.enc.Hex.parse('6162636461626364');
            });

            suite.add('CryptoJS 3', function () {
                Y.CryptoJS3.enc.Hex.parse('6162636461626364');
            });

            suite.add('CryptoJS 2', function () {
                Y.CryptoJS2.util.bytesToWords(Y.CryptoJS2.util.hexToBytes('6162636461626364'));
            });

            suite.add('sjcl', function () {
                Y.Sjcl.codec.hex.toBits('6162636461626364');
            });

            suite.add('Forge', function () {
                Y.Forge.util.createBuffer(Y.Forge.util.hexToBytes('6162636461626364'));
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
