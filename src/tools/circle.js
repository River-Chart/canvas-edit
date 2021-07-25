import { core } from '../core'
import { Shape } from '../shape'


var TOOL_CIRCLE = core.register_tool(new function() {
	this.title = "Circle";

	this.mousedown = function(e) {
		if (e.which == 1) {
			var index = core.project.push(new Shape());
			core.select_shape(index);

			var s = core.get_selected_shape();
			s.position.x = core.mouseX;
			s.position.y = core.mouseY;

			s.path.points.push ({x: 0, y:0});
			s.path.draw_type = "arc";
		}

		core.draw();
	};

	this.mousemove = function() {
		if(core.mouse_pressed[1]) {
			var s = core.get_selected_shape();

			s.path.points[0] = {
				x: core.mouseX-s.position.x,
				y: core.mouseY-s.position.y
			};

			core.draw();
		}
	};

	this.mouseup = function (e) {
		if(e.which == 1) {
			core.draw();
		}
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 67;
	this.name = "Tool: Circle";

	this.run = function() {
		core.tool = TOOL_CIRCLE;
		core.update_ui();
		core.draw();
		return true;
	};
}());
