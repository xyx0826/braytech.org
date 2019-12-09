import React, { Component } from 'react';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import * as voluspa from '../../../../utils/voluspa';
import TGXLoader from '../../TGXLoader';
import Spinner from '../../../UI/Spinner';

import './styles.css';

class Scene extends Component {
  state = {
    loading: true,
    error: false
  };

  componentDidMount() {
    this.scene();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);

    this.stop();

    this.mount.removeChild(this.renderer.domElement);
  }

  scene = async () => {
    const { debug, gender, shadows } = this.props;

    const lightShadows = {
      enabled: shadows,
      type: THREE.PCFSoftShadowMap,
      mapSize: {
        width: 1024,
        height: 1024
      },
      radius: 2
    };

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

    this.group = new THREE.Group();
    this.group.position.set(2, 0.5, 0);

    this.scene.add(this.group);

    this.topLight = new THREE.DirectionalLight(0xffffff, lightShadows.enabled ? 2 : 1);
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
      const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 20, 32, 32), new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.5 }));
      plane.receiveShadow = true;
      plane.rotation.set(THREE.Math.degToRad(-90), 0, 0);
      plane.position.set(0, -3, 0);
      this.scene.add(plane);

      this.gridHelper = new THREE.GridHelper(300, 200, 0xffffff, 0xffffff);
      this.scene.add(this.gridHelper);

      window.camera = this.camera;

      window.group = this.group;

      window.topLight = this.topLight;
      window.rightLight = this.rightLight;
      window.leftLight = this.leftLight;

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

    const model = await this.import(debug, gender);

    if (model.error) {
      this.setState({
        loading: false,
        error: true
      });
    } else {
      this.setState({
        loading: false,
        error: false
      });
    }
  };

  import = async (debug, gender) => {
    const data = await voluspa.gearAsset(this.props.itemHash || 3580904581);

    if (!data) return { error: true };

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

    if (debug) {
      const boxHelper = new THREE.BoxHelper(mesh, 'fuchsia');

      this.group.add(boxHelper);
    }

    // const boundingBox = new THREE.Box3().setFromObject(mesh);
    // const height = boundingBox.size().y;
    // const dist = height / (2 * Math.tan(this.camera.fov * Math.PI / 360));

    // this.camera.position.set(this.camera.position.x, this.camera.position.y, dist * 1.5);

    this.group.add(mesh);
    

    return { error: false };
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
    const { loading, error } = this.state;

    return (
      <div className='scene'>
        {loading ? <Spinner /> : null}
        <div
          className='render'
          ref={mount => {
            this.mount = mount;
          }}
        />
      </div>
    );
  }
}

export default Scene;
