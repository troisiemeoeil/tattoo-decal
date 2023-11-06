


import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as GeometryUtils from 'three/addons/utils/GeometryUtils.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

var mesh, renderer, scene, camera, controls;
var mouse, raycaster, helper, decalMaterial, decalGeometry;
let line, sprite, texture;

let cameraOrtho, sceneOrtho;

let offset = 0;

const dpr = window.devicePixelRatio;

const textureSize = 256 * dpr;
const vector = new THREE.Vector2();
init();
animate();

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
        light.position.set( 20, -20, 20 );

        scene.add( light );
        

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = false;
    document.body.appendChild( renderer.domElement );

    //

    const selection = document.getElementById( 'selection' );
    const controls = new OrbitControls( camera, selection );
    controls.enablePan = false

    //
let mesh;
    const loader = new GLTFLoader();
            loader.load( '/HUMAN.glb', function ( gltf ) {
        
                mesh = gltf.scene.children[ 0 ];
                console.log(mesh);
                scene.add( mesh );
                mesh.scale.set(  8,8,8 );
                mesh.position.set(0,-10,0)
        
            } );

    window.addEventListener( 'resize', onWindowResize );

    mouse = new THREE.Vector2();
		raycaster = new THREE.Raycaster();
		helper = new THREE.Object3D();
    

        function onPointerMove( event ) {
            mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }


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
    rotation.lookAt(eye, pos, THREE.Object3D.DEFAULT_UP)
    const euler = new THREE.Euler()
    euler.setFromRotationMatrix(rotation)

    var position = intersects[0].point
    console.log("pos", position);


    var size = new THREE.Vector3( aspectRatio , 1, 1 );

	decalGeometry = new DecalGeometry( mesh, position, euler, size );
    
                console.log("decal", decalGeometry);
    var decal = new THREE.Mesh( decalGeometry, decalMaterial );
    scene.add( decal );
    console.log("here decal", decal);
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

}


