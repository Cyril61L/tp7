
require('dotenv').config();

const main = require("../src/REST_TEMP/main");

console.log("Starting REST temperature service");

main.run();