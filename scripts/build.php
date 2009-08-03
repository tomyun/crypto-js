<?php

$copyrightInfo = '/*!
 * Crypto-JS v1.0.0
 * http://code.google.com/p/crypto-js/
 * 
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
';

$packages = array(

	array('Crypto'),
	array('MD5'),
	array('SHA1'),
	array('SHA256'),
	array('MARC4'),
	array('Rabbit'),
	array('AES'),
	array('CBC'),
	array('OFB'),

	array('Crypto', 'MD5'),
	array('Crypto', 'SHA1'),
	array('Crypto', 'SHA256'),
	array('Crypto', 'SHA256', 'MARC4'),
	array('Crypto', 'MD5', 'Rabbit'),
	array('Crypto', 'SHA256', 'OFB', 'AES')

);

$cmd = 'java -jar yuicompressor-2.4.2.jar --type js';

$descriptors = array(
	0 => array('pipe', 'r'),
	1 => array('pipe', 'w'),
	2 => array('pipe', 'w')
);

foreach ($packages as $package) {

	$process = proc_open($cmd, $descriptors, $pipes);
	if ($process === false) die();

	fwrite($pipes[0], $copyrightInfo);

	foreach ($package as $file)
		fwrite($pipes[0], file_get_contents("../src/$file.js"));

	fclose($pipes[0]);

	$compressed = stream_get_contents($pipes[1]);
	fclose($pipes[1]);

	$errors = stream_get_contents($pipes[2]);
	fclose($pipes[2]);

	$status = proc_close($process);

	if ($status != 0 or $errors != '') die();

	file_put_contents("../build/" . implode("-", $package) . "-min.js", $compressed);

}
