// Implementation with axios
const axios = require('axios');
const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({
  description: 'Client parameters'
});

parser.add_argument('-l', '--login', { help: 'Login to use',required:true });
parser.add_argument('-p', '--password', { help: 'Password',required:true });
parser.add_argument('-t', '--to', { help: 'Destination',type:"int" ,required:true});
let login = parser.parse_args().login;
let password = parser.parse_args().password;
let destination = parser.parse_args().to;

let city = {0:"Angers",1:"Nantes",2:"Paris",3:"Bordeaux",4:"Marseille",5:"Lyon"}


var iter_data = 0;
var iter_ville =0;
/*
  action performed each 30 seconds
*/
function action(jwt) {
    iter_data++;
    iter_ville++;

    if(iter_ville>5)iter_ville = 0;


    axios.post("http://localhost:8000/pushdata",{jwt:jwt,
                                                 data:{temperature : getTemp(),city:city[iter_ville].toLowerCase(), Awithnumber:iter_data},
                                                 destination:destination})
}


/* Doing POST ... Imbricate them*/
axios.post("http://localhost:8000/login",{username: login,
                                          password: password}
          ).then(function(d) {
              var jwt = d.data.message;
              setInterval(() => {
                  action(jwt);
              },
                          1000);
          }).catch(function (error) {
              // handle error
              console.log("LOGIN ERROR",error);
          });


function getTemp()
{
    var d = new Date();
    var temp = d.getSeconds()/2;
    return temp
}