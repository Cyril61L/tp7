const express = require('express');
const bodyParser = require('body-parser');

const redis = require("redis");
const IP = process.env.REDISIP || "127.0.0.1";
const password = process.env.REDISpassword || 'guest';

const client = redis.createClient({host:IP,password:password});

const app = express();
const host = 'localhost'; // Utiliser 0.0.0.0 pour être visible depuis l'exterieur de la machine
const port = 8001;



function runExpress()
{
    app.get('/temp/*', (req, res) => {
        //console.log("GET 404", req.originalUrl);

        var key = req.params[0].toLowerCase();

        client.on("error", function(error) {
            console.error("ERROR",error);
        });

        client.get(key, (err,reply) => {
            console.log("Reply:",err,reply);
            console.log(JSON.stringify({temperature : reply}));

            if(reply !== null){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({temperature : reply}));
            }
            else{
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({error: "Pas de données pour cette ville"}))
            }
        });
    });

    app.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
}

function run()
{
    runExpress();
}

exports.run = run;