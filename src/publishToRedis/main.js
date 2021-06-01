require('dotenv').config();
const routingdb = require("../db/routingdb");
const { ArgumentParser } = require('argparse');

const redis = require("redis");
const IP = process.env.REDISIP || "127.0.0.1";
const password = process.env.REDISpassword || 'guest';

const client = redis.createClient({host:IP,password:password});

const redisQueue = "queue0";


function enterDataDB(msg)
{
    const data = JSON.parse(msg.content.toString())

    client.on("error", function(error) {
        console.error("ERROR",error);
    });

    client.set(data.city, data.temperature);
    client.get(data.city, (err,reply) => {
        console.log("Reply:",err,reply);
    });
}


function run() {

    var amqp = require('amqplib/callback_api');

    const IP = process.env.IP || "127.0.0.1";
    const username = process.env.user || 'guest';
    const password = process.env.password || 'guest';

    const opt = { credentials: require('amqplib').credentials.plain(username, password) };

    amqp.connect('amqp://'+IP, opt, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(redisQueue, {
                durable: true
            });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", );
            channel.consume(redisQueue, function(msg) {
                enterDataDB(msg);
                //console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            })
        });
    });

}



exports.run = run;