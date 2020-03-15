(function() {

    /**
     * @author qiao / https://github.com/qiao
     * @author mrdoob / http://mrdoob.com
     * @author alteredq / http://alteredqualia.com/
     * @author WestLangley / http://github.com/WestLangley
     * @author erich666 / http://erichaines.com
     * @author shawn0326 / http://halflab.me
     */

    // This set of controls performs orbiting, dollying (zooming), and panning.
    // Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
    //
    //    Orbit - left mouse / touch: one-finger move
    //    Dolly - middle mouse, or mousewheel / touch: two-finger spread or squish
    //    Pan - right mouse, or arrow keys / touch: two-finger move

    function OrbitControls(object, domElement) {

        this.object = object;

        this.domElement = ( domElement !== undefined) ? domElement : document;

        // Set to false to disable this control
        this.enabled = true;

        // "target" sets the location of focus, where the object orbits around
        this.target = new zen3d.Vector3();

        // How far you can dolly in and out
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        // How far you can orbit horizontally, upper and lower limits.
        // If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
        this.minAzimuthAngle = - Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = true;
        this.dampingFactor = 0.25;

        // This option enables dollying in and out.
        // Set to false to disable dollying
        this.enableDollying = true;
        this.dollyingSpeed = 1.0;

        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 0.25;

        // Set to false to disable panning
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = false; // if true, pan in screen-space
        this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

        // Set to true to automatically rotate around the target
        // If auto-rotate is enabled, you must call controls.update() in your animation loop
        this.autoRotate = false;
        this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

        // Set to false to disable use of the keys
        this.enableKeys = true;

        // The four arrow keys
        this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

        // Mouse buttons
        this.mouseButtons = { ORBIT: 0, DOLLY: 1, PAN: 2 };
        
        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        
        //
        // public methods
        //

        this.getPolarAngle = function () {

            return spherical.phi;

        };

        this.getAzimuthalAngle = function () {

            return spherical.theta;

        };

        this.saveState = function () {

            scope.target0.copy( scope.target );
            scope.position0.copy( scope.object.position );

        };

        this.reset = function () {

            scope.target.copy( scope.target0 );
            scope.object.position.copy( scope.position0 );

            // scope.update();
    
            state = STATE.NONE;
    
        };

        this.update = function() {

            var offset = new zen3d.Vector3();

            var lastPosition = new zen3d.Vector3();
            var lastQuaternion = new zen3d.Quaternion();

            return function update() {

                var position = scope.object.position;
                
                offset.copy( position ).sub( scope.target );

                // TODO rotate offset to "y-axis-is-up" space

                // angle from z-axis around y-axis
                spherical.setFromVector3( offset );
                
                if ( scope.autoRotate && state === STATE.NONE ) {

                    rotateLeft( getAutoRotationAngle() );
    
                }

                spherical.theta += sphericalDelta.theta;
                spherical.phi += sphericalDelta.phi;
                
                // restrict theta to be between desired limits
                spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

                // restrict phi to be between desired limits
                spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

                spherical.makeSafe();


                spherical.radius *= scale;

                // restrict radius to be between desired limits
                spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

                // move target to panned location
                scope.target.add( panOffset );
                
                offset.setFromSpherical( spherical );

                // TODO rotate offset back to "camera-up-vector-is-up" space

                position.copy( scope.target ).add( offset );

                scope.object.lookAt( scope.target, defaultUp );

                if ( scope.enableDamping === true ) {

                    sphericalDelta.theta *= ( 1 - scope.dampingFactor );
                    sphericalDelta.phi *= ( 1 - scope.dampingFactor );
    
                    panOffset.multiplyScalar( 1 - scope.dampingFactor );
    
                } else {
    
                    sphericalDelta.set( 0, 0, 0 );
    
                    panOffset.set( 0, 0, 0 );
    
                }

                scale = 1;

                // update condition is:
                // min(camera displacement, camera rotation in radians)^2 > EPS
                // using small-angle approximation cos(x/2) = 1 - x^2 / 8

                if ( lastPosition.distanceToSquared( scope.object.position ) > EPS ||
                    8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {
               
                    lastPosition.copy( scope.object.position );
                    lastQuaternion.copy( scope.object.quaternion );
    
                    return true;
    
                }

                return false;

            };

        }();

        this.dispose = function () {

            scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
            scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
            scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );
    
            scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
            scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
            scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );
    
            document.removeEventListener( 'mousemove', onMouseMove, false );
            document.removeEventListener( 'mouseup', onMouseUp, false );
    
            window.removeEventListener( 'keydown', onKeyDown, false );
    
        };

        //
        // internals
        //

        var scope = this;

        var STATE = { NONE: - 1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY_PAN: 4 };

        var state = STATE.NONE;

        var EPS = 0.000001;

        var defaultUp = new zen3d.Vector3(0, 1, 0);
        
        // current position in spherical coordinates
        var spherical = new zen3d.Spherical();
        var sphericalDelta = new zen3d.Spherical();

        var scale = 1;
	    var panOffset = new zen3d.Vector3();

        var rotateStart = new zen3d.Vector2();
        var rotateEnd = new zen3d.Vector2();
        var rotateDelta = new zen3d.Vector2();

        var panStart = new zen3d.Vector2();
        var panEnd = new zen3d.Vector2();
        var panDelta = new zen3d.Vector2();

        var dollyStart = new zen3d.Vector2();
        var dollyEnd = new zen3d.Vector2();
        var dollyDelta = new zen3d.Vector2();

        function getAutoRotationAngle() {

            return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
    
        }

        function getDollyingScale() {

            return Math.pow( 0.95, scope.dollyingSpeed );

        }

        function rotateLeft( angle ) {

            sphericalDelta.theta -= angle;
    
        }

        function rotateUp( angle ) {

            sphericalDelta.phi -= angle;
    
        }

        var panLeft = function () {

            var v = new zen3d.Vector3();
    
            return function panLeft( distance, objectMatrix ) {
    
                v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
                v.multiplyScalar( - distance );
    
                panOffset.add( v );
    
            };
    
        }();

        var panUp = function () {

            var v = new zen3d.Vector3();
    
            return function panUp( distance, objectMatrix ) {
    
                if ( scope.screenSpacePanning === true ) {
    
                    v.setFromMatrixColumn( objectMatrix, 1 );
    
                } else {
    
                    v.setFromMatrixColumn( objectMatrix, 0 );
                    v.crossVectors( defaultUp, v );
    
                }
    
                v.multiplyScalar( distance );
    
                panOffset.add( v );
    
            };
    
        }();

        // deltaX and deltaY are in pixels; right and down are positive
        var pan = function () {

            var offset = new zen3d.Vector3();

            var project = new zen3d.Matrix4();
            var projectInv = new zen3d.Matrix4();

            var p = new zen3d.Vector3();

            return function pan( deltaX, deltaY ) {

                var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

                var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
                var targetDistance = offset.getLength();

                project.copy(scope.object.projectionMatrix);
                projectInv.getInverse(project);

                var depth = p.set(0, 0, targetDistance).applyMatrix4(project).z;

                // full-screen to world distance
                var distance = p.set(0, -0.5, depth).applyMatrix4(projectInv).y;
                distance *= 2;

                // we use only clientHeight here so aspect ratio does not distort speed
                panLeft( deltaX * distance / element.clientHeight, scope.object.matrix );
                panUp( deltaY * distance / element.clientHeight, scope.object.matrix );

            };

        }();

        function dollyIn( dollyScale ) {

            scale /= dollyScale;
    
        }

        function dollyOut( dollyScale ) {

            scale *= dollyScale;

        }

        //
        // event callbacks - update the object state
        //

        function handleMouseDownRotate( event ) {

            //console.log( 'handleMouseDownRotate' );
    
            rotateStart.set( event.clientX, event.clientY );
    
        }
    
        function handleMouseDownDolly( event ) {
    
            //console.log( 'handleMouseDownDolly' );
    
            dollyStart.set( event.clientX, event.clientY );
    
        }
    
        function handleMouseDownPan( event ) {
    
            //console.log( 'handleMouseDownPan' );
    
            panStart.set( event.clientX, event.clientY );
    
        }

        function handleMouseMoveRotate( event ) {

            //console.log( 'handleMouseMoveRotate' );
    
            rotateEnd.set( event.clientX, event.clientY );
    
            rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );
    
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
    
            // rotating across whole screen goes 360 degrees around
            rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth );
    
            // rotating up and down along whole screen attempts to go 360, but limited to 180
            rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );
    
            rotateStart.copy( rotateEnd );
    
            // scope.update();
    
        }

        function handleMouseMoveDolly( event ) {

            //console.log( 'handleMouseMoveDolly' );
    
            dollyEnd.set( event.clientX, event.clientY );
    
            dollyDelta.subVectors( dollyEnd, dollyStart );
    
            if ( dollyDelta.y > 0 ) {
    
                dollyIn( getDollyingScale() );
    
            } else if ( dollyDelta.y < 0 ) {
    
                dollyOut( getDollyingScale() );
    
            }
    
            dollyStart.copy( dollyEnd );
    
            // scope.update();
    
        }

        function handleMouseMovePan( event ) {

            //console.log( 'handleMouseMovePan' );
    
            panEnd.set( event.clientX, event.clientY );
    
            panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );
    
            pan( panDelta.x, panDelta.y );
    
            panStart.copy( panEnd );
    
            // scope.update();
    
        }

        function handleMouseUp( event ) {

            // console.log( 'handleMouseUp' );
    
        }

        function handleMouseWheel( event ) {

            // console.log( 'handleMouseWheel' );
    
            if ( event.deltaY < 0 ) {
    
                dollyOut( getDollyingScale() );
    
            } else if ( event.deltaY > 0 ) {
    
                dollyIn( getDollyingScale() );
    
            }
    
            // scope.update();
    
        }

        function handleKeyDown( event ) {

            //console.log( 'handleKeyDown' );
    
            switch ( event.keyCode ) {
    
                case scope.keys.UP:
                    pan( 0, scope.keyPanSpeed );
                    // scope.update();
                    break;
    
                case scope.keys.BOTTOM:
                    pan( 0, - scope.keyPanSpeed );
                    // scope.update();
                    break;
    
                case scope.keys.LEFT:
                    pan( scope.keyPanSpeed, 0 );
                    // scope.update();
                    break;
    
                case scope.keys.RIGHT:
                    pan( - scope.keyPanSpeed, 0 );
                    // scope.update();
                    break;
    
            }
    
        }

        function handleTouchStartRotate( event ) {

            //console.log( 'handleTouchStartRotate' );
    
            rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
    
        }

        function handleTouchStartDollyPan( event ) {

            //console.log( 'handleTouchStartDollyPan' );
    
            if ( scope.enableDollying ) {
    
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
    
                var distance = Math.sqrt( dx * dx + dy * dy );
    
                dollyStart.set( 0, distance );
    
            }
    
            if ( scope.enablePan ) {
    
                var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
                var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );
    
                panStart.set( x, y );
    
            }
    
        }

        function handleTouchMoveRotate( event ) {

            //console.log( 'handleTouchMoveRotate' );
    
            rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
    
            rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );
    
            var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
    
            // rotating across whole screen goes 360 degrees around
            rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth );
    
            // rotating up and down along whole screen attempts to go 360, but limited to 180
            rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );
    
            rotateStart.copy( rotateEnd );
    
            // scope.update();
    
        }

        function handleTouchMoveDollyPan( event ) {

            //console.log( 'handleTouchMoveDollyPan' );
    
            if ( scope.enableDollying ) {
    
                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
    
                var distance = Math.sqrt( dx * dx + dy * dy );
    
                dollyEnd.set( 0, distance );
    
                dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.dollyingSpeed ) );
    
                dollyIn( dollyDelta.y );
    
                dollyStart.copy( dollyEnd );
    
            }
    
            if ( scope.enablePan ) {
    
                var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
                var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );
    
                panEnd.set( x, y );
    
                panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );
    
                pan( panDelta.x, panDelta.y );
    
                panStart.copy( panEnd );
    
            }
    
            // scope.update();
    
        }

        function handleTouchEnd( event ) {

            //console.log( 'handleTouchEnd' );
    
        }

        //
        // event handlers - FSM: listen for events and reset state
        //
        
        function onMouseDown( event ) {

            if ( scope.enabled === false ) return;
    
            event.preventDefault();
    
            switch ( event.button ) {
    
                case scope.mouseButtons.ORBIT:
    
                    if ( scope.enableRotate === false ) return;
    
                    handleMouseDownRotate( event );
    
                    state = STATE.ROTATE;
    
                    break;
    
                case scope.mouseButtons.DOLLY:
    
                    if ( scope.enableDollying === false ) return;
    
                    handleMouseDownDolly( event );
    
                    state = STATE.DOLLY;
    
                    break;
    
                case scope.mouseButtons.PAN:
    
                    if ( scope.enablePan === false ) return;
    
                    handleMouseDownPan( event );
    
                    state = STATE.PAN;
    
                    break;
    
            }
    
            if ( state !== STATE.NONE ) {
    
                document.addEventListener( 'mousemove', onMouseMove, false );
                document.addEventListener( 'mouseup', onMouseUp, false );
    
            }
    
        }

        function onMouseMove( event ) {

            if ( scope.enabled === false ) return;
    
            event.preventDefault();
    
            switch ( state ) {
    
                case STATE.ROTATE:
    
                    if ( scope.enableRotate === false ) return;
    
                    handleMouseMoveRotate( event );
    
                    break;
    
                case STATE.DOLLY:
    
                    if ( scope.enableDollying === false ) return;
    
                    handleMouseMoveDolly( event );
    
                    break;
    
                case STATE.PAN:
    
                    if ( scope.enablePan === false ) return;
    
                    handleMouseMovePan( event );
    
                    break;
    
            }
    
        }

        function onMouseUp( event ) {

            if ( scope.enabled === false ) return;
    
            handleMouseUp( event );
    
            document.removeEventListener( 'mousemove', onMouseMove, false );
            document.removeEventListener( 'mouseup', onMouseUp, false );
    
            state = STATE.NONE;
    
        }

        function onMouseWheel( event ) {

            if ( scope.enabled === false || scope.enableDollying === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;
    
            event.preventDefault();
            event.stopPropagation();
    
            handleMouseWheel( event );
    
        }

        function onKeyDown( event ) {

            if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;
    
            handleKeyDown( event );
    
        }

        function onTouchStart( event ) {

            if ( scope.enabled === false ) return;
    
            event.preventDefault();
    
            switch ( event.touches.length ) {
    
                case 1:	// one-fingered touch: rotate
    
                    if ( scope.enableRotate === false ) return;
    
                    handleTouchStartRotate( event );
    
                    state = STATE.TOUCH_ROTATE;
    
                    break;
    
                case 2:	// two-fingered touch: dolly-pan
    
                    if ( scope.enableDollying === false && scope.enablePan === false ) return;
    
                    handleTouchStartDollyPan( event );
    
                    state = STATE.TOUCH_DOLLY_PAN;
    
                    break;
    
                default:
    
                    state = STATE.NONE;
    
            }
    
        }

        function onTouchMove( event ) {

            if ( scope.enabled === false ) return;
    
            event.preventDefault();
            event.stopPropagation();
    
            switch ( event.touches.length ) {
    
                case 1: // one-fingered touch: rotate
    
                    if ( scope.enableRotate === false ) return;
                    if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?
    
                    handleTouchMoveRotate( event );
    
                    break;
    
                case 2: // two-fingered touch: dolly-pan
    
                    if ( scope.enableDollying === false && scope.enablePan === false ) return;
                    if ( state !== STATE.TOUCH_DOLLY_PAN ) return; // is this needed?
    
                    handleTouchMoveDollyPan( event );
    
                    break;
    
                default:
    
                    state = STATE.NONE;
    
            }
    
        }

        function onTouchEnd( event ) {

            if ( scope.enabled === false ) return;
    
            handleTouchEnd( event );
    
            state = STATE.NONE;
    
        }
    
        function onContextMenu( event ) {
    
            if ( scope.enabled === false ) return;
    
            event.preventDefault();
    
        }

        //

        scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

        scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
        scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

        scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
        scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
        scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

        window.addEventListener( 'keydown', onKeyDown, false );

        // force an update at start

        this.update();

    };

    zen3d.OrbitControls = OrbitControls;
})();