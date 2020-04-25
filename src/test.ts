const test = require('ava');
import pwd from "./index"
console.log(pwd)

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});