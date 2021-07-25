core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 83;
	this.name = "Toggle Snap";

	this.run = function() {
		core.snap = !core.snap;
		core.update_ui();
		core.draw_grid();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 71;
	this.name = "Toggle Grid";

	this.run = function() {
		core.grid = !core.grid;
		core.update_ui();
		core.draw_grid();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 81;
	this.name = "Decrease Grid Size";

	this.run = function() {
		if((core.grid_size / 2) % 1 == 0) {
			core.grid_size = core.grid_size / 2;
		}
		core.update_ui();
		core.draw_grid();
		return true;
	};
}());

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 87;
	this.name = "Increase Grid Size";

	this.run = function() {
		core.grid_size = core.grid_size * 2;
		core.update_ui();
		core.draw_grid();
		return true;
	};
}());
