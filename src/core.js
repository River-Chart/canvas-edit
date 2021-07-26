export let canvas;
export let ctx;
export const gui = {};
import { Project } from './project'
import { ToolEdit } from './tools/edit'
// import bg from '../bg.svg'
import { bgImg, debounce } from './utils'


export function setCanvas(c){
    canvas = c
    ctx = canvas.getContext("2d")
}


class Core {

  constructor(){
    this.draw = debounce(this.draw, 5)
  }

  tool_edit = new ToolEdit()
  project = new Project();
  mode = 0;
  tool = -1;
  tools = [];

  mouseX = 0;
  mouseY = 0;

  pmouseX_raw = 0;
  pmouseY_raw = 0;

  mouseX_raw = 0;
  mouseY_raw = 0;

  mouse_pressed = [false, false, false];
  snap = false;
  grid = true;
  grid_size = 32;
  preview = false;

  settings = [];
  shortcuts = [];

  registered_tabs = [];
  tabs = [];

  dialogs = [];
  dialog = {
    open_dialog: null,
    container: null,
    overlay: null,
  };

  viewport = {
    x: 0,
    y: 0,
    zoom: 1,
  };

  selected_shape = -1;

  register_tab(t) {
    this.registered_tabs.push(t);
    return this.registered_tabs.length - 1;
  }

  create_tab(type) {
    this.tabs.push(new this.registered_tabs[type]());
  }

  init_dialog() {
    this.dialog.container = document.getElementById("dialog_container");
    this.dialog.overlay = document.getElementById("overlay");

    this.dialog.container.style.display = "none";
    this.dialog.overlay.style.display = "none";

    this.dialog.overlay.onclick = function (evt) {
      core.close_dialog();
    };
  }

  register_dialog(def) {
    this.dialogs.push(def);
    return this.dialogs.length - 1;
  }

  open_dialog(type) {
    if (!this.dialog.open_dialog) {
      this.dialog.container.style.display = "block";
      this.dialog.overlay.style.display = "block";

      this.dialog.open_dialog = new this.dialogs[type](this.dialog.container);

      this.dialog.open_dialog.init();
      return true;
    }

    return false;
  }

  close_dialog() {
    this.dialog.container.style.display = "none";
    this.dialog.overlay.style.display = "none";

    if (this.dialog.open_dialog) {
      this.dialog.open_dialog.close();
      this.dialog.open_dialog = null;

      this.dialog.container.innerHTML = "";
      return true;
    }
  }

  // Tools

  register_tool(t) {
    this.tools.push(t);

    return this.tools.length - 1;
  }

  // Settings

  register_setting(t) {
    this.settings.push(t);
  }

  get_setting(t) {
    for (var i = 0; i < this.settings.length; i++) {
      if (this.settings[i].title == t) {
        return this.settings[i];
      }
    }
  }

  // Shortcuts

  register_shortcut(t) {
    this.shortcuts.push(t);
  }

  get_selected_shape() {
    if (this.selected_shape != -1) {
      return this.project.shapes[this.selected_shape];
    } else {
      return null;
    }
  }

  select_shape(id) {
    this.selected_shape = id;
  }

  select_tool(i) {
    this.tool = i;
    if (this.tools[i].select) {
      this.tools[i].select();
    }
    this.update_ui();
  }

  // @debounce(30)
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(this.viewport.zoom, this.viewport.zoom);
    ctx.translate(this.viewport.x, this.viewport.y);

    this.project.draw(!core.preview);

    if (this.tool == -1) {
      if (this.tool_edit.draw) {
        this.tool_edit.draw();
      }
    } else if (this.tools[this.tool].draw) {
      this.tools[this.tool].draw();
    }

    ctx.translate(-this.viewport.x, -this.viewport.y);
    ctx.scale(1 / this.viewport.zoom, 1 / this.viewport.zoom);
    // ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }

  draw_grid() {
    var w = gui.canvas_grid.width;
    var h = gui.canvas_grid.height;
    gui.ctx_grid.clearRect(0, 0, w, h);

    if (!this.grid) {
      return;
    }
    gui.ctx_grid.setTransform(1,0,0,1,this.viewport.x, this.viewport.y);
    gui.ctx_grid.fillStyle = gui.ctx_grid.createPattern(bgImg, 'repeat');
    gui.ctx_grid.fillRect(0 - this.viewport.x, 0 - this.viewport.y , w , h);
    gui.ctx_grid.resetTransform()


    // if (this.grid_size * this.viewport.zoom >= 4) {
    //   gui.ctx_grid.beginPath();
    //   var x =
    //     (this.viewport.x * this.viewport.zoom + Math.ceil(canvas.width / 2)) %
    //     (this.grid_size * this.viewport.zoom);
    //   for (var i = x; i < w + x; i += this.grid_size * this.viewport.zoom) {
    //     gui.ctx_grid.moveTo(i + 0.5, -0.5);
    //     gui.ctx_grid.lineTo(i + 0.5, h + 0.5);
    //   }

    //   var y =
    //     (this.viewport.y * this.viewport.zoom + Math.ceil(canvas.height / 2)) %
    //     (this.grid_size * this.viewport.zoom);
    //   for (var i = y; i < h + y; i += this.grid_size * this.viewport.zoom) {
    //     // gui.ctx_grid.moveTo(-0.5, i + 0.5);
    //     // gui.ctx_grid.lineTo(w + 0.5, i + 0.5);
    //   }

    //   gui.ctx_grid.lineWidth = 1;
    //   gui.ctx_grid.strokeStyle = "#ccc";
    //   gui.ctx_grid.stroke();
    // }

    // gui.ctx_grid.beginPath();

    // console.log(this.viewport)
    // gui.ctx_grid.moveTo(
    //   0,
    //   this.viewport.y * this.viewport.zoom + Math.ceil(canvas.height / 2)
    // );
    // console.log( 0, this.viewport.y * this.viewport.zoom + Math.ceil(canvas.height / 2))

    // console.log(w, this.viewport.y * this.viewport.zoom + Math.ceil(canvas.height / 2))
    // gui.ctx_grid.lineTo(
    //   w,
    //   this.viewport.y * this.viewport.zoom + Math.ceil(canvas.height / 2)
    // );

    // gui.ctx_grid.moveTo(
    //   this.viewport.x * this.viewport.zoom + Math.ceil(canvas.width / 2),
    //   0
    // );
    // gui.ctx_grid.lineTo(
    //   this.viewport.x * this.viewport.zoom + Math.ceil(canvas.width / 2),
    //   h
    // );

    // gui.ctx_grid.lineWidth = 5;
    // gui.ctx_grid.strokeStyle = "#666";
    // gui.ctx_grid.stroke();
  }

  update_ui() {
    gui.sidebar.innerHTML = "";

    for (var i = 0; i < this.tabs.length; i++) {
      var div = document.createElement("div");
      div.setAttribute("class", "object");
      div.setAttribute("className", "object");

      var h1 = document.createElement("h1");
      h1.appendChild(document.createTextNode(this.tabs[i].name));
      div.appendChild(h1);

      this.tabs[i].draw(div);

      gui.sidebar.appendChild(div);

      gui.sidebar.appendChild(document.createElement("br"));
      gui.sidebar.appendChild(document.createElement("br"));
    }

    gui.tools.innerHTML = "";
    for (var i = 0; i < this.tools.length; i++) {
      var tool_btn = document.createElement("button");

      if (i == this.tool) {
        tool_btn.setAttribute("class", "selected");
        tool_btn.setAttribute("className", "selected");
      }

      tool_btn.tool_id = i;
      tool_btn.onclick = function () {
        core.select_tool(this.tool_id);
      };

      tool_btn.appendChild(document.createTextNode(core.tools[i].title));
      gui.tools.appendChild(tool_btn);
    }
  }

  mousedown(e) {
    core.mouse_pressed[e.which] = true;

    if (core.tool == -1) {
      core.tool_edit.mousedown(e);
    } else if (core.tools[core.tool].mousedown) {
      if (e.which == 3) {
        core.tool = -1;
        core.update_ui();
      } else {
        core.tools[core.tool].mousedown(e);
      }
    }
  }

  mouseup(e) {
    core.mouse_pressed[e.which] = false;

    if (core.tool == -1) {
      core.tool_edit.mouseup(e);
    } else if (core.tools[core.tool].mouseup) {
      core.tools[core.tool].mouseup(e);
    }
  }

  mousemove(e) {
    var raw_x = e.pageX ;
    var raw_y = e.pageY;

    core.mouseX_raw = raw_x / core.viewport.zoom - core.viewport.x;
    core.mouseY_raw = raw_y / core.viewport.zoom - core.viewport.y;

    if (core.mouse_pressed[2] && !e.shiftKey) {
      var dx = core.mouseX_raw - this.pmouseX_raw;
      var dy = core.mouseY_raw - this.pmouseY_raw;

      core.viewport.x += dx;
      core.viewport.y += dy;

      core.draw();
      core.draw_grid();
    }

    core.mouseX_raw = raw_x / core.viewport.zoom - core.viewport.x;
    core.mouseY_raw = raw_y / core.viewport.zoom - core.viewport.y;

    if (!core.snap) {
      core.mouseX = core.mouseX_raw;
      core.mouseY = core.mouseY_raw;
    } else {
      core.mouseX =
        Math.floor(core.mouseX_raw / core.grid_size + 0.5) * core.grid_size;
      core.mouseY =
        Math.floor(core.mouseY_raw / core.grid_size + 0.5) * core.grid_size;
    }

    if (core.tool == -1) {
      core.tool_edit.mousemove(e);
    } else if (core.tools[core.tool].mousemove) {
      core.tools[core.tool].mousemove(e);
    }

    this.pmouseX_raw = core.mouseX_raw;
    this.pmouseY_raw = core.mouseY_raw;
  }

  wheel(evt) {
    // console.log(core.viewport);
    if (evt.ctrlKey) {
      evt.preventDefault();
      if (evt.deltaY < 0) {
        core.viewport.zoom *= 1.07;
      } else {
        core.viewport.zoom *= 0.93;
      }
      
      core.viewport.zoom = Math.max(core.viewport.zoom, 0.1);
      core.draw();
      core.draw_grid();
    } else {
      core.viewport.y -= (evt.deltaY / core.viewport.zoom);
      core.viewport.x -= (evt.deltaX / core.viewport.zoom);
      core.draw();
      core.draw_grid();
    }
  }

  keydown(e) {
    if (e.keyCode == 9) {
      var t = core.tool + 1;

      if (e.shiftKey) {
        t = core.tool - 1;
      }

      if (t > core.tools.length - 1) {
        t = 0;
      }

      if (t < 0) {
        t = core.tools.length - 1;
      }

      core.select_tool(t);

      return false;
    } else {
      if (
        document.activeElement.nodeName.toLowerCase() == "input" &&
        !core.dialog.open_dialog
      ) {
        return true;
      }

      if (e.keyCode == 27) {
        if (core.dialog.open_dialog) {
          core.close_dialog();
        } else {
          core.tool = -1;
          core.update_ui();
        }
      } else if (core.tool != -1 && core.tools[core.tool].keydown) {
        if (core.tools[core.tool].keydown(e)) {
          return false;
        }
      } else {
        console.log(e.keyCode);
        for (var i = 0; i < core.shortcuts.length; i++) {
          var s = core.shortcuts[i];
          if (
            s.key == e.keyCode &&
            s.shiftKey == e.shiftKey &&
            s.ctrlKey == e.ctrlKey
          ) {
            if (s.run()) {
              return false;
            }
          }
        }
      }
    }
  }
}

export const core = new Core();
window.core = core