import * as THREE from '../build/three.module.js';

import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

var camera, scene, renderer;
var planets;
var panel;
var speed, real_planet_size, real_orbit_size, real_orbit_speed, real_rev_speed;
var cameraControls;
class Planet {
    constructor(name){
        this.name = name
        this.orbDistDemo = 11
        this.orbDistReal = 100
        this.orbTiltReal = 0
        this.orbSpeedDemo = 0
        this.orbSpeedReal = 0
        this.revSpeedDemo = 0
        this.revSpeedReal = 0
        this.sizeDemo = 20
        this.sizeReal = 20
        this.material = null
        this.obj = null
        this.empty = null
        this.id = null
        this.label = null
    }
}
init();
animate();
function init() {
    //GEOEMTRY
    var geoSphere = new THREE.SphereGeometry(10,32,32)
    var labelGeometry = new THREE.Geometry(); labelGeometry.vertices.push(new THREE.Vector3());
    //MATERIALS + textures

    var matYellow0 = new THREE.MeshLambertMaterial( { color: 0xf2f23d} );
    var matYellow = new THREE.MeshLambertMaterial( { color: 0xfff396} );
    var matGray = new THREE.MeshLambertMaterial( { color: 0xd7dbda} );
    var matOrange = new THREE.MeshLambertMaterial( { color: 0xad8031} );
    var matBlue = new THREE.MeshLambertMaterial( { color: 0x1111FF} );
    var matRed = new THREE.MeshLambertMaterial( { color: 0xfa744b} );
    var matRings = new THREE.MeshLambertMaterial( { color: 0xa3996f} );
    var matBlue2 = new THREE.MeshLambertMaterial( { color: 0x8ce6ce} );
    var matBlue3 = new THREE.MeshLambertMaterial( { color: 0x567ab0} );
    var textureLoader = new THREE.TextureLoader()
    var texSun = textureLoader.load( "textures/2k_sun.jpg");
    var texMercury = textureLoader.load( "textures/2k_mercury.jpg");
    var texVenus = textureLoader.load( "textures/2k_venus_atmosphere.jpg");
    var texEarth = textureLoader.load( "textures/urf.jpg");
    var texMars = textureLoader.load( "textures/2k_mars.jpg");
    var texJupiter = textureLoader.load( "textures/2k_jupiter.jpg");
    var texSaturn = textureLoader.load( "textures/2k_saturn.jpg");
    var texUranus = textureLoader.load( "textures/2k_uranus.jpg");
    var texNeptune = textureLoader.load( "textures/2k_neptune.jpg");
    var texMoon = textureLoader.load( "textures/mooon.jpg");
    var texRings = textureLoader.load("textures/rings spun.png");

    var texBG = textureLoader.load( "textures/2k_stars_milky_way_OVERBLOWN.jpg");
    var matSun = new THREE.MeshBasicMaterial({map: texSun})
    var matMercury = new THREE.MeshLambertMaterial({map: texMercury})
    var matVenus = new THREE.MeshLambertMaterial({map: texVenus})
    var matEarth = new THREE.MeshPhongMaterial({  map: texEarth  })
    var matMars = new THREE.MeshLambertMaterial({map: texMars})
    var matJupiter = new THREE.MeshLambertMaterial({map: texJupiter})
    var matSaturn = new THREE.MeshLambertMaterial({map: texSaturn})
    var matUranus = new THREE.MeshLambertMaterial({map: texUranus})
    var matNeptune = new THREE.MeshLambertMaterial({map: texNeptune})
    var matMoon = new THREE.MeshLambertMaterial({map: texMoon})
    // var matRings = new THREE.MeshLambertMaterial({map: texRings,transparent: true, opacity: 1, side: THREE.DoubleSide, emissive: 0xFFFFFF ,emissiveIntensity: 0})
    var matRings = new THREE.MeshLambertMaterial({map: texRings,transparent: true, opacity: 1, side: THREE.DoubleSide})

    // var matLabelEarth = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/earthLabel.png"), transparent: true, size: 80, sizeAttenuation: false })

    var matLabelSun     = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/SunLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelMercury = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/MercuryLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelVenus   = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/VenusLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelEarth   = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/EarthLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelMars    = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/MarsLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelJupiter = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/JupiterLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelSaturn  = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/SaturnLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelUranus  = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/UranusLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelNeptune = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/NeptuneLabel.png"), transparent: true, size: 180, sizeAttenuation: false })
    var matLabelMoon    = new THREE.PointsMaterial({map: textureLoader.load( "textures/Labels/MoonLabel.png"), transparent: true, size: 180, sizeAttenuation: false })


    //PLANET DATA
    // https://nssdc.gsfc.nasa.gov/planetary/factsheet/
    var planetNames     = ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune", "moon", "rings"]
    var orbTilts        = [0, 7.01, 3.39, 0, 1.85, 1.31, 2.49, 0.77, 1.77, 5.15, 0] //in degrees
    var orbDistsDemo    = [0, 70, 90, 110, 140, 200, 230, 255, 280, 22, 0]
    var orbDistsReal    = [0, 57000000, 108000000, 149000000, 228000000, 780000000, 1437000000, 2871000000, 4530000000, 411500, 0] // in km 
    var orbSpeedsDemo   = [0, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.085, 0]
    var orbSpeedsReal   = [0, 1/88.0, 1/224.7, 1/365.2, 1/687.0, 1/4331, 1/10747, 1/30589, 1/59800, 1/30, 0] // in days
    var revSpeedsDemo   = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
    var revSpeedsReal   = [3, 1/1407.6, 1/-5832.5, 1/23.9, 1/24.6, 1/9.9, 1/10.7, 1/-17.2, 1/16.1, 1/30, 0] 
    var sizesDemo       = [500, 60, 95, 100, 70, 150, 140, 120, 110, 20, 160]
    var sizesReal       = [695510, 2440, 6052, 6378, 3396, 71492, 60268, 25559, 24764, 1737.5, 13549] //in km
    var mats            = [matSun, matMercury,matVenus,matEarth,matMars,matJupiter,matSaturn,matUranus,matNeptune, matMoon, matRings]
    var labels          = [matLabelSun, matLabelMercury, matLabelVenus, matLabelEarth, matLabelMars, matLabelJupiter, matLabelSaturn, matLabelUranus, matLabelNeptune, matLabelMoon]
    //RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    
    //CAMERA
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000000 );
    camera.position.z = 400;
    cameraControls = new OrbitControls( camera, renderer.domElement );

    
    //STARRY BACKGROUND
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    for ( var i = 0; i < 10000; i ++ ) {
        vertices.push( THREE.Math.randFloatSpread( 20000000 ) ); // x
        vertices.push( THREE.Math.randFloatSpread( 20000000 ) ); // y
        vertices.push( THREE.Math.randFloatSpread( 20000000 ) ); // z
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    var points = new THREE.Points( geometry, new THREE.PointsMaterial( { color: 0x888888 } ) );
    scene.add( points );
    
    //LIGHTS
    // var ambient = new THREE.AmbientLight( {color: 0x000000, intensity: 0.0} );
    var light = new THREE.PointLight(new THREE.Color(0.8, 0.8, 1),2)
    // light.position.y=100
    var hemi1 = new THREE.HemisphereLight(new THREE.Color(0.8, 0.8, 1),new THREE.Color(0.8, 0.8, 1), 0.35)
    scene.add(light)
    scene.add(hemi1)
    
    
    //PLANETS SETUP
    planets = []
    for (let index = 0; index < planetNames.length; index++) {
        planets.push(new Planet(planetNames[index]))
        planets[index].orbDistDemo  = orbDistsDemo[index]
        planets[index].orbDistReal  = orbDistsReal[index]/10000
        planets[index].orbTiltReal  = 0
        planets[index].orbSpeedDemo = orbSpeedsDemo[index]
        planets[index].orbSpeedReal = orbSpeedsReal[index]/86400/60*10000000
        planets[index].sizeDemo     = sizesDemo[index]
        planets[index].sizeReal     = sizesReal[index]/10000
        planets[index].revSpeedDemo = (revSpeedsDemo[index])/1000;
        planets[index].revSpeedReal = revSpeedsReal[index]/1000;
        planets[index].material = mats[index]
        planets[index].empty = new THREE.Object3D()
        planets[index].obj = new THREE.Mesh(geoSphere,planets[index].material)
        planets[index].id = index
        planets[index].label = new THREE.Points(labelGeometry,labels[index])
    }
    for (const planet of planets) {
        planet.obj.position.x = planet.orbDistDemo;
        planet.empty.rotation.x = planet.orbTiltReal;
        planet.obj.scale.x = planet.sizeDemo
        planet.obj.scale.y = planet.sizeDemo
        planet.obj.scale.z = planet.sizeDemo
        scene.add(planet.empty)
        scene.add(planet.obj)
        planet.obj.parent = planet.empty
        planet.obj.add(planet.label)
    }
    var moon = planets[9]
    var earth = planets[3]
    moon.empty.position.x = earth.obj.position.x ;
    moon.empty.parent = earth.empty ;
    moon.obj.parent = moon.empty ;
    var saturn = planets[6]
    var rings = planets[10]
    scene.remove(rings.obj)
    // rings.obj = new THREE.Mesh(new THREE.TorusGeometry(10,2,32,32), rings.material)
    // rings.obj = new THREE.Mesh(new THREE.SphereGeometry(8,32,3), rings.material)
    rings.obj = new THREE.Mesh(new THREE.PlaneGeometry(35,35,64,64), rings.material)
    // rings.empty.parent = saturn.empty ;
    rings.obj.rotation.x = -Math.PI/2+0.01
    // rings.obj.parent = rings.empty ;
    saturn.obj.add(rings.obj)
    saturn.obj.castShadow = true
    rings.obj.receiveShadow = true
    // rings.obj.scale.set = (1,2,1)
    // rings.obj.scale.z = 4
    // console.log(rings.obj.scale.z)
    // rings.obj.scale.x = rings.sizeDemo
    // rings.empty.position.x = saturn.obj.position.x
    // rings.obj.position.x = saturn.obj.position.x
    // rings.obj.rotation.z = 100
    
    // var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    // var material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
    // var torus = new THREE.Mesh( geometry, material );
    // scene.add( torus );
    
    //LABELS
    var matLabel = new THREE.PointsMaterial({
        map: texSun,
        transparent: true,
        size: 80,
        sizeAttenuation: false
    })
    var labelGeometry = new THREE.Geometry(); labelGeometry.vertices.push(new THREE.Vector3());
    var label = new THREE.Points(labelGeometry,matLabel);
    label.position.y = 30
    // planets[3].obj.add(label)

    
    //WINDOW
    window.addEventListener( 'resize', onWindowResize, false );
    
    setupGUI();
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
// function setupGUI0(){
//     panel = {
//         shininess: 40.0,
//         ka: 0.17,
//         kd: 0.51,
//         ks: 0.2,
//         metallic: true,
//         hue:	0.121,
//         saturation: 0.73,
//         lightness: 0.66,
//         lhue:	0.04,
//         lsaturation: 0.01,	// non-zero so that fractions will be shown
//         llightness: 1.0,
//         // bizarrely, if you initialize these with negative numbers, the sliders
//         // will not show any decimal places.
//         lx: 0.32,
//         ly: 0.39,
//         lz: 0.7,
//         newTess: 15,
//         bottom: true,
//         lid: true,
//         body: true,
//         fitLid: false,
//         nonblinn: false,
//         newShading: "glossy"
//     };
//     var h;
//     var gui = new GUI();
//     // material (attributes)
//     h = gui.addFolder( "Material control" );
//     h.add( panel, "shininess", 1.0, 400.0, 1.0 ).name( "shininess" ).onChange( render );
//     h.add( panel, "kd", 0.0, 1.0, 0.025 ).name( "diffuse strength" ).onChange( render );
//     h.add( panel, "ks", 0.0, 1.0, 0.025 ).name( "specular strength" ).onChange( render );
//     h.add( panel, "metallic" ).onChange( render );
//     // material (color)
//     h = gui.addFolder( "Material color" );
//     h.add( panel, "hue", 0.0, 1.0, 0.025 ).name( "hue" ).onChange( render );
//     h.add( panel, "saturation", 0.0, 1.0, 0.025 ).name( "saturation" ).onChange( render );
//     h.add( panel, "lightness", 0.0, 1.0, 0.025 ).name( "lightness" ).onChange( render );
//     // light (point)
//     h = gui.addFolder( "Lighting" );
//     h.add( panel, "lhue", 0.0, 1.0, 0.025 ).name( "hue" ).onChange( render );
//     h.add( panel, "lsaturation", 0.0, 1.0, 0.025 ).name( "saturation" ).onChange( render );
//     h.add( panel, "llightness", 0.0, 1.0, 0.025 ).name( "lightness" ).onChange( render );
//     h.add( panel, "ka", 0.0, 1.0, 0.025 ).name( "ambient" ).onChange( render );
//     // light (directional)
//     h = gui.addFolder( "Light direction" );
//     h.add( panel, "lx", - 1.0, 1.0, 0.025 ).name( "x" ).onChange( render );
//     h.add( panel, "ly", - 1.0, 1.0, 0.025 ).name( "y" ).onChange( render );
//     h.add( panel, "lz", - 1.0, 1.0, 0.025 ).name( "z" ).onChange( render );
//     h = gui.addFolder( "Tessellation control" );
//     h.add( panel, "newTess", [ 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ] ).name( "Tessellation Level" ).onChange( render );
//     h.add( panel, "lid" ).name( "display lid" ).onChange( render );
//     h.add( panel, "body" ).name( "display body" ).onChange( render );
//     h.add( panel, "bottom" ).name( "display bottom" ).onChange( render );
//     h.add( panel, "fitLid" ).name( "snug lid" ).onChange( render );
//     h.add( panel, "nonblinn" ).name( "original scale" ).onChange( render );
//     // shading
//     gui.add( panel, "newShading", [ "wireframe", "flat", "smooth", "glossy", "textured", "reflective" ] ).name( "Shading" ).onChange( render );
// }
function setupGUI(){
    panel = {
        orbScale: 1,
        real_orbit_speed: false,
        real_orbit_size: false,
        real_revolution_speed: false,
        real_planet_size: false,
        real_rev_speed: false,
        labels: true
    };
    // var h;
    var gui = new GUI()
    // h = gui.addfolder("ff");
    gui.add(panel, "orbScale", 0.1, 20, 0.025).name("Orbit Scale").onChange( changeOrbitSize)
    gui.add(panel, "real_planet_size").name("Real Planet Size?")
    gui.add(panel, "real_orbit_size").name("Real Orbit Size?").onChange( changeOrbitSize)
    gui.add(panel, "real_orbit_speed").name("Real Orbit Speed? (x10mil)")
    gui.add(panel, "labels").name("Display Labels?").onChange(toggleLabels)
    // gui.add(panel, "real_rev_speed").name("Real Revolution Speed?")
    // .onChange( animate )
}
function animate() {
    // console.log(camera )
    requestAnimationFrame( animate );
    
    for (const planet of planets) {
        // console.log(planet)
        // console.log(planet.obj.position.x)
        
        if (panel.real_orbit_speed == true){
            planet.empty.rotation.y += planet.orbSpeedReal
        }else{
            
            planet.empty.rotation.y += planet.orbSpeedDemo
        }
        if (panel.real_orbit_size == true){
            planet.obj.position.x = 30000
            planet.obj.position.x = planet.orbDistReal
        }
        else{
            // console.log(planet.orbDistDemo)
            // planet.obj.position.x = 30
            // planet.obj.position.x = planet.orbDistdemo
        }
        if (panel.real_rev_speed == true){
            planet.obj.rotation.y += planet.revSpeedReal
        }else{
            planet.obj.rotation.y += planet.revSpeedDemo
        }
        if (panel.real_planet_size == true){
            planet.obj.scale.x = planet.sizeReal
            planet.obj.scale.y = planet.sizeReal
            planet.obj.scale.z = planet.sizeReal
        }else{
            planet.obj.scale.x = planet.sizeDemo/100
            planet.obj.scale.y = planet.sizeDemo/100
            planet.obj.scale.z = planet.sizeDemo/100
        }
    }

    renderer.render( scene, camera );
}
function changeOrbitSize(){
    if (panel.real_orbit_size == true){
        for (const planet of planets) {
            planet.obj.position.x = planet.orbDistReal*panel.orbScale;
        }
    }else{
        for (const planet of planets) {
            planet.obj.position.x = planet.orbDistDemo*panel.orbScale;
        }
    }
    planets[9].empty.position.x = planets[3].obj.position.x ;
    
}
function toggleLabels(){
    if (panel.labels == false){
        for (const planet of planets) {
            planet.label.visible = false
        }
    }else{
        for (const planet of planets) {
            planet.label.visible = true
        }
    }
}