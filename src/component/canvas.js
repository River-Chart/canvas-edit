import Toolbar from "./toolbar";
import { EventBus } from "../event";
import { selection } from "./selection";

// 模式
// 1.选择模式 可以画出选区
// 2.单个移动模式 检测按下存在图形选择后移动图形
// 3.画布移动模式 按下移动画布
// 4.放置模式 放入图形

function isPointRect(x, y, rect) {
  return (
    x >= rect.x &&
    y >= rect.y &&
    x <= rect.x + rect.width &&
    y <= rect.y + rect.height
  );
}


function calcFrame({ x, y, width, height }) {
    const topLeft = [x, y];
    const topRight = [x + width, y];
    const bottomLeft = [x, y + height];
    const bottomRight = [x + width, y + height];
    return [topLeft, topRight, bottomLeft, bottomRight];
  }

class Canvas {
  constructor(arg) {
    this.create(arg);
  }

  mode = "select"; // select

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

    this.toolbar = new Toolbar(this);

    this.setSize(width, height);

    container.appendChild(canvas);
    container.addEventListener("wheel", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });

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
    ctx.setTransform(1, 0, 0, 1, page.position.x, page.position.y);

    page.layers.forEach((layer, i) => {
      layer.draw(ctx, page.zoom);
    });

    page.layers.forEach((layer, i) => {
      if (page.layerHoverId === i) {
        layer.drawStroke(ctx, page.zoom);
      }
      if (page.layerSelect.includes(i)) {
          this.drawSelect()
        // layer.drawStroke(ctx, page.zoom);
        // layer.drawPoints(ctx, page.zoom)
      }
    });

    selection.draw(this);

    ctx.resetTransform();

    // console.log(page);
  }

  drawSelect() {
    const { document, ctx } = this;
    const { zoom } = document.getActivePage();
    const selectFrame = this.getlayerSelectFrame(zoom)
    const path = new Path2D();
    path.rect(selectFrame.x, selectFrame.y, selectFrame.width, selectFrame.height);
    ctx.strokeSyle = "RGBA(79, 165, 242, 1.00)";
    ctx.stroke(path);

    calcFrame(selectFrame).forEach(([x, y]) => {
      this.drawRectPont(ctx, x , y );
    });
  }

  drawRectPont(ctx, x, y) {
    const path = new Path2D();
    path.rect(x - 2, y - 2, 5, 5);
    ctx.fillStyle = "#fff";
    ctx.strokeSyle = "RGBA(79, 165, 242, 1.00)";
    ctx.stroke(path);
    ctx.fill(path);
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

  mousedown(event) {
    const { ctx, document } = this;
    const page = document.getActivePage();
    let x = event.offsetX - page.position.x;
    let y = event.offsetY - page.position.y;

    if (!this.isPointlayerSelectFrame(x, y)) {
      page.layerSelect = [];
      page.layers.forEach((layer, i) => {
        if (ctx.isPointInPath(layer.getPath(page.zoom), x, y)) {
          page.layerSelect = [i];
        }
      });
    }

    if (page.layerSelect.length) {
      this.draw();
      EventBus.dispatchEvent("selectDown", this, event);
    } else {
      EventBus.dispatchEvent("selectionDown", this, event);
    }
  }

  mousemove(event) {
    const { ctx, document } = this;
    const page = document.getActivePage();
    let x = event.offsetX - page.position.x;
    let y = event.offsetY - page.position.y;
    page.layerHoverId = null;
    page.layers.forEach((layer, i) => {
      if (ctx.isPointInPath(layer.getPath(page.zoom), x, y)) {
        page.layerHoverId = i;
      }
    });
    this.draw();

    EventBus.dispatchEvent("mousemove", this, event);
  }

  mouseup(event) {
    EventBus.dispatchEvent("mouseup", this, event);
  }

  keydown(event) {
    EventBus.dispatchEvent("mouseup", this, event);
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

  isPointlayerSelectFrame(x, y) {
    const { document } = this;
    const page = document.getActivePage();
    const rect = this.getlayerSelectFrame(page.zoom);

    if (!rect) return false;

    return isPointRect(x, y, rect);
  }

  getlayerSelectFrame(zoom = 1) {
    const { ctx, document } = this;
    const page = document.getActivePage();
    if (page.layerSelect.length) {
      const min = [Number.MAX_VALUE, Number.MAX_VALUE];
      const max = [Number.MIN_VALUE, Number.MIN_VALUE];
      page.layerSelect
        .map((i) => page.layers[i].points)
        .flat(1)
        .forEach(([x, y]) => {
          if (min[0] > x) min[0] = x;
          if (max[0] < x) max[0] = x;
          if (min[1] > y) min[1] = y;
          if (max[1] < y) max[1] = y;
        });

      return {
        x: min[0] * zoom,
        y: min[1] * zoom,
        width: (max[0] - min[0]) * zoom,
        height: (max[1] - min[1]) * zoom,
      };
    }
    return;
  }
}

export default Canvas;
