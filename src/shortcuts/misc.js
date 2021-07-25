core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 80;
	this.name = "Toggle Preview";

	this.run = function() {
		core.preview = !core.preview;
		core.update_ui();
		core.draw();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 67;
	this.name = "Close shape";

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			s.path.closed = !s.path.closed;
			core.update_ui();
			core.draw();
		}
	};
}());

/*
core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 65;
	this.name = "Toggle Arc";

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			s.path.arc = !s.path.arc;
			core.update_ui();
			core.draw();
		}
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = true;
	this.key = 67;
	this.name = "Toggle Curve";

	this.run = function() {
		var s = core.get_selected_shape();
		if(s) {
			s.path.curve = !s.path.curve;
			core.update_ui();
			core.draw();
		}
	};
}());*/

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 86;
	this.name = "Reset Viewport";

	this.run = function() {
		core.viewport = {
			x : 0,
			y : 0,
			zoom : 1
		}
		core.draw();
		core.draw_grid();
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 77;
	this.name = "Move Up";

	this.run = function() {
		core.project.move_shape(core.selected_shape, core.selected_shape+1);
		core.draw();
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 78;
	this.name = "Move Down";

	this.run = function() {
		core.project.move_shape(core.selected_shape, core.selected_shape-1);
		core.draw();
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = true;
	this.shiftKey = false;
	this.key = 83;
	this.name = "Save File";

	this.run = function() {
		core.project.save();
		core.draw();

		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = true;
	this.shiftKey = false;
	this.key = 79;
	this.name = "Open File";

	this.run = function() {
		core.project.load	();
		core.draw();

		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = true;
	this.shiftKey = false;
	this.key = 69;
	this.name = "Export Image";

	this.run = function() {
		core.project.export	();
		core.draw();

		return true;
	};
}());
