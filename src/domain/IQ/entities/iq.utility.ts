export function getBaseLog(y: number, x: number) {
    return Math.log(y) / Math.log(x);
  }

export function randomG(v: number=3){ 
    var r: number = 0;
    for(var i: number = v; i > 0; i --){
        r += Math.random();
    }
    return r / v;
}