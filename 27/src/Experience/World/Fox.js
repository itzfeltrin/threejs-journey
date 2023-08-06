import * as THREE from "three";
import Experience from "../Experience";

class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    this.debugFolder = this.debug.ui.addFolder("fox");

    // Setup
    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.02, 0.02, 0.02);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);

    this.animation.actions = {};
    const [idle, walking, running] = this.resource.animations;
    this.animation.actions.idle = this.animation.mixer.clipAction(idle);
    this.animation.actions.walking = this.animation.mixer.clipAction(walking);
    this.animation.actions.running = this.animation.mixer.clipAction(running);

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset().play().crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    const debug = {
      idle: () => {
        this.animation.play("idle");
      },
      walking: () => {
        this.animation.play("walking");
      },
      running: () => {
        this.animation.play("running");
      },
    };
    this.debugFolder.add(debug, "idle");
    this.debugFolder.add(debug, "walking");
    this.debugFolder.add(debug, "running");
  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }

  setDebug() {
    this.ui;
  }
}

export default Fox;
