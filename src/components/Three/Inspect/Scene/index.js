import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import TGXLoader from '../../TGXLoader';

class Scene extends Component {
  componentDidMount() {
    this.createScene();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);

    this.stop();

    this.mount.removeChild(this.renderer.domElement);
  }

  createScene = () => {
    const { debug, gender } = this.props;

    const lightShadows = {
      enabled: true,
      type: THREE.PCFSoftShadowMap,
      mapSize: {
        width: 1024,
        height: 1024
      },
      radius: 2
    }

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = lightShadows.enabled;
    this.renderer.shadowMap.type = lightShadows.type;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);

    // as per game
    this.camera.position.set(0, 2, 7);

    // bird's eye
    // this.camera.position.set(0, 30, 0);

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    window.camera = this.camera;

    this.group = new THREE.Group();
    this.group.position.set(2, 0.5, 0);

    this.scene.add(this.group);

    this.topLight = new THREE.DirectionalLight(0xffffff, 2);
    this.topLight.position.set(0, 100, 0);
    this.topLight.castShadow = true;
    this.topLight.shadow.mapSize.width = lightShadows.mapSize.width;
    this.topLight.shadow.mapSize.height = lightShadows.mapSize.height;
    this.topLight.shadow.radius = lightShadows.radius;
    this.scene.add(this.topLight);

    this.rightLight = new THREE.DirectionalLight(0xffffff, 1);
    this.rightLight.position.set(-8, 10, -8);
    this.rightLight.castShadow = false;
    this.rightLight.shadow.mapSize.width = lightShadows.mapSize.width;
    this.rightLight.shadow.mapSize.height = lightShadows.mapSize.height;
    this.rightLight.shadow.radius = lightShadows.radius;
    this.scene.add(this.rightLight);

    this.leftLight = new THREE.DirectionalLight(0xffffff, 1);
    this.leftLight.position.set(8, 2, 8);
    this.leftLight.castShadow = false;
    this.leftLight.shadow.mapSize.width = lightShadows.mapSize.width;
    this.leftLight.shadow.mapSize.height = lightShadows.mapSize.height;
    this.leftLight.shadow.radius = lightShadows.radius;
    this.scene.add(this.leftLight);

    if (debug) {

      const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 32, 32), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
      plane.receiveShadow = true;
      plane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
      plane.position.set(0, -2.5, 0);
      this.scene.add(plane);

      this.gridHelper = new THREE.GridHelper(300, 200, 0xffffff, 0xffffff);
      this.scene.add(this.gridHelper);

      window.group = this.group;

      window.topLight = this.topLight
      window.rightLight = this.rightLight
      window.leftLight = this.leftLight

      this.topLightHeper = new THREE.DirectionalLightHelper(this.topLight, 0.4, 'black');
      this.leftLightHeper = new THREE.DirectionalLightHelper(this.leftLight, 0.4, 'red');
      this.rightLightHeper = new THREE.DirectionalLightHelper(this.rightLight, 0.4, 'green');
      this.scene.add(this.topLightHeper, this.leftLightHeper, this.rightLightHeper);
      
    }

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    this.mount.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.handleResize, false);

    this.start();

    this.model(debug, gender);
  };

  model = async (debug, gender) => {
    const response = await fetch(`https://lowlidev.com.au/destiny/api/gearasset/${this.props.itemHash || 3580904581}?destiny2`).then(async r => await r.json());

    const data = {
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
    };

    // apply params to data
    data.debug = Boolean(debug);
    data.gender = gender || 'male';

    // trigger TGXLoader
    await TGXLoader.load(data);

    // data loaded to self, get the mesh
    const mesh = await TGXLoader.mesh(data);

    console.log(data, mesh);

    // rotate
    mesh.rotation.set(THREE.Math.degToRad(-90), 0, THREE.Math.degToRad(-140));

    // scale
    mesh.scale.set(10, 10, 10);

    // center
    mesh.geometry.center();

    // shadow
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.group.add(mesh);
  };

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

export default Scene;
