let a = 10;
a = 20;
console.log(a);

(() => {
    let a = 10;
    console.log(a);
})();

(() => {
    let a = 100;
    console.log(a);
})();