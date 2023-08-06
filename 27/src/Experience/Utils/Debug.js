import * as lil from "lil-gui";

class Debug {
  constructor() {
    this.active = window.location.hash === "#debug";

    this.ui = new lil.GUI();

    if (!this.active) this.ui.hide();
  }
}

export default Debug;
