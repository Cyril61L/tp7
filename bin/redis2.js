require('dotenv').config();

const main = require("../src/publishToRedis/main");

console.log("Starting publishToRedis");

main.run();