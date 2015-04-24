'use strict';

angular.module('myApp.particle', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/particle', {
    templateUrl: 'particle/particle.html',
    controller: 'particleViewController'
  });
}])

.controller('particleViewController', [function() {

      var camera, scene, renderer;

      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      var mouseX = 0, mouseY = 0;

      var particleSystem;

      init();
      animate();

      function init() {

        //

        camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 5, 3500 );
        camera.position.z = 2750;

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

        // geometry
        var particles = 500000;
        var geometry = new THREE.BufferGeometry();
        var positions = new Float32Array( particles * 3 );
        var colors = new Float32Array( particles * 3 );
        var color = new THREE.Color();
        var n = 1000, n2 = n / 2; // particles spread in the cube
        for ( var i = 0; i < positions.length; i += 3 ) {
          // positions
          var x = Math.random() * n - n2;
          var y = Math.random() * n - n2;
          var z = Math.random() * n - n2;
          positions[ i ]     = x;
          positions[ i + 1 ] = y;
          positions[ i + 2 ] = z;

          // colors
          var vx = ( x / n ) + 0.5;
          var vy = ( y / n ) + 0.5;
          var vz = ( z / n ) + 0.5;
          color.setRGB( vx, vy, vz );
          colors[ i ]     = color.r;
          colors[ i + 1 ] = color.g;
          colors[ i + 2 ] = color.b;

        }
        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
        geometry.computeBoundingSphere();


        var text = "three.js",

            height = 200,
            size = 700,
            hover = 300,

            curveSegments = 4,

            bevelThickness = 2,
            bevelSize = 1.5,
            bevelSegments = 3,
            bevelEnabled = true,

            font = "optimer", // helvetiker, optimer, gentilis, droid sans, droid serif
            weight = "bold", // normal bold
            style = "normal"; // normal italic
        var textGeo = new THREE.TextGeometry( text, {

          size: size,
          height: height,
          curveSegments: curveSegments,

          //font: font,
          //weight: weight,
          //style: style,

          bevelThickness: bevelThickness,
          bevelSize: bevelSize,
          bevelEnabled: bevelEnabled,

          material: 0,
          extrudeMaterial: 1

        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        // material
        var material = new THREE.PointCloudMaterial( { size: 15, vertexColors: THREE.VertexColors } );

        particleSystem = new THREE.PointCloud( geometry, material );
        scene.add( particleSystem );

        //

        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setClearColor( scene.fog.color );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

        //event
        window.addEventListener( 'resize', onWindowResize, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'touchstart', onDocumentTouchStart, false );
        document.addEventListener( 'touchmove', onDocumentTouchMove, false );
      }

      // render
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
      function render() {
        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        var time = Date.now() * 0.001;
        particleSystem.rotation.x = time * 0.25;
        particleSystem.rotation.y = time * 0.5;

        renderer.render( scene, camera );
      }

      // window event
      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
      }

      // mouse event
      function onDocumentMouseMove( event ) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
      }
      function onDocumentTouchStart( event ) {
        if ( event.touches.length === 1 ) {
          event.preventDefault();
          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
      }
      function onDocumentTouchMove( event ) {
        if ( event.touches.length === 1 ) {
          event.preventDefault();
          mouseX = event.touches[ 0 ].pageX - windowHalfX;
          mouseY = event.touches[ 0 ].pageY - windowHalfY;
        }
      }


}]);