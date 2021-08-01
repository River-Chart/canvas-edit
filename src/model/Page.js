const zoomRate = 0.02;
const scrollRate = 1;

class Page {
  style = {};
  name = "page";
  position = { x: 0, y: 0 };
  zoom = 1;
  layers = [];
  constructor() {}

  zoomIn(x, y) {
  
    const { position } = this;
    x /= this.zoom
    y /= this.zoom
    x += position.x
    y += position.y 

    let old_x = x * this.zoom
    let old_y = y * this.zoom 
    
    // x *= zoomRate
    // y *= zoomRate
  
    this.zoom *= 1 + zoomRate;

    x = x * this.zoom 
    y = y * this.zoom 

    
    // x *= zoomRate 
    // y *= zoomRate
    console.log({old_x, old_y})
    console.log(x - old_x, y - old_y)
    
    position.x -=(x - old_x) // this.zoom 
    position.y -=(y - old_y) // this.zoom 

  }

  zoomOut(x, y) {
    const { position, zoom } = this;
    x /= this.zoom
    y /= this.zoom
    x += position.x
    y += position.y 
    console.log(x)
    console.log(y)

    this.zoom *= 1 - zoomRate;

    x *= zoomRate 
    y *= zoomRate
    
    position.x +=( x / this.zoom)
    position.y +=( y / this.zoom)
  }

  scroll(x, y) {
    const { position, zoom } = this;
    position.x -= (x / zoom) * scrollRate;
    position.y -= (y / zoom) * scrollRate;
  }
}

export default Page;
