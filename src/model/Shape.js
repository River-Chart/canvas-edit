class Rectangle {
    constrainProportions = false
    constructor(x = 0, y = 0, width = 0, height = 0){
        this.x = x
        this.y = y
        this.width = width
        this.height= height
    }
}


class Style {
    
}


class Shape {
    points = []

    constructor(x, y, width, height){
        this.frame = new Rectangle(x, y, width, height)
    }

    add(point){
       this.points.push(point) 
    }

}
export default Shape