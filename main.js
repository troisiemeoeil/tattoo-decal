


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// import studio from '@theatre/studio'
// import core from '@theatre/core'

var mesh, renderer, scene, camera, controls;
var mouse, raycaster, helper, decalMaterial, decalGeometry;
let line, sprite, texture;

let cameraOrtho, sceneOrtho;
const experience = document.querySelector('.container')
let offset = 0;

const dpr = window.devicePixelRatio;

const textureSize = 256 * dpr;
const vector = new THREE.Vector2();
init();
animate();

// studio.initialize()

function init() {

    //

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera = new THREE.PerspectiveCamera( 70, width / height, 1, 1000 );
    camera.position.z = 20;

    cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
    cameraOrtho.position.z = 10;


    scene = new THREE.Scene();
    sceneOrtho = new THREE.Scene();

    //


    //

    texture = new THREE.FramebufferTexture( textureSize, textureSize );

    //

    const spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set( textureSize, textureSize, 1 );
    sceneOrtho.add( sprite );

    updateSpritePosition();

    //

    var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 20,20, 0 );
        light.position.set( 20, -20, 0 );

        scene.add( light );
        const Amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( Amblight );

const Hemlight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( Hemlight );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    document.body.appendChild( renderer.domElement );

    //

    const selection = document.getElementById( 'selection' );
    const controls = new OrbitControls( camera, selection );
    controls.enableRotate = false
    controls.enablePan = true
    camera.updateProjectionMatrix()
    //
let mesh;
    const loader = new GLTFLoader();
            loader.load( '/HUMAN.glb', function ( gltf ) {
        
                mesh = gltf.scene.children[ 0 ];
                console.log(mesh);
                scene.add( mesh );
                mesh.scale.set(  10,10,10 );
                mesh.position.set(0,-10,0)
                // mesh.rotation.set(-1,0,4.5)

        
            } );

    window.addEventListener( 'resize', onWindowResize );

    mouse = new THREE.Vector2();
		raycaster = new THREE.Raycaster();
		helper = new THREE.Object3D();
    

        function onPointerMove( event ) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }
        let exist = false;
        window.addEventListener('keypress', (event)=> {
              scene.traverse(function (mesh) {
                if (mesh.type ==="Group") {
                  exist = true
                }
            })
            let baseModel = scene.children[3]                                               
            if (event.key == "d" && exist === true) {
    
                baseModel.rotation.y += 0.05
              }

              if (event.key == "q" && exist === true) {
                baseModel.rotation.y -= 0.05
              }

              
              if (event.key == "z" && exist === true) {
                baseModel.rotation.x += 0.05
              }

              if (event.key == "s" && exist === true) {
                baseModel.rotation.x -= 0.05
              }

              if (event.key == "e" && exist === true) {
                baseModel.rotation.z += 0.05
              }

              if (event.key == "a" && exist === true) {
                baseModel.rotation.z -= 0.05
              }
        })

        window.addEventListener( 'pointermove', onPointerMove );
const image = document.querySelector("img")
const input = document.querySelector('input')

input.addEventListener('change', ()=> {
  
    image.src = URL.createObjectURL(input.files[0])
    console.log(input.files[0]);
  


    

    const Texture = new THREE.TextureLoader().load(image.src)

    decalMaterial = new THREE.MeshPhongMaterial({ 
        map: Texture,
        shininess: 30,
        transparent: true,
        depthTest: true,
        depthWrite: true,
        polygonOffset: true,
        polygonOffsetFactor: - 4,
        // wireframe: false,
        side: THREE.FrontSide
    });

})


window.addEventListener('dblclick', (event)=> {
let baseModel = scene.children[3]

    let aspectRatio = image.naturalWidth / image.naturalHeight

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

raycaster.setFromCamera( mouse, camera );

var intersects = raycaster.intersectObject( mesh );
console.log(intersects);

if ( intersects.length > 0 ) {
console.log(intersects[0]);
    var n = intersects[ 0 ].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(intersects[0].point);
    const pos = intersects[ 0 ].point.clone()
    const eye = pos.clone()
    const rotation = new THREE.Matrix4()

    var position = intersects[0].point
    console.log("pos", position);


    var size = new THREE.Vector3( aspectRatio, 1, 1);

	decalGeometry = new DecalGeometry( mesh, position, rotation, size );
    
    var decal = new THREE.Mesh( decalGeometry, decalMaterial );
    const group = new THREE.Group();
    group.add(baseModel)
    group.add(decal)
  scene.add( group );
    console.log("here decal", scene);
}
})

}

function onWindowResize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    cameraOrtho.left = - width / 2;
    cameraOrtho.right = width / 2;
    cameraOrtho.top = height / 2;
    cameraOrtho.bottom = - height / 2;
    cameraOrtho.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    updateSpritePosition();

}

function updateSpritePosition() {

    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    const halfImageWidth = textureSize / 2;
    const halfImageHeight = textureSize / 2;

    sprite.position.set( - halfWidth + halfImageWidth +25, halfHeight - halfImageHeight - 20, 1 );

}

function animate() {

    requestAnimationFrame( animate );


    // scene rendering

    renderer.clear();
    renderer.render( scene, camera );

    // calculate start position for copying data

    vector.x = ( window.innerWidth * dpr / 2 ) - ( textureSize / 2 );
    vector.y = ( window.innerHeight * dpr / 2 ) - ( textureSize / 2 );

    renderer.copyFramebufferToTexture( vector, texture );

    renderer.clearDepth();
    renderer.render( sceneOrtho, cameraOrtho );
    camera.updateProjectionMatrix();
    cameraOrtho.updateProjectionMatrix()
}


