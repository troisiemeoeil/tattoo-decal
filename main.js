

import * as THREE from 'three';


import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';

var mesh, renderer, scene, camera, controls;
var mouse, raycaster, helper, decalMaterial, decalGeometry;

init();
animate();




function init() {
   
    const experience = document.querySelector('.experience')

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( experience.offsetWidth, experience.offsetHeight );
    renderer.setPixelRatio( experience.devicePixelRatio );
    experience.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();  
    // camera
    camera = new THREE.PerspectiveCamera( 40, experience.offsetWidth / experience.offsetHeight, 1, 10000 );
    camera.position.set( 20, 20, 20 );
    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    // ambient
    scene.add( new THREE.AmbientLight(0xFFFFFF, 0.5) );
    // light
    var light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20,20, 0 );
    scene.add( light );
    // axes
    scene.add( new THREE.AxesHelper( 20 ) );
    // mesh
        const loader = new GLTFLoader();
        loader.load( '/HUMAN.glb', function ( gltf ) {
    
            mesh = gltf.scene.children[ 0 ];
            console.log(mesh);
            scene.add( mesh );
            mesh.scale.set(  8,8,8 );
            mesh.position.set(0,-10,0)
    
        } );
		// decal related stuff 
		mouse = new THREE.Vector2();
		raycaster = new THREE.Raycaster();
		helper = new THREE.Object3D();
    

        function onPointerMove( event ) {

            // calculate pointer position in normalized device coordinates
            // (-1 to +1) for both components
        
            mouse.x = ( event.clientX / experience.offsetWidth ) * 2 - 1;
            mouse.y = - ( event.clientY / experience.offsetHeight ) * 2 + 1;
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
        wireframe: false,
        side: THREE.FrontSide
    });

})

// event.preventDefault();

window.addEventListener('dblclick', (event)=> {
    let aspectRatio = image.naturalWidth / image.naturalHeight

    mouse.x = ( event.clientX / experience.offsetWidth ) * 2 - 1;
mouse.y = - ( event.clientY / experience.offsetHeight ) * 2 + 1;

raycaster.setFromCamera( mouse, camera );
var intersects = raycaster.intersectObject( mesh );
console.log(intersects);

if ( intersects.length > 0 ) {
console.log(intersects[0]);
    var n = intersects[ 0 ].face.normal.clone();
    n.transformDirection(mesh.matrixWorld);
    n.add(intersects[0].point);



    var position = intersects[ 0 ].point
    console.log("pos", position);


    var size = new THREE.Vector3( aspectRatio , 1, 1 );

	decalGeometry = new DecalGeometry( mesh, position, helper.rotation, size );
    
                console.log("decal", decalGeometry);
    var decal = new THREE.Mesh( decalGeometry, decalMaterial );
    scene.add( decal );
    console.log("here decal", decal);
}
})
		
}



function animate() {
   
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    camera.updateProjectionMatrix();
}
