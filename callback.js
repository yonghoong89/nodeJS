//선언식
// function a (){
//     console.log('A');
// }
//익명함수
// function(){
//     console.log('A');
// }
//표현식
var a = function(){
    console.log('A');
}
a();

function slowfunc(callback){
    callback();
}

slowfunc(a);
