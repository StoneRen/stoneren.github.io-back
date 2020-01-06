// var mouseX = 0,
//   mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var container;
var camera, scene, renderer;
var ua = navigator.userAgent.toLowerCase();
//if(/MicroMessenger/i.test(ua)==false){
init();
animate();
//}
// function onDocumentMouseMove(event) {
//   mouseX = (event.clientX - windowHalfX) * 0.005;
//   mouseY = (event.clientY - windowHalfY) * 0.005;
// }
// function onDocumentTouchStart(event) {
//   if (event.touches.length === 1) {
//     event.preventDefault();
//     mouseX = event.touches[0].pageX - windowHalfX;
//     mouseY = event.touches[0].pageY - windowHalfY;
//   }
// }
// function onDocumentTouchMove(event) {
//   if (event.touches.length === 1) {
//     event.preventDefault();
//     mouseX = event.touches[0].pageX - windowHalfX;
//     mouseY = event.touches[0].pageY - windowHalfY;
//   }
// }
function init() {
  container = document.getElementById("container");
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    10
  );
  camera.position.z = 2;
  scene = new THREE.Scene();
  // geometry
  var triangles = 1;
  var instances = 500 + 200 * Math.random();
  var geometry = new THREE.InstancedBufferGeometry();
  geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise
  var vertices = new THREE.BufferAttribute(
    new Float32Array(triangles * 3 * 3),
    3
  );
  vertices.setXYZ(0, 0.025, -0.025, 0);
  vertices.setXYZ(1, -0.025, 0.025, 0);
  vertices.setXYZ(2, 0, 0, 0.025);
  geometry.addAttribute("position", vertices);
  var offsets = new THREE.InstancedBufferAttribute(
    new Float32Array(instances * 3),
    2,
    10
  );
  for (var i = 0, ul = offsets.count; i < ul; i++) {
    offsets.setXYZ(
      i,
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.9
    );
  }
  geometry.addAttribute("offset", offsets);
  var colors = new THREE.InstancedBufferAttribute(
    new Float32Array(instances * 2),
    2,
    1
  );
  for (var i = 0, ul = colors.count; i < ul; i++) {
    colors.setXYZW(
      i,
      Math.random(),
      Math.random(),
      Math.random(),
      Math.random()
    );
  }
  geometry.addAttribute("color", colors);
  var vector = new THREE.Vector4();
  var orientationsStart = new THREE.InstancedBufferAttribute(
    new Float32Array(instances * 2),
    2,
    1
  );
  for (var i = 0, ul = orientationsStart.count; i < ul; i++) {
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    vector.normalize();
    orientationsStart.setXYZW(i, vector.x, vector.y, vector.z, vector.w);
  }
  geometry.addAttribute("orientationStart", orientationsStart);
  var orientationsEnd = new THREE.InstancedBufferAttribute(
    new Float32Array(instances * 4),
    4,
    1
  );
  for (var i = 0, ul = orientationsEnd.count; i < ul; i++) {
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    vector.normalize();
    orientationsEnd.setXYZW(i, vector.x, vector.y, vector.z, vector.w);
  }
  geometry.addAttribute("orientationEnd", orientationsEnd);
  var codeBox = {
    fragmentShader:`precision highp float;
    uniform float time;
    varying vec3 vPosition;
    varying vec4 vColor;
    void main() {
      vec4 color = vec4(vColor );
      color.r += sin( vPosition.x * 10.0 + time ) * 0.8;
      color.g += cos( vPosition.y * 10.0 + time ) * 0.4;
      color.b += cos( vPosition.z * 10.0 + time ) * 0.6;
      gl_FragColor = color;
    }`,
    vertexShader:`precision highp float;
    uniform float sineTime;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    attribute vec3 position;
    attribute vec3 offset;
    attribute vec4 color;
    attribute vec4 orientationStart;
    attribute vec4 orientationEnd;
    varying vec3 vPosition;
    varying vec4 vColor;
    void main(){
      vPosition = offset * max(abs(sineTime * 3.0 + 1.0), 0.5) + position;
    vec4 orientation = normalize(mix(orientationStart,orientationEnd, sineTime));
    vec3 vcV = cross(orientation.xyz, vPosition);
    vPosition = vcV * (2.0 * orientation.w) + (cross(orientation.xyz, vcV) * 2.0 + vPosition);
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 ); }`
  };
  // material
  var material = new THREE.RawShaderMaterial({
    uniforms: {
      time: {
        value: 1.0
      },
      sineTime: {
        value: 2.0
      }
    },
    vertexShader: codeBox.vertexShader,
    // fragmentShader: document.getElementById("fragmentShader").textContent,
    fragmentShader: codeBox.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true
  });
  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  renderer = new THREE.WebGLRenderer();
  if (renderer.extensions.get("ANGLE_instanced_arrays") === false) {
    alert('股东浏览器警告');
    return;
  }
  // renderer.setClearColor(0x101010);
  renderer.setClearColor(0x030303);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  //document.addEventListener('mousemove', onDocumentMouseMove, false);
  //document.addEventListener('touchstart', onDocumentTouchStart, false);
  //document.addEventListener('touchmove', onDocumentTouchMove, false);
  window.addEventListener("resize", onWindowResize, false);
}
function onWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
}
function render() {
  var time = performance.now();
  var object = scene.children[0];
  var tValue = (object.material.uniforms.time.value = time * 0.005);
  object.rotation.x = time * 0.0005;
  //object.rotation.y = time * 0.0005;
  object.rotation.z = time * 0.00005;
  object.material.uniforms.sineTime.value = Math.sin(tValue * 0.21) * 0.1;
  //camera.position.x = Math.sin(tValue)*0.1;
  //camera.position.y = Math.cos(tValue)*0.1*0.1;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
