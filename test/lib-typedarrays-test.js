if (typeof ArrayBuffer !== 'undefined') {
    YUI.add('lib-typedarrays-test', function (Y) {
        var C = CryptoJS;

        Y.Test.Runner.add(new Y.Test.Case({
            name: 'TypedArrays',

            setUp: function () {
                this.data = {};

                this.data.buffer = new ArrayBuffer(8);

                var uint8View = this.data.uint8View = new Uint8Array(this.data.buffer);
                uint8View[0] = 0x01;
                uint8View[1] = 0x23;
                uint8View[2] = 0x45;
                uint8View[3] = 0x67;
                uint8View[4] = 0x89;
                uint8View[5] = 0xab;
                uint8View[6] = 0xcd;
                uint8View[7] = 0xef;
            },

            testInt8Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Int8Array(this.data.buffer)).toString());
            },

            testUint8Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Uint8Array(this.data.buffer)).toString());
            },

            testUint8ClampedArray: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Uint8ClampedArray(this.data.buffer)).toString());
            },

            testInt16Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Int16Array(this.data.buffer)).toString());
            },

            testUint16Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Uint16Array(this.data.buffer)).toString());
            },

            testInt32Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Int32Array(this.data.buffer)).toString());
            },

            testUint32Array: function () {
                Y.Assert.areEqual('0123456789abcdef', C.lib.WordArray.create(new Uint32Array(this.data.buffer)).toString());
            },

            testPartialView: function () {
                Y.Assert.areEqual('456789ab', C.lib.WordArray.create(new Int16Array(this.data.buffer, 2, 2)).toString());
            },

            testToArrayBuffer: function () {
                var arrayBuffer = C.enc.Hex.parse('0123456789abcdef').toArrayBuffer();
                var uint8View = new Uint8Array(arrayBuffer);

                Y.Assert.areEqual(0x01, uint8View[0]);
                Y.Assert.areEqual(0x23, uint8View[1]);
                Y.Assert.areEqual(0x45, uint8View[2]);
                Y.Assert.areEqual(0x67, uint8View[3]);
                Y.Assert.areEqual(0x89, uint8View[4]);
                Y.Assert.areEqual(0xab, uint8View[5]);
                Y.Assert.areEqual(0xcd, uint8View[6]);
                Y.Assert.areEqual(0xef, uint8View[7]);
            },

            testHasherAcceptTypedArray: function () {
                Y.Assert.areEqual(C.MD5(C.enc.Hex.parse('0123456789abcdef')).toString(), C.MD5(this.data.uint8View).toString());
            }
        }));
    }, '$Rev$');
}
