TestSuite.add(new YAHOO.tool.TestCase({

	test_u32: function(){
		Assert.areEqual(2147483647, Crypto.util.u32(2147483647));
		Assert.areEqual(2147483646, Crypto.util.u32(2147483646));
		Assert.areEqual(2, Crypto.util.u32(2));
		Assert.areEqual(1, Crypto.util.u32(1));
		Assert.areEqual(0, Crypto.util.u32(0));
		Assert.areEqual(4294967295, Crypto.util.u32(-1));
		Assert.areEqual(4294967294, Crypto.util.u32(-2));
		Assert.areEqual(2147483649, Crypto.util.u32(-2147483647));
		Assert.areEqual(2147483648, Crypto.util.u32(-2147483648));
	},

	test_add: function(){
		Assert.areEqual(0, Crypto.util.add(4294967295, 1));
		Assert.areEqual(2147483648, Crypto.util.add(2147483647, 1));
		Assert.areEqual(2147483647, Crypto.util.add(4294967295, 2147483647, 1));
	},

	test_mult: function(){
		Assert.areEqual(1, Crypto.util.mult(4294967295, 4294967295));
		Assert.areEqual(0, Crypto.util.mult(2147483648, 2147483648));
		Assert.areEqual(3817748708, Crypto.util.mult(2863311530, 2863311530));
	},

	test_gt: function(){
		Assert.isTrue(Crypto.util.gt(-1, 1));
	},

	test_lt: function(){
		Assert.isTrue(Crypto.util.lt(1, -1));
	},

	test_rotl: function(){
		Assert.areEqual(16711850, Crypto.util.rotl(2852192000, 8));
	},

	test_rotr: function(){
		Assert.areEqual(11141375, Crypto.util.rotr(2852192000, 8));
	},

	test_endian: function(){
		Assert.areEqual(4041261184|0, Crypto.util.endian(2160124144));
		Assert.areEqual(2160124144|0, Crypto.util.endian(Crypto.util.endian(2160124144)));
	},

	test_randomBytes: function(){
		Assert.areEqual(32, Crypto.util.randomBytes(32).length);
		Assert.areNotEqual(Crypto.util.randomBytes(32).toString(), Crypto.util.randomBytes(32).toString());
	},

	test_stringToBytes: function(){
		Assert.areEqual([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21].toString(), Crypto.charenc.Binary.stringToBytes("Hello, World!").toString());
		Assert.areEqual([0x41, 0xE2, 0x89, 0xA2, 0xCE, 0x91, 0x2E].toString(), Crypto.charenc.UTF8.stringToBytes("\u0041\u2262\u0391\u002E").toString());
		Assert.areEqual([0xED, 0x95, 0x9C, 0xEA, 0xB5, 0xAD, 0xEC, 0x96, 0xB4].toString(), Crypto.charenc.UTF8.stringToBytes("\uD55C\uAD6D\uC5B4").toString());
		Assert.areEqual([0xE6, 0x97, 0xA5, 0xE6, 0x9C, 0xAC, 0xE8, 0xAA, 0x9E].toString(), Crypto.charenc.UTF8.stringToBytes("\u65E5\u672C\u8A9E").toString());
	},

	test_bytesToString: function(){
		Assert.areEqual("Hello, World!", Crypto.charenc.Binary.bytesToString([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21]));
		Assert.areEqual("\u0041\u2262\u0391\u002E", Crypto.charenc.UTF8.bytesToString([0x41, 0xE2, 0x89, 0xA2, 0xCE, 0x91, 0x2E]));
		Assert.areEqual("\uD55C\uAD6D\uC5B4", Crypto.charenc.UTF8.bytesToString([0xED, 0x95, 0x9C, 0xEA, 0xB5, 0xAD, 0xEC, 0x96, 0xB4]));
		Assert.areEqual("\u65E5\u672C\u8A9E", Crypto.charenc.UTF8.bytesToString([0xE6, 0x97, 0xA5, 0xE6, 0x9C, 0xAC, 0xE8, 0xAA, 0x9E]));
	},

	test_bytesToWords: function(){
		Assert.areEqual([0x48656C6C, 0x6F2C2057, 0x6F726C64, 0x21000000].toString(), Crypto.util.bytesToWords([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21]).toString());
	},

	test_wordsToBytes: function(){
		Assert.areEqual([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21, 0x00, 0x00, 0x00].toString(), Crypto.util.wordsToBytes([0x48656C6C, 0x6F2C2057, 0x6F726C64, 0x21000000]).toString());
	},

	test_bytesToHex: function(){
		Assert.areEqual("48656c6c6f2c20576f726c6421", Crypto.util.bytesToHex([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21]));
	},

	test_hexToBytes: function(){
		Assert.areEqual([0x48, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x57, 0x6F, 0x72, 0x6C, 0x64, 0x21].toString(), Crypto.util.hexToBytes("48656c6c6f2c20576f726c6421"));
	},

	test_bytesToBase64: function(){
		Assert.areEqual("FPucA9l+", Crypto.util.bytesToBase64([0x14, 0xFB, 0x9C, 0x03, 0xD9, 0x7E]));
		Assert.areEqual("FPucA9k=", Crypto.util.bytesToBase64([0x14, 0xFB, 0x9C, 0x03, 0xD9]));
		Assert.areEqual("FPucAw==", Crypto.util.bytesToBase64([0x14, 0xFB, 0x9C, 0x03]));
	},

	test_base64ToBytes: function(){
		Assert.areEqual([0x14, 0xFB, 0x9C, 0x03, 0xD9, 0x7E].toString(), Crypto.util.base64ToBytes("FPucA9l+"));
		Assert.areEqual([0x14, 0xFB, 0x9C, 0x03, 0xD9].toString(), Crypto.util.base64ToBytes("FPucA9k="));
		Assert.areEqual([0x14, 0xFB, 0x9C, 0x03].toString(), Crypto.util.base64ToBytes("FPucAw=="));
	}

}));
