import { EventBus } from "../event";
import { bindClass } from "../utils";

function isIntersect(RectA, RectB) {
  return !(
    RectB.x + RectB.width < RectA.x ||
    RectB.x > RectA.x + RectA.width ||
    RectB.y + RectB.height < RectA.y ||
    RectB.y > RectA.y + RectA.height
  );
}

class Selection {
  constructor() {
    bindClass(this, [
      "mousedown",
      "mousemove",
      "mouseup",
      "draw",
      "selectDown",
    ]);

    EventBus.addEventListener("selectionDown", this.mousedown);
    EventBus.addEventListener("selectDown", this.selectDown);
  }

  selection = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    visible: false,
  };

  selectDown(canvas, event) {
    const { document } = canvas;
    const page = document.getActivePage();

    if (event.which === 1) {
      let prex = event.offsetX;
      let prey = event.offsetY;

      function selectMove(canvas, event) {
        let x = event.offsetX - prex;
        let y = event.offsetY - prey;
        prex = event.offsetX;
        prey = event.offsetY;
        page.getlayerSelect().forEach((layer) => {
          layer.frame.x += x / page.zoom;
          layer.frame.y += y / page.zoom;
          layer.calc();
        });
      }

      function selectUp(canvas, event) {
        canvas.draw();

        EventBus.removeEventListener("mousemove", selectMove);
        EventBus.removeEventListener("mouseup", selectUp);
      }

      EventBus.addEventListener("mousemove", selectMove);
      EventBus.addEventListener("mouseup", selectUp);
      canvas.canvas.addEventListener("mouseout", selectUp);
    }
  }

  mousedown(canvas, event) {
    const { selection } = this;
    const { document } = canvas;
    const { position } = document.getActivePage();
    if (event.which === 1) {
      selection.visible = true;
      selection.offsetX_raw = event.offsetX;
      selection.offsetY_raw = event.offsetY;
      selection.x = event.offsetX - position.x;
      selection.y = event.offsetY - position.y;

      EventBus.addEventListener("mousemove", this.mousemove);
      EventBus.addEventListener("mouseup", this.mouseup);
    }
  }

  mousemove(canvas, event) {
    const { selection } = this;
    const { ctx, document } = canvas;
    const page = document.getActivePage();
    if (selection.visible) {
      selection.width += event.offsetX - selection.offsetX_raw;
      selection.height += event.offsetY - selection.offsetY_raw;
      selection.offsetX_raw = event.offsetX;
      selection.offsetY_raw = event.offsetY;

      page.layerSelect = [];
      page.layers.forEach((layer, i) => {
        if (isIntersect(this.getRect(page), layer.frame)) {
          page.layerSelect.push(i);
        }
      });

      canvas.draw();
    }
  }

  mouseup(canvas) {
    this.selection = {
      x: 0,
      y: 0,
      height: 0,
      width: 0,
      visible: false,
    };
    canvas.draw();

    EventBus.removeEventListener("mousemove", this.mousemove);
    EventBus.removeEventListener("mouseup", this.mouseup);
  }

  draw(canvas) {
    const { selection } = this;
    const { ctx, document } = canvas;
    const page = document.getActivePage();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "RGBA(71, 160, 244, 1)";
    ctx.fillStyle = "RGBA(71, 160, 244, 0.2)";

    ctx.fillRect(selection.x, selection.y, selection.width, selection.height);
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
  }

  getRect({ zoom }) {
    const { selection } = this;
    const rect = { ...selection };
    if (rect.width < 0) {
      rect.x += rect.width;
      rect.width = -rect.width;
    }
    if (rect.height < 0) {
      rect.y += rect.height;
      rect.height = -rect.height;
    }
    rect.x /= zoom;
    rect.y /= zoom;
    rect.width /= zoom;
    rect.height /= zoom;
    return rect;
  }
}

export const selection = new Selection();

export default selection;
