import Document from "./model/Document";
import Rect from "./model/Rect";
import Canvas from "./component/canvas";

const document = new Document();

document.getActivePage().layers.push(new Rect(10, 10))

function load() {
  let app = new Canvas({ document });
  app.draw()
}

window.onload = () => load();
