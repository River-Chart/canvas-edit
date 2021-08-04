import Toolbar from "./toolbar";
import { EventBus } from '../event'
import { selection } from './selection'

// 模式
// 1.选择模式 可以画出选区
// 2.单个移动模式 检测按下存在图形选择后移动图形
// 3.画布移动模式 按下移动画布
// 4.放置模式 放入图形

class Canvas {
  constructor(arg) {
    this.create(arg);
  }

  create({
    canvas = window.document.createElement("canvas"),
    container = window.document.body,
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
    container.addEventListener('wheel', e => {
      e.stopPropagation() 
      e.preventDefault()
    })

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

    page.layers.forEach((layer, i) => {
        layer.draw(ctx, page.zoom)
    });

    page.layers.forEach((layer, i) => {

        if(page.layerHoverId === i){
            layer.drawStroke(ctx, page.zoom)
        }
        if( page.layerSelect.includes(i) ){
            layer.drawStroke(ctx, page.zoom)
            layer.drawPoints(ctx, page.zoom)
        }
       
    });

  
    selection.draw(this)

    ctx.resetTransform()

    // console.log(page);
  }

  wheel(e) {
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

  mousedown(event){
    const { ctx, document } = this;
    const page = document.getActivePage();
    let x = (event.offsetX - page.position.x)
    let y = (event.offsetY  - page.position.y) 
    page.layerSelect = []
    page.layers.forEach((layer, i) => {
        if (ctx.isPointInPath(layer.getPath(page.zoom), x, y)){
            page.layerSelect = [i]
        }
    })
    this.draw()

    EventBus.dispatchEvent('mousedown', this, event)
  }

  mousemove(event){


    const { ctx, document } = this;
    const page = document.getActivePage();
    let x = (event.offsetX - page.position.x)
    let y = (event.offsetY  - page.position.y) 
    page.layerHoverId = null
    page.layers.forEach((layer, i) => {
        if (ctx.isPointInPath(layer.getPath(page.zoom), x, y)){
            page.layerHoverId = i
        }
    })
    this.draw()

    EventBus.dispatchEvent('mousemove', this, event)



  }

  mouseup(event){
    EventBus.dispatchEvent('mouseup', this, event)
  }

  keydown(event){
    EventBus.dispatchEvent('mouseup', this, event)
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
