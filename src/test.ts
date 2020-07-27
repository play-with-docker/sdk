const test = require("ava");
// import pwd from "./";
/* Pending: until modularize the core and can test each module
 without xterm dependency
*/

test("foo", (t) => {
  t.pass();
});

test("bar", async (t) => {
  const bar = Promise.resolve("bar");
  t.is(await bar, "bar");
});
