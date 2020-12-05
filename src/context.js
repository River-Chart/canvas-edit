
export class Context {
    static canvas = new Context;
    static ctx;

    constructor(canvas){
        this.canvas = canvas
        return this.getContext()
    }
    static getContext(){
        return this?.canvas.getContext('2d')
    }

}
