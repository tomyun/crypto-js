YUI.add('lib-object-test', function (Y) {
    var O = CryptoJS.lib.Object;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'Object',

        _should: {
            error: {
                testExtendReservedProperty: true
            }
        },

        testCreate: function () {
            var superObj = {
                field: {}
            };
            var subObj = O.create(superObj);

            Y.Assert.areEqual(superObj.field, subObj.field);
            Y.Assert.isFalse(subObj.hasOwnProperty('field'));
        },

        testMixIn: function () {
            var receiver = {};
            var supplier = {
                field: {}
            };
            O.mixIn(receiver, supplier);

            Y.Assert.areEqual(supplier.field, receiver.field);
            Y.Assert.isTrue(receiver.hasOwnProperty('field'));
        },

        testMixInFilter: function () {
            var receiver = {};
            var supplier = {
                field: {}
            };
            O.mixIn(receiver, supplier, function (propertyName, propertyValue) {
                if (propertyName === 'field') {
                    return false;
                } else {
                    return true;
                }
            });

            Y.Assert.isFalse(receiver.hasOwnProperty('field'));
        },

        testMixInNonEnumerable: function () {
            var receiver = {};
            var supplier = {
                toString: function () {}
            };
            O.mixIn(receiver, supplier);

            Y.Assert.areEqual(supplier.toString, receiver.toString);
            Y.Assert.isTrue(receiver.hasOwnProperty('toString'));
        },

        testExtendReservedProperty: function () {
            O.extend({
                $static: {
                    $super: 'value'
                }
            });
        },

        testExtendConstructor: function () {
            var body = {
                constructor: function () {
                    this.initialized = true;
                }
            };
            var MyType = O.extend(body);
            var MySubType = MyType.extend();
            var instance = new MySubType();

            Y.Assert.areEqual(body.constructor, MyType)
            Y.Assert.isTrue(instance.initialized);
        },

        testExtendInheritProperties: function () {
            var MyType = O.extend();

            Y.Assert.areEqual(O.prototype.clone, MyType.prototype.clone);
            Y.Assert.isFalse(MyType.prototype.hasOwnProperty('clone'));
            Y.Assert.areEqual(O.create, MyType.create);
        },

        testExtendOwnProperties: function () {
            var body = {
                field: {},
                $static: {
                    field: {}
                }
            };
            var MyType = O.extend(body);

            Y.Assert.areEqual(body.field, MyType.prototype.field);
            Y.Assert.areEqual(body.$static.field, MyType.field);
            Y.Assert.areNotEqual(body.$static, MyType.prototype.$static);
        },

        testExtendSuper: function () {
            var MyType = O.extend();

            Y.Assert.areEqual(O, MyType.$super);
        },

        testClone: function () {
            var o1 = new O();
            o1.field = 'value';
            var o2 = o1.clone();

            Y.Assert.areNotEqual(o1, o2);
            Y.Assert.areEqual(o1.field, o2.field);

            o1.field = 'new_value';

            Y.Assert.areNotEqual(o1.field, o2.field);
        }
    }));
}, '$Rev$');
