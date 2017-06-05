(function() {
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;

    /**
     * Render Cache
     * use this class to cache and organize objects
     */
    var RenderCache = function() {

        // render list
        this.opaqueObjects = new Array();
        this.transparentObjects = new Array();
        this.canvas2dObjects = new Array();

        this.shadowObjects = new Array();

        this.sprites = new Array();

        this.particles = new Array();

        // lights
        this.ambientLights = new Array();
        this.directLights = new Array();
        this.pointLights = new Array();
        this.spotLights = new Array();

        this.shadowLights = new Array();

        // camera
        this.camera = null;

        // fog
        this.fog = null;
    }

    var helpVector3 = new zen3d.Vector3();
    var helpFrustum = new zen3d.Frustum();
    var helpMatrix = new zen3d.Matrix4();
    var helpSphere = new zen3d.Sphere();

    /**
     * cache scene
     */
    RenderCache.prototype.cacheScene = function(scene, camera) {
        this.camera = camera;
        this.fog = scene.fog;
        this.cacheObject(scene);
    }

    RenderCache.prototype.cacheObject = function(object) {
        var camera = this.camera;

        // cache all type of objects
        switch (object.type) {
            case OBJECT_TYPE.POINT:
            case OBJECT_TYPE.LINE:
            case OBJECT_TYPE.LINE_LOOP:
            case OBJECT_TYPE.LINE_SEGMENTS:
            case OBJECT_TYPE.CANVAS2D:
            case OBJECT_TYPE.MESH:
            case OBJECT_TYPE.SKINNED_MESH:

                // frustum test
                if(object.frustumCulled) {
                    helpSphere.copy(object.geometry.boundingSphere).applyMatrix4(object.worldMatrix);
        			helpMatrix.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix);
        			helpFrustum.setFromMatrix(helpMatrix);
                    var frustumTest = helpFrustum.intersectsSphere(helpSphere);
                    if(!frustumTest) {
                        break;
                    }
                }

                var material = object.material;

                var array;
                if (object.type == OBJECT_TYPE.CANVAS2D) {
                    array = this.canvas2dObjects;
                } else if (material.transparent) {
                    array = this.transparentObjects;
                } else {
                    array = this.opaqueObjects;
                }

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });

                if (object.castShadow) {
                    this.shadowObjects.push(object);
                }

                break;
            case OBJECT_TYPE.SPRITE:
                // frustum test
                if(object.frustumCulled) {
                    helpSphere.center.set(0, 0, 0);
                    helpSphere.radius = 0.7071067811865476;
                    helpSphere.applyMatrix4(object.worldMatrix);
                    helpMatrix.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix);
                    helpFrustum.setFromMatrix(helpMatrix);
                    var frustumTest = helpFrustum.intersectsSphere(helpSphere);
                    if(!frustumTest) {
                        break;
                    }
                }

                var array = this.sprites;

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    material: object.material,
                    z: helpVector3.z
                });

                // no shadow
                break;
            case OBJECT_TYPE.PARTICLE:
                var array = this.particles;

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                array.push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });
                break;
            case OBJECT_TYPE.LIGHT:
                if (object.lightType == LIGHT_TYPE.AMBIENT) {
                    this.ambientLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.DIRECT) {
                    this.directLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.POINT) {
                    this.pointLights.push(object);
                } else if (object.lightType == LIGHT_TYPE.SPOT) {
                    this.spotLights.push(object);
                }

                if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    this.shadowLights.push(object);
                }

                break;
            case OBJECT_TYPE.CAMERA:
                // do nothing
                // main camera will set by hand
                // camera put to object tree just for update position
                break;
            case OBJECT_TYPE.SCENE:
                // do nothing
                break;
            case OBJECT_TYPE.GROUP:
                // do nothing
                break;
            default:
                console.log("undefined object type")
        }

        // handle children by recursion
        if(OBJECT_TYPE.CANVAS2D !== object.type) {
            var children = object.children;
            for (var i = 0, l = children.length; i < l; i++) {
                this.cacheObject(children[i]);
            }
        }
    }

    /**
     * sort render list
     */
    RenderCache.prototype.sort = function() {
        // opaque objects render from front to back
        this.opaqueObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return za - zb;
        });

        // transparent objects render from back to front
        this.transparentObjects.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // sprites render from back to front
        this.sprites.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // particles render from back to front
        this.particles.sort(function(a, b) {
            var za = a.z;
            var zb = b.z;
            return zb - za;
        });

        // TODO canvas2d object should render in order
    }

    /**
     * clear
     */
    RenderCache.prototype.clear = function() {
        this.transparentObjects.length = 0;
        this.opaqueObjects.length = 0;
        this.canvas2dObjects.length = 0;

        this.shadowObjects.length = 0;

        this.sprites.length = 0;

        this.particles.length = 0;

        this.ambientLights.length = 0;
        this.directLights.length = 0;
        this.pointLights.length = 0;
        this.spotLights.length = 0;

        this.shadowLights.length = 0;
    }

    zen3d.RenderCache = RenderCache;
})();