import { core } from './core'
import { Shape } from './shape'
import  * as utils  from './utils'

class Project {
  shapes = [];
  push(obj) {
    this.shapes.push(obj);
    return this.shapes.length - 1;
  }

  draw(draw_points) {
    for (var i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw();

      if (draw_points) {
        this.shapes[i].draw_points(core.selected_shape == i);
      }
    }
  }

  move_shape(from, to) {
    if (from < 0) {
      return;
    }

    if (to < 0 || to > this.shapes.length - 1) {
      return;
    }

    var my_shape = this.shapes.splice(from, 1)[0];
    this.shapes.splice(to, 0, my_shape);

    core.selected_shape = to;

    console.log(this.shapes);
  }

  new() {
    if (confirm("Create new project?")) {
      this.shapes = [];
      core.selected_shape = -1;
    }
  }

  save() {
    var data = JSON.stringify(this.shapes);
    data = "data:text/plain;charset=utf-8," + encodeURIComponent(data);
    utils.save_data_url("img.vected", data);
  }

  load() {
    var d = prompt("Data");
    if (d) {
      var data = JSON.parse(d);
      this.shapes = [];

      for (var it = 0; it < data.length; it++) {
        var my_shape = new Shape();

        my_shape.position = data[it].position;
        my_shape.path = data[it].path;
        my_shape.style = data[it].style;

        this.shapes.push(my_shape);
      }
      core.draw();
    }
  }

  export() {
    var data = canvas.toDataURL("image/png");
    utils.save_data_url("export.png", data);
  }
}

export { Project }