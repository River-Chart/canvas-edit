const zoomRate = 0.04;
const scrollRate = 1;

class Page {
  style = {};
  name = "page";
  position = { x: 0, y: 0 };
  zoom = 1;
  layers = [];
  layerHoverId = null;
  layerSelect = [];

  constructor() {}

  zoomIn(x, y) {
    const { position } = this;

    this.zoom *= 1 + zoomRate;

    x -= position.x 
    y -= position.y 

    position.x -= x * zoomRate
    position.y -=  y * zoomRate
  }

  zoomOut(x, y) {
    const { position } = this;

    this.zoom *= 1 - zoomRate;

    x -= position.x 
    y -= position.y 

    position.x += x * zoomRate
    position.y +=  y * zoomRate
 
  }

  scroll(x, y) {
    const { position, zoom } = this;
    position.x -= (x ) * scrollRate;
    position.y -= (y ) * scrollRate;
  }




}

export default Page;
