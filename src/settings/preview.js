core.register_setting(new function() {
	this.title = "Preview";

	this.get_input = function(i) {
		var str = "<input type=\"checkbox\" onchange=\"core.settings[" + i + "].change(this);\" " + (core.preview ? "checked=\"checked\"" : "") + "></input>"
		return str;
	};

	this.change = function(v) {
		core.preview = v.checked;
		core.draw();
		core.update_ui();
	};
}());
