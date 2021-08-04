import Shape from "./Shape"

class Rect extends Shape {
    constructor(x, y, width, height){
        super(x, y, width, height)
        // this.add({x, y})
        // this.add({x, y: y + 100})
        // this.add({x: x+100, y: y+100})
        // this.add({x: x+100, y})

    }

    getPath(zoom){
        const {x, y, width, height } = this.frame
        const path = new Path2D();
        path.rect(x * zoom, y * zoom, width * zoom, height * zoom);
        return path
    }

    draw(ctx, zoom){
        const path = this.getPath(zoom)

        ctx.fillStyle = "#C4C4C4"
        ctx.fill(path);
    }

    drawStroke(ctx, zoom){
        const path = this.getPath(zoom)

        ctx.strokeSyle = "RGBA(79, 165, 242, 1.00)"
        ctx.stroke(path);
    }

    drawPoints(ctx){
        const {x, y, width, height } = this.frame
        const topLeft = [x, y]
        const topRight = [x + width, y]
        const bottomLeft = [x, y + height]
        const bottomRight = [x + width, y + height];
        [topLeft, topRight, bottomLeft, bottomRight].forEach(([x, y]) => {
            this.drawRectPont(ctx, x, y)
        });

    }

    drawRectPont(ctx, x, y){
        ctx.rect(x-2, y-2, 5, 5)
        ctx.fillStyle = "#fff"
        ctx.strokeSyle = "RGBA(79, 165, 242, 1.00)"
        ctx.stroke();
        ctx.fill();
    }
}
export default Rect