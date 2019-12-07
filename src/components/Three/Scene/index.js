import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import TGXLoader from '../TGXLoader';

class ThreeScene extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 4, 12);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.ambientLight.position.set(0, 0, 0);
    this.scene.add(this.ambientLight);

    this.mainLight = new THREE.PointLight(0xffffff, 0.8);
    this.mainLight.position.set(2, 5, 2);
    this.mainLightHelper = new THREE.PointLightHelper(this.mainLight, 0.4, 'red');
    this.scene.add(this.mainLight, this.mainLightHelper);

    this.gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
    this.scene.add(this.gridHelper);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    this.mount.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleResize, false);

    const group = new THREE.Group();
    // group.position.set(-5, 0, -5);

    this.group = group;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      metalness: 0.5,
      roughness: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);

    // this.group.add(mesh);

    this.scene.add(this.group);

    this.start();

    this.model();
  }

  model = async () => {
    const response = await fetch("https://lowlidev.com.au/destiny/api/gearasset/3580904581?destiny2")
      .then(async r => await r.json());

    const content = {
      gear: {
        filename: response.gearAsset.gear[0],
        loaded: false
      },
      tgx: {
        geometry: response.gearAsset.content[0].geometry.map(filename => ({ filename, loaded: false })),
        textures: response.gearAsset.content[0].textures.map(filename => ({ filename, loaded: false })),
        platedTextures: []
      },
      indexes: {
        dye_index_set: response.gearAsset.content[0].dye_index_set,
        region_index_sets: response.gearAsset.content[0].region_index_sets,
        female_index_set: response.gearAsset.content[0].female_index_set,
        male_index_set: response.gearAsset.content[0].male_index_set
      }
    }

    await TGXLoader.load(content);

    console.log(content);

    const mesh = await TGXLoader.compose(content);

    console.log(mesh);

    const material = new THREE.MeshPhysicalMaterial({
      metalness: 0.5,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    //const mesh = new THREE.Mesh(geometry, material);

    mesh.rotation.x = -(Math.PI / 2);

    mesh.scale.set(10, 10, 10)

    // this.scene.add(mesh);
    this.group.add(mesh);

  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);

    this.stop();

    this.mount.removeChild(this.renderer.domElement);
  }

  handleResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    // if (this.group) {
    //   this.group.rotation.z += 0.01;
    //   this.group.rotation.x += 0.01;
    //   this.group.rotation.y += 0.01;
    // }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        className='render'
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default ThreeScene;
