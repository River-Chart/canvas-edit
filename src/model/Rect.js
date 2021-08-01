import Shape from "./Shape"

class Rect extends Shape {
    constructor(x, y){
        super()
        this.add({x, y})
        this.add({x, y: y + 100})
        this.add({x: x+100, y: y+100})
        this.add({x: x+100, y})
    }
}
export default Rect