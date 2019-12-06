var fs = require('fs');
//read file sync


//동기적
// console.log('A');
// var result = fs.readFileSync('sample.txt', 'utf8');
// console.log(result);
// console.log('C');

//비동기적
// console.log('A');
// fs.readFile('sample.txt', 'utf8', function(err, result){
//     console.log(result);
// });
// console.log('C');
