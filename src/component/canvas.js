import { ctx } from "../core";
import Toolbar from "./toolbar";

class Canvas {
  constructor(arg) {
    this.create(arg);
  }
  
  selection = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      visible: false
  }

  create({
    canvas = window.document.createElement("canvas"),
    container =  window.document.body,
    width = container.offsetWidth,
    height = container.offsetHeight,
    document,
  }) {
    this.document = document;
    this.container = container;
    this.canvas = canvas;

    this.ctx = canvas.getContext("2d");

    this.toolbar = new Toolbar(this)

    this.setSize(width, height);

    container.appendChild(canvas);

    window.addEventListener("resize", this.resize.bind(this));
    canvas.addEventListener("wheel", this.wheel.bind(this));
    canvas.addEventListener("mousedown", this.mousedown.bind(this));
    canvas.addEventListener("mousemove", this.mousemove.bind(this));
    canvas.addEventListener("mouseup", this.mouseup.bind(this));

  }

  draw() {
    const { document, ctx } = this;
    const page = document.getActivePage();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.setTransform(1,0,0,1, page.position.x , page.position.y );

    page.layers.forEach(layer => {
        
        ctx.fillStyle = 'RGBA(151, 98, 246, 1.00)';
        ctx.fillRect(0 * page.zoom, 0 * page.zoom, 100 * page.zoom, 100 * page.zoom);
        ctx.fillRect(20 * page.zoom, 200 * page.zoom, 100 * page.zoom, 100 * page.zoom);
        
    });
    this.drawSelection()

    ctx.resetTransform()

    // console.log(page);
  }

  drawSelection(){
    const { ctx, document, selection } = this;
    const page = document.getActivePage();
    
  
    ctx.lineWidth = 1
    ctx.strokeStyle = 'RGBA(71, 160, 244, 1)';
    ctx.fillStyle = 'RGBA(71, 160, 244, 0.2)';

    ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height)
  }

  wheel(e) {
    //   console.log('wheel',e)
    const { document } = this;
    const page = document.getActivePage();

    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        page.zoomIn(e.offsetX, e.offsetY);
      } else {
        page.zoomOut(e.offsetX, e.offsetY);
      }
      this.draw();
    } else {
      page.scroll(e.deltaX, e.deltaY);
      this.draw();
    }
  }

  mousedown(e){
    const { selection, document } = this
    const { position, zoom } = document.getActivePage();
    if(e.which === 1){
        selection.visible = true
        selection.offsetX_raw = e.offsetX
        selection.offsetY_raw = e.offsetY
        selection.x =  e.offsetX - position.x 
        selection.y =  e.offsetY - position.y 
    }
  }

  mousemove(e){
  
    const { selection, document } = this
    if(selection.visible){
        selection.width += ( e.offsetX - selection.offsetX_raw  )
        selection.height +=  ( e.offsetY - selection.offsetY_raw )

        selection.offsetX_raw = e.offsetX
        selection.offsetY_raw = e.offsetY
        this.draw()
    }


  }

  mouseup(e){
    this.selection = {
        x: 0,
        y: 0,
        height: 0,
        width: 0,
        visible: false
    }
    this.draw()
  }

  setSize(width, height) {
    const { canvas } = this;

    canvas.width = width;
    canvas.height = height;
    this.width = width;
    this.height = height;
  }

  resize() {
    const { container } = this;

    this.setSize(container.offsetWidth, container.offsetHeight);
    this.draw();
  }
}

export default Canvas;
