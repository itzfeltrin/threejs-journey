import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import EventEmitter from "./EventEmitter";

class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "cubeTexture":
          this.items[source.name] = this.loaders.cubeTextureLoader.load(
            source.path,
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;
        case "gltfModel":
          this.items[source.name] = this.loaders.gltfLoader.load(
            source.path,
            (file) => {
              this.sourceLoaded(source, file);
            }
          );
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}

export default Resources;