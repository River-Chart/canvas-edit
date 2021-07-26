import { ctx, core,canvas } from './core'
import  * as utils  from './utils'

export class Shape {
  position = {
    x: 0,
    y: 0,
  };
  path = {
    points: [],
    closed: false,
    draw_type: "default",
  };
  style = {
    fill: "#444444",
    stroke: "#444444",
    draw_fill: true,
    draw_stroke: true,
    stroke_width: 1,
    stroke_cap: "butt",
  };
  constructor(points = []) {
    this.path.points = points;
  }

  draw() {
    if (this.path.points.length > 0) {
      ctx.fillStyle = this.style.fill;
      ctx.strokeStyle = this.style.stroke;
      ctx.lineWidth = this.style.stroke_width;
      ctx.lineCap = this.style.stroke_cap;
      ctx.lineJoin = "round";

      if (this.style.stroke_cap == "flat") {
        ctx.lineCap = "butt";
        ctx.lineJoin = "bevel";
      } else if (this.style.stroke_cap == "square") {
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
      }
      
      ctx.translate(this.position.x, this.position.y);
      ctx.beginPath();

      if (this.path.draw_type == "curve") {
        ctx.moveTo(this.path.points[0].x, this.path.points[0].y);
        for (var i = 1; i < this.path.points.length; i += 2) {
          var p = this.path.points[i];

          var j = i + 1;

          if (j > this.path.points.length - 1) {
            if (this.path.closed) {
              j = 0;
            } else {
              j = this.path.points.length - 1;
            }
          }

          var p2 = this.path.points[j];
          ctx.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
        }
      } else if (this.path.draw_type == "bezier") {
        ctx.moveTo(this.path.points[0].x, this.path.points[0].y);

        if (this.path.points.length >= 4) {
          for (var i = 1; i < this.path.points.length; i += 3) {
            var p1 = this.path.points[i];
            var j = i + 1;
            if (j > this.path.points.length - 1) {
              if (this.path.closed) {
                j = 0;
              } else {
                j = this.path.points.length - 1;
              }
            }

            var p2 = this.path.points[j];
            var p3 =
              this.path.points[
                j + 1 < this.path.points.length
                  ? j + 1
                  : this.path.points.length - 1
              ];

            ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
          }
        }
      } else if (this.path.draw_type == "arc") {
        if (this.path.points.length > 1) {
          var p1 = this.path.points[0];
          var p2 = this.path.points[1];

          ctx.ellipse(0, 0, Math.abs(p1.x), Math.abs(p2.y), 0, 0, 2 * Math.PI);
        } else {
          var p1 = this.path.points[0];
          var r = utils.dist(0, 0, p1.x, p1.y);
          ctx.arc(0, 0, r, 0, Math.PI * 2);
        }
      } else {
        ctx.moveTo(this.path.points[0].x, this.path.points[0].y);

        for (var i = 1; i < this.path.points.length; i++) {
          var p = this.path.points[i];

          ctx.lineTo(p.x, p.y);
        }
      }

      // draw_stroke
      // stroke
      // stroke_width
      // ctx.strokeStyle = this.style.stroke;
      // ctx.lineWidth = this.style.stroke_width;
      // console.log(core.mouseY, core.mouseX, this.path.points)
      // console.log(core.mouseY + (canvas.width / 2), core.mouseX + (canvas.height / 2))
      console.log( core.mouseX_raw + this.position.x, core.mouseY_raw  + this.position.y )
      console.log( this.position.x, this.position.y)
       let isIn = ctx.isPointInPath(core.mouseX_raw + this.position.x, core.mouseY_raw  + this.position.y) 
       if(isIn) {
        // console.log(isIn)
            ctx.strokeStyle = "#00ff00";
      ctx.lineWidth = 3;
       }
      if (this.path.closed) {
        ctx.closePath();
      }

      if (this.style.draw_stroke) {
        ctx.stroke();
      }

      if (this.style.draw_fill) {
        ctx.fill();
      }

      ctx.translate(-this.position.x, -this.position.y);
    }
  }

  get_bounding_box() {
    var min_x = 0;
    var min_y = 0;

    var max_x = 0;
    var max_y = 0;

    for (var i = 0; i < this.path.points.length; i++) {
      var pt = this.path.points[i];

      min_x = pt.x < min_x ? pt.x : min_x;
      min_y = pt.y < min_y ? pt.y : min_y;

      max_x = pt.x > max_x ? pt.x : max_x;
      max_y = pt.y > max_y ? pt.y : max_y;
    }

    return {
      x: min_x,
      y: min_y,
      w: max_x - min_x,
      h: max_y - min_y,
    };
  }

  draw_points(selected) {
    ctx.translate(this.position.x, this.position.y);

    ctx.fillStyle = "#f0aa55";
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1 / core.viewport.zoom;
    ctx.lineCap = "butt";

    ctx.beginPath();
    ctx.arc(0, 0, 5 / core.viewport.zoom, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();

    if (this.path.draw_type == "bezier" && this.path.points.length >= 2) {
      ctx.beginPath();
      ctx.moveTo(this.path.points[0].x, this.path.points[0].y);
      ctx.lineTo(this.path.points[1].x, this.path.points[1].y);

      for (var i = 2; i < this.path.points.length; i += 3) {
        if (i + 1 < this.path.points.length) {
          var p1 = this.path.points[i];
          var p2 = this.path.points[i + 1];

          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          if (i + 2 < this.path.points.length) {
            var p3 = this.path.points[i + 2];
            ctx.lineTo(p3.x, p3.y);
          }
        }
      }

      ctx.strokeStyle = "#222";
      ctx.stroke();
    }

    ctx.fillStyle = "#f0f0f0";
    ctx.strokeStyle = "#444";

    for (var i = 0; i < this.path.points.length; i++) {
      var p = this.path.points[i];

      ctx.beginPath();
      ctx.arc(p.x, p.y, 5 / core.viewport.zoom, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fill();
    }

    ctx.translate(-this.position.x, -this.position.y);
  }
  push(point) {
    this.path.points.push(point);
  }
}
