var DIALOG_SHORTCUT_LIST = core.register_dialog(function (container) {
	this.dialog = container;

	this.init = function () {
		var that = this;
		this.input = document.createElement("input");
			this.input.type = "text";

			this.input.onchange = function () {
				that.update_list();
			};

			this.input.oninput = function () {
				that.update_list();
			};

			this.input.onkeydown = function (evt) {
				evt = evt || window.event;

				console.log(evt.keyCode);

				if(evt.keyCode == 13) {
					for (var i = 0; i < core.shortcuts.length; i++) {
						if (core.shortcuts[i].name.toLowerCase().indexOf(that.input.value.toLowerCase()) != -1) {
							core.close_dialog();
							core.shortcuts[i].run();
							break;
						}
					}
				}
			};
		this.dialog.appendChild(this.input);

		this.list = document.createElement("ul");
		this.dialog.appendChild(this.list);

		this.input.focus();
		this.update_list ();
	};

	this.update_list = function () {
		this.list.innerHTML = "";
		var that = this;

		for (var i = 0; i < core.shortcuts.length; i++) {
			if (core.shortcuts[i].name.toLowerCase().indexOf(this.input.value.toLowerCase()) != -1) {
				var elm = document.createElement("li");
				elm.appendChild(document.createTextNode(core.shortcuts[i].name));

				elm.shortcut_id = i;
				elm.onclick = function () {
					core.close_dialog();
					core.shortcuts[this.shortcut_id].run();
				};

				var div = document.createElement("div");
					div.setAttribute("class", "r");
					div.setAttribute("className", "r");
					div.appendChild(document.createTextNode(this.shortcut_to_string(core.shortcuts[i])));
				elm.appendChild(div);

				this.list.appendChild(elm);
			}
		}
	};

	this.close = function () {
		this.input.blur();
	};

	this.shortcut_to_string = function (s) {
		var str = "";
		if (s.ctrlKey) {
			str+= "Ctrl+"
		}

		if (s.shiftKey) {
			str+= "Shift+"
		}

		if (s.key == 32) {
			return str + "Space";
		} else {
			return str + String.fromCharCode(s.key);
		}
	};
});

core.register_shortcut(new function() {
	this.ctrlKey = false;
	this.shiftKey = false;
	this.key = 32;
	this.name = "Open Shortcut List";

	this.run = function() {
		core.open_dialog (DIALOG_SHORTCUT_LIST);
		return true;
	};
}());
