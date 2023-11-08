
import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

import studio from '@theatre/studio';
import * as core from '@theatre/core'
const container = document.querySelector( '.container' );
console.log(core);
// const project = core.getProject('')
studio.initialize()
let renderer, scene, camera, stats;
let mesh;
let raycaster;
let line;

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const Texture = new THREE.TextureLoader().load("/tattoo.png")
const decalMaterial = new THREE.MeshPhongMaterial( {
    specular: 0x444444,
    map: Texture,
    normalScale: new THREE.Vector2( 1, 1 ),
    shininess: 30,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
} );

const decals = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3( 100, 100, 100 );

const params = {
    minScale: 10,
    maxScale: 20,
    rotate: true,
    clear: function () {

        removeDecals();

    }
};

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    stats = new Stats();
    // container.appendChild( stats.dom );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 120;

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.enabled = true;
    controls.enableRotate  = false
    controls.enablePan  = true

   
 
    scene.add( new THREE.AmbientLight( 0x666666 ) );

    const dirLight1 = new THREE.DirectionalLight( 0xffddcc, 3 );
    dirLight1.position.set( 1, 0.75, 0.5 );
    scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0xccccff, 3 );
    dirLight2.position.set( - 1, 0.75, - 0.5 );
    scene.add( dirLight2 );

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    loadLeePerrySmith();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial() );
    mouseHelper.visible = false;
    scene.add( mouseHelper );

    window.addEventListener( 'resize', onWindowResize );

    

    window.addEventListener( 'pointerup', function ( event ) {

     

            checkIntersection( event.clientX, event.clientY );

            if ( intersection.intersects ) shoot();

        

    } );

    window.addEventListener( 'pointermove', onPointerMove );

    function onPointerMove( event ) {

        if ( event.isPrimary ) {

            checkIntersection( event.clientX, event.clientY );
            controls.object.position.copy(camera.position)
        }

    }

    function checkIntersection( x, y ) {

        if ( mesh === undefined ) return;

        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );
        raycaster.intersectObject( mesh, false, intersects );

        if ( intersects.length > 0 ) {

            const p = intersects[ 0 ].point;
            mouseHelper.position.copy( p );
            intersection.point.copy( p );

            const n = intersects[ 0 ].face.normal.clone();
            n.transformDirection( mesh.matrixWorld );
            n.multiplyScalar( 10 );
            n.add( intersects[ 0 ].point );

            intersection.normal.copy( intersects[ 0 ].face.normal );
            mouseHelper.lookAt( n );

            const positions = line.geometry.attributes.position;
            positions.setXYZ( 0, p.x, p.y, p.z );
            positions.setXYZ( 1, n.x, n.y, n.z );
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {

            intersection.intersects = false;

        }

    }

    const gui = new GUI();

    gui.add( params, 'minScale', 1, 30 );
    gui.add( params, 'maxScale', 1, 30 );
    gui.add( params, 'rotate' );
    gui.add( params, 'clear' );
    gui.open();

}

function loadLeePerrySmith() {

    

    const loader = new GLTFLoader();

    loader.load( '/HUMAN.glb', function ( gltf ) {

        mesh = gltf.scene.children[ 0 ];
        mesh.material = new THREE.MeshPhongMaterial( {
            specular: 0x111111,
            shininess: 25
        } );

        scene.add( mesh );
        mesh.scale.set( 25, 25, 25 );
        mesh.position.y = -20
        // mesh.rotation.z = -2


    } );
}

let decalMap = []
function shoot() {

    position.copy( intersection.point );
    orientation.copy( 0,0,0 );

    // if ( params.rotate ) orientation.z = Math.random() * 2 * Math.PI;

    const scale = params.minScale + Math.random() * ( params.maxScale - params.minScale );
    size.set( 5, 5, 5 );

    const material = decalMaterial.clone();
    // material.color.setHex( Math.random() * 0xffffff );

    const m = new THREE.Mesh( new DecalGeometry( mesh, position, orientation, size ), material );
    m.renderOrder = decals.length; // give decals a fixed render order

    decals.push( m );
    scene.add( m );

}

function removeDecals() {

    decals.forEach( function ( d ) {

        scene.remove( d );

    } );

    decals.length = 0;

}

window.addEventListener('keypress', (event)=> {
    console.log(event.key);
    // scene.traverse(function (mesh) {

    //     if (mesh instanceof THREE.Mesh) {
    //         // console.log(mesh);
    //         mesh.rotation.z += 2.5
    //     }
    // })
let baseModel = scene.children[5]

    if (event.key == "f") {

        baseModel.rotation.z += 1
        removeDecals()
      }
})




function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    requestAnimationFrame( animate );

    renderer.render( scene, camera );

    stats.update();
    
}