import { core } from '../core'
import { Shape } from '../shape'

var TOOL_DRAW = core.register_tool(new function() {
	this.title = "Draw";
	this.selected_point = -1;

	this.mousedown = function(e) {
		var s = core.get_selected_shape();

		if(s && !e.shiftKey) {
			if(e.which == 1) {
				s.push({
					x : core.mouseX - s.position.x,
					y : core.mouseY - s.position.y
				});
			}

			this.selected_point = s.path.points.length-1;

			core.draw();
			core.update_ui();
		} else {
			if(e.which == 1) {
				var my_shape = new Shape([]);
				my_shape.position = {
					x : core.mouseX,
					y : core.mouseY
				};
				core.project.push(my_shape);
				core.select_shape(core.project.shapes.length - 1);

				this.selected_point = -2;

				core.draw();
				core.update_ui();
			} else if(s) {
				if(s.path.points.length > 0) {
					s.path.points.pop();
				} else {
					core.project.shapes.splice(core.selected_shape, 1);
				}

				this.selected_point = s.path.points.length-1;

				core.draw();
				core.update_ui();
			}
		}
	};

	this.mousemove = function (evt) {
		if(core.mouse_pressed[1]) {
			if(this.selected_point != -1) {
				var s = core.get_selected_shape();
				if(this.selected_point == -2) {
					s.position = {
						x : core.mouseX,
						y : core.mouseY
					};
				} else {
					s.path.points[this.selected_point] = {
						x : core.mouseX - s.position.x,
						y : core.mouseY - s.position.y
					};
				}
			}

			core.draw();
		}
	};

	this.mouseup = function() {
		this.selected_point = -1;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 68;
	this.name = "Tool: Draw";

	this.run = function() {
		core.tool = TOOL_DRAW;
		core.update_ui();
		core.draw();
		return true;
	};
}());
