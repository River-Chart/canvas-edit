import Document from "./model/Document";
import Rect from "./model/Rect";
import Canvas from "./component/canvas";

const document = new Document();

document.getActivePage().layers.push(new Rect(10, 10))

function load() {
  const div = window.document.createElement('div')
  div.className="root"
  window.document.body.appendChild(div)
  let app = new Canvas({ document, container: div });
  app.draw()
}

window.onload = () => load();
