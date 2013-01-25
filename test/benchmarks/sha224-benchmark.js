YUI.add('sha224-benchmark', function (Y) {
    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'SHA224',

        testBenchmark: function () {
            var suite = new Benchmark.Suite();

            suite.add('CryptoJS 4', function () {
                var hash = CryptoJS.SHA224.hash('abc') + '';
            });

            suite.add('CryptoJS 3', function () {
                var hash = Y.CryptoJS3.SHA224('abc') + '';
            });

            suite.add('jsSHA', function () {
                var hash = (new Y.JsSHA('abc', 'TEXT')).getHash('SHA-224', 'HEX') + '';
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
