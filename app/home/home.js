'use strict';

angular.module('myApp.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeViewController'
        });
    }])

    .controller('homeViewController', [function() {

        var imageScale=1;
        var particleScale=10;

        var faceImage, container, canvas, ctx;
        var camera, scene, renderer;

        var windowHalfX = window.innerWidth / 2;
        var windowHalfY = window.innerHeight / 2;
        var mouseX = 0, mouseY = 0;

        var goButton;

        init();

        function init() {
            // event
            faceImage = document.getElementById('face');
            faceImage.addEventListener('load', onImageLoad, false);

            container = document.getElementById('container');
            container.addEventListener('mousemove', onDocumentMouseMove, false);
            container.addEventListener('touchstart', onDocumentTouchStart, false);
            container.addEventListener('touchmove', onDocumentTouchMove, false);

            window.addEventListener('resize', onWindowResize, false);
        }

        // image
        function onImageLoad() {
            // init canvas&ctx
            canvas = document.getElementById('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx = canvas.getContext('2d');

            // init camera
            camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 5, 3500);
            camera.position.z = 2750;

            // init scene
            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x050505, 2000, 3500);

            // geometry
            var positions = getParticles('face', 100, 100);
            var colors = getColors('face', 100, 100);
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.computeBoundingSphere();

            // material
            var material = new THREE.PointCloudMaterial({size: 15, vertexColors: THREE.VertexColors});

            // particle system
            var particleSystem = new THREE.PointCloud(geometry, material);
            scene.add(particleSystem);

            // render
            renderer = new THREE.WebGLRenderer({antialias: false});
            renderer.setClearColor(scene.fog.color);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);

            container.appendChild(renderer.domElement);

            // start
            animate();
        }
        function getParticles(id, w, h, z) {
            if (z == undefined) { z = 0; }
            var image = document.getElementById(id);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, w, h, canvas.width/2-w/2*imageScale, canvas.height/2-h/2*imageScale, w*imageScale, h*imageScale);

            var imageData = ctx.getImageData(canvas.width/2-w/2*imageScale, canvas.height/2-h/2*imageScale, w*imageScale, h*imageScale);
            var particles = new Float32Array(imageData.width*imageData.height*3);
            for (var x = 0; x < imageData.width; x ++) {
                for (var y = 0; y < imageData.height; y ++) {
                    //var i = 4*(x * imageData.height + y);
                    var i = 4*(y * imageData.width + x);
                    var red=imageData.data[i + 0];
                    var green=imageData.data[i + 1];
                    var blue=imageData.data[i + 2];
                    var alpha=imageData.data[i + 3];
                    if (alpha > 128) { // alpha>0.5
                        var particleIndex = 3*(y * imageData.width + x);
                        particles[particleIndex] = (x-imageData.width/2)*particleScale+imageData.width/2;
                        particles[particleIndex + 1] = -(y-imageData.height/2)*particleScale+imageData.height/2;
                        particles[particleIndex + 2] = (red+green+blue)/3;
                    }
                }
            }
            return particles;
        }
        function getColors(id, w, h, z) {
            if (z == undefined) { z = 0; }
            var image = document.getElementById(id);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, w, h, canvas.width/2-w/2*imageScale, canvas.height/2-h/2*imageScale, w*imageScale, h*imageScale);

            var imageData = ctx.getImageData(canvas.width/2-w/2*imageScale, canvas.height/2-h/2*imageScale, w*imageScale, h*imageScale);
            var colors = new Float32Array(imageData.width*imageData.height*3);
            for (var x = 0; x < imageData.width; x ++) {
                for (var y = 0; y < imageData.height; y ++) {
                    //var i = 4*(x * imageData.height + y);
                    var i = 4*(y * imageData.width + x);
                    var red=imageData.data[i + 0]
                    var green=imageData.data[i + 1];
                    var blue=imageData.data[i + 2];
                    var alpha=imageData.data[i + 3];
                    if (alpha > 128) { // alpha>0.5
                        var colorIndex = 3*(y * imageData.width + x);
                        colors[colorIndex] = red/255;
                        colors[colorIndex + 1] = green/255;
                        colors[colorIndex + 2] = blue/255;
                    }
                }
            }
            return colors;
        }

        // render
        function animate() {
            requestAnimationFrame( animate );
            render();
        }
        function stopRender() {
            cancelRequestAnimationFrame( animate );
        }
        function render() {
            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;
            camera.lookAt( scene.position );

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