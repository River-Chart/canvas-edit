export function dist(a, b, c, d) {
  var x = a - c;
  var y = b - d;
  var v = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return v;
}

export function is_inside(x, y, a, b, c, d) {
  if (x > a && x < c && y > b && y < d) {
    return true;
  } else {
    return false;
  }
}

export function save_data_url(name, data) {
  var my_link = document.createElement("a");
  my_link.download = name;
  my_link.href = data;

  document.body.appendChild(my_link);
  my_link.click();
  document.body.removeChild(my_link);
}

export function createBox(text) {
  var box = document.createElement("div");
  box.setAttribute("class", "box");
  box.setAttribute("className", "box");

  if (text) {
    box.appendChild(document.createTextNode(text));
  }

  return box;
}

export function createInput(name, type, id, value, evt) {
  var box = createBox(name);
  box.appendChild(createInputElement(type, id, value, evt));
  return box;
}

export function createInputElement(type, id, value, evt) {
  var inp = document.createElement("input");
  inp.type = type;
  inp.id = id;

  if (type == "checkbox") {
    if (value) {
      inp.checked = "checked";
    }
  } else {
    inp.value = value;
  }

  if (evt) {
    inp.onchange = evt;
  }

  return inp;
}

export function createSelect(name, id, value, options, evt) {
  var box = createBox(name);
  var sel = document.createElement("select");
  sel.id = id;

  if (evt) {
    sel.onchange = evt;
  }

  for (var i = 0; i < options.length; i++) {
    var opt_name = options[i];

    var opt = document.createElement("option");
    opt.appendChild(document.createTextNode(opt_name));

    if (opt_name == value) {
      opt.setAttribute("selected", "selected");
    }

    sel.appendChild(opt);
  }

  box.appendChild(sel);
  return box;
}

export function getBgImg() {
  const img = new Image();
  img.src =
    "data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20viewBox%3D%220%200%206%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200H3V3H0V0Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M3%200H6V3H3V0Z%22%20fill%3D%22white%22/%3E%3Cpath%20d%3D%22M3%203H6V6H3V3Z%22%20fill%3D%22%23E1E1E1%22/%3E%3Cpath%20d%3D%22M0%203H3V6H0V3Z%22%20fill%3D%22white%22/%3E%3C/svg%3E%0A";
    
  const ImgCanvas = document.createElement("canvas")
  const ImgCtx = ImgCanvas.getContext('2d')
  ImgCanvas.width = img.width * 3;
  ImgCanvas.height = img.height * 3;
  ImgCtx.globalAlpha = 0.5
  ImgCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * 3, img.height * 3);

  return ImgCanvas

}

export const bgImg = getBgImg()



export function debounce(func, wait) {
  let timeout;
  return function () {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout);

      let callNow = !timeout;
      timeout = setTimeout(() => {
          timeout = null;
      }, wait)

      if (callNow) func.apply(context, args)
  }
}