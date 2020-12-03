const myvar = require("./myvar.js");
const Myvar = require("./myvar.js");

const setVar = new Myvar();

// const express = require("./ex_1/node_modules/express");
// const uuid4 = require('./ex_1/node_modules/uuid4');

const express = require("express");
const uuid4 = require('uuid4');


console.log(myvar.vv);
console.log(setVar.name);
console.log(setVar.hello);

console.log(uuid4());