/**
 * Created by marwa_000 on 16/02/2017.
 */

var text;
var color_user;
var testupdatercolor;
var size;
var type_text1;
var color_backround;
var Opacity;
var Height;
var CurveSegments;
var BevelThickness;
var BevelSize;
var BevelEnabled;
var Steps;
var HSL;
var time1;
var time_rotate;
var blending;


$.ajax({
    dataType: "json",
    url: "file.json",

    success: function (html) {
        text = html["text"];
        color_user = html["color"];
        testupdatercolor = html["update_color"];
        size = html["size"];
        type_text1 = html["font"];
        color_backround = html["color_backround"];
        Opacity = html["Opacity"];
        Height = html["Height"];
        CurveSegments = html["CurveSegments"];
        BevelThickness = html["BevelThickness"];
        BevelSize = html["BevelSize"];
        BevelEnabled = html["BevelEnabled"];
        Steps = html["Steps"];
        HSL = html["HSL"];
        time1 = html["time"];
        time_rotate = html["time_rotate"];
        blending = html["blending"];


    }
});


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats;

var object, uniforms;

var loader = new THREE.FontLoader();
setTimeout(function(){
    var font1;

    if(type_text1=="1"){
        font1= "js/optimer_regular.typeface.json";
    }else if(type_text1=="2"){
        font1= "js/helvetiker_bold.typeface.json";
    }else if(type_text1=="3"){
        font1= "js/gentilis_regular.typeface.json";
    }else if(type_text1=="4"){
        font1= "js/Halis_GR_S_Black_Regular.json";
    }

    loader.load( font1 , function ( font1 ) {

        init( font1 );
        animate();

    } );

}, 200);


function init( font ) {

    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 400;

    scene = new THREE.Scene();

    uniforms = {

        amplitude: { value: 5.0 },
        opacity:   { value: Opacity },
        color:     { value: new THREE.Color( color_user ) }

    };

    var shaderMaterial = new THREE.ShaderMaterial( {

        uniforms:       uniforms,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        blending:       blending,
        depthTest:      false,
        transparent:    true

    });


    var geometry = new THREE.TextGeometry( text, {

        font: font,

        size: size,
        height: Height,
        curveSegments: CurveSegments,

        bevelThickness: BevelThickness,
        bevelSize: BevelSize,
        bevelEnabled: BevelEnabled,
        bevelSegments: 10,

        steps: Steps

    } );

    geometry.center();

    var vertices = geometry.vertices;

    var buffergeometry = new THREE.BufferGeometry();

    var position = new THREE.Float32BufferAttribute( vertices.length * 3, 3 ).copyVector3sArray( vertices );
    buffergeometry.addAttribute( 'position', position );

    var displacement = new THREE.Float32BufferAttribute( vertices.length * 3, 3 );
    buffergeometry.addAttribute( 'displacement', displacement );

    var customColor = new THREE.Float32BufferAttribute( vertices.length * 3, 3 );
    buffergeometry.addAttribute( 'customColor', customColor );

    var color = new THREE.Color( 0xffffff );

    for( var i = 0, l = customColor.count; i < l; i ++ ) {

        color.setHSL( i / l, HSL, HSL );
        color.toArray( customColor.array, i * customColor.itemSize );

    }

    object = new THREE.Line( buffergeometry, shaderMaterial );
    object.rotation.x = 0.2;
    scene.add( object );

    renderer = new THREE.WebGLRenderer( { antialias: true } );

    renderer.setClearColor( color_backround );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );

    //stats = new Stats();
    //container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
    //	stats.update();

}

function render() {

    var time = Date.now() * 0.001;

    object.rotation.y = time_rotate * time;

    uniforms.amplitude.value = Math.sin( time1 * time );
    if(testupdatercolor=="true"){
        uniforms.color.value.offsetHSL( 0.0005, 0, 0 );
    }


    var attributes = object.geometry.attributes;
    var array = attributes.displacement.array;

    for ( var i = 0, l = array.length; i < l; i += 3 ) {

        array[ i     ] += 0.3 * ( 0.5 - Math.random() );
        array[ i + 1 ] += 0.3 * ( 0.5 - Math.random() );
        array[ i + 2 ] += 0.3 * ( 0.5 - Math.random() );

    }

    attributes.displacement.needsUpdate = true;

    renderer.render( scene, camera );

}


function getJSONP(url, success) {

    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0]
            || document.documentElement;

    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };

    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);

}



