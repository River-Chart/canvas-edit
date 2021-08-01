import Page from "./Page";

class Document {
  pages = [];
  activePage = -1;
  constructor() {
    this.pages.push(new Page());
    this.activePage = 0;
  }

  getActivePage(){
      const { pages, activePage} = this
      return pages[activePage]
  }
}


export default Document;