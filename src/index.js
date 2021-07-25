import { core, gui, canvas, ctx, setCanvas } from './core'
import { TAB_OBJECT, TAB_SETTINGS } from './tabs'

import './tools/circle'
import './tools/draw'
import './tools/pencil'
import './tools/rect'

function load() {
	// canvas = ;
    setCanvas(document.getElementById("canvas"))
	canvas.width = window.innerWidth ;
	canvas.height = window.innerHeight;

	canvas.onmousedown = core.mousedown;
	canvas.onmouseup = core.mouseup;
	canvas.onmousemove = core.mousemove;
	canvas.onwheel = core.wheel;

	document.onkeydown = core.keydown;

	canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};

	gui.canvas_grid = document.getElementById("canvas_grid");
	gui.canvas_grid.width = window.innerWidth ;
	gui.canvas_grid.height = window.innerHeight;

	// TODO: only resize canvas after window is resized
	window.onresize = function () {
		canvas.width = window.innerWidth ;
		canvas.height = window.innerHeight;

		gui.canvas_grid.width = window.innerWidth ;
		gui.canvas_grid.height = window.innerHeight;

		core.draw();
		core.draw_grid();
	};

	// ctx = canvas.getContext("2d");

	gui.ctx_grid = canvas_grid.getContext("2d");
	gui.tools = document.getElementById("tools");
	gui.sidebar = document.getElementById("sidebar");

	core.init_dialog ();

	//core.create_tab (TAB_TOOLS);
	core.create_tab (TAB_SETTINGS);
	core.create_tab (TAB_OBJECT);

	core.update_ui();
	core.draw_grid();
}


window.onload = () => load()