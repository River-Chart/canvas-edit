import Document from "./model/Document";
import Rect from "./model/Rect";
import Canvas from "./component/canvas";

const document = new Document();

document.getActivePage().layers.push(new Rect(10, 10, 100, 60))
document.getActivePage().layers.push(new Rect(100, 50, 100, 60))

function load() {
  const div = window.document.createElement('div')
  div.className="root"
  window.document.body.appendChild(div)
  let app = new Canvas({ document, container: div });
  app.draw()
}

window.onload = () => load();
