const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = "abc123!";

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// }); // 10 number of rounds

var hashedpwd = "$2a$10$EGMKMYdl6JGayU7xsRgWeOi14VPNuIvwFUAPgm0hmBByPZ0rWXMYW";
bcrypt.compare(password, hashedpwd, (err, res) => {
    console.log(res);
});

// var data = {
//     id: 4
// };

// var token = jwt.sign(data, 'somescrete');
// console.log(token);
// var decoded = jwt.verify(token + '1', 'somescrete');
// console.log('decoded ', decoded);


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