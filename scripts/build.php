<?php

$copyrightInfo = '/**
 * Crypto-JS vX.X.X
 * http://code.google.com/p/crypto-js/
 * Copyright (c) 2009, Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */
';

$files = array('crypto', 'hex', 'base64',
               'md5', 'sha1', 'sha256',
               'hmac', 'pbkdf2',
               'marc4', 'rabbit', 'aes',
               'cbc', 'ofb');

$rollups = array(
	array('crypto', 'hex', 'md5'),
	array('crypto', 'hex', 'sha1'),
	array('crypto', 'hex', 'sha256'),
	array('crypto', 'hex', 'md5', 'hmac'),
	array('crypto', 'hex', 'sha1', 'hmac'),
	array('crypto', 'hex', 'sha256', 'hmac'),
	array('crypto', 'hex', 'sha1', 'hmac', 'pbkdf2'),
	array('crypto', 'base64', 'sha1', 'hmac', 'pbkdf2', 'marc4'),
	array('crypto', 'base64', 'sha1', 'hmac', 'pbkdf2', 'rabbit'),
	array('crypto', 'base64', 'sha1', 'hmac', 'pbkdf2', 'ofb', 'aes')
);

foreach ($files as $file) {
	echo "building file $file.js...\n";
	mkdir("../build/$file");
	$js = file_get_contents("../src/$file.js");
	file_put_contents("../build/$file/$file.js", $copyrightInfo . $js);
	file_put_contents("../build/$file/$file-min.js", $copyrightInfo . compress($js));
}

foreach ($rollups as $rollup) {
	$rollupName = implode("-", $rollup);
	echo "building rollup $rollupName.js...\n";
	mkdir("../build/$rollupName");
	$js = '';
	foreach ($rollup as $file) $js .= file_get_contents("../src/$file.js");
	file_put_contents("../build/$rollupName/$rollupName.js", $copyrightInfo . compress($js, true));
}

function compress($js, $advanced = NULL) {

	if ($advanced) {
		$cmd = 'java -jar ClosureCompiler.jar --compilation_level ADVANCED_OPTIMIZATIONS';
	} else {
		$cmd = 'java -jar ClosureCompiler.jar';
	}

	$descriptors = array(
		0 => array('pipe', 'r'),
		1 => array('pipe', 'w'),
		2 => array('pipe', 'w')
	);

	$process = proc_open($cmd, $descriptors, $pipes);
	if ($process === false) die();

	fwrite($pipes[0], $js);
	fclose($pipes[0]);

	$compressed = stream_get_contents($pipes[1]);
	fclose($pipes[1]);

	$errors = stream_get_contents($pipes[2]);
	fclose($pipes[2]);

	$exitStatus = proc_close($process);

	if ($exitStatus != 0 or $errors != '') die();

	return $compressed;

}
