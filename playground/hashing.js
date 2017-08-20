const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 4
};

var token = jwt.sign(data, 'somescrete');
console.log(token);
var decoded = jwt.verify(token + '1', 'somescrete');
console.log('decoded ', decoded);


// var message = "I am user no. 3";
// var hash = SHA256(message).toString();

// console.log('message ', message);
// console.log('hash ', hash);



// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somescrete').toString() //
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somescrete').toString();

// if (resultHash === token.hash) {
//     console.log("Data was not changed");
// } else {
//     console.log("Data was changed");
// }