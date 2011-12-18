TestSuite.add(new YAHOO.tool.TestCase({

	test_MARC4: function () {

		// Test vectors
		Crypto.MARC4._marc4(message = [0,0,0,0,0,0,0,0], [0x01, 0x23, 0x45, 0x67, 0x89, 0xAB, 0xCD, 0xEF], 0);
		Assert.areEqual([0x74, 0x94, 0xC2, 0xE7, 0x10, 0x4B, 0x08, 0x79].toString(), message.toString());

		Crypto.MARC4._marc4(message = [0xDC, 0xEE, 0x4C, 0xF9, 0x2C], [0x61, 0x8A, 0x63, 0xD2, 0xFB], 0);
		Assert.areEqual([0xF1, 0x38, 0x29, 0xC9, 0xDE].toString(), message.toString());

		// Test D(E(m)) == m
		var key = Crypto.util.randomBytes(Math.floor(Math.random() * 256));
		Assert.areEqual(data, Crypto.MARC4.decrypt(Crypto.MARC4.encrypt(data, key), key));
		Assert.areEqual('Сообщение', Crypto.MARC4.decrypt(Crypto.MARC4.encrypt('Сообщение', 'Пароль'), 'Пароль'));

	}

}));
