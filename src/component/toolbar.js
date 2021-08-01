
class Toolbar {
  constructor(canvas) {
    this.canvas = canvas
    this.tools = window.document.createElement('div')

    this.tools.className = 'tools'
    const button = window.document.createElement('button')
    button.innerText = 'rect'
    this.tools.appendChild(button)

    this.canvas.container.appendChild(this.tools)
  }

 

}

export default Toolbar;
