(function() {
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;
    var RENDER_LAYER = zen3d.RENDER_LAYER;
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

    var sortFrontToBack = function(a, b) {
        return a.z - b.z;
    }

    var sortBackToFront = function(a, b) {
        return b.z - a.z;
    }

    var lightCaches = {};

    function getLightCache(light) {
        if(lightCaches[light.uuid] !== undefined) {
            return lightCaches[light.uuid];
        }

        var cache;
        switch ( light.lightType ) {
            case LIGHT_TYPE.DIRECT:
                cache = {
                    direction: new Float32Array(3),
                    color: new Float32Array([0, 0, 0, 1]),
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Float32Array(2)
                };
                break;
            case LIGHT_TYPE.POINT:
                cache = {
                    position: new Float32Array(3),
                    color: new Float32Array([0, 0, 0, 1]),
                    distance: 0,
                    decay: 0,
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Float32Array(2),
                    shadowCameraNear: 1,
                    shadowCameraFar: 1000
                };
                break;
            case LIGHT_TYPE.SPOT:
                cache = {
                    position: new Float32Array(3),
                    direction: new Float32Array(3),
                    color: new Float32Array([0, 0, 0, 1]),
                    distance: 0,
                    coneCos: 0,
                    penumbraCos: 0,
                    decay: 0,
                    shadow: false,
                    shadowBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Float32Array(2)
                };
                break;
        }

        lightCaches[light.uuid] = cache;

        return cache;
    }

    /**
     * Render Cache
     * use this class to cache and organize objects
     */
    var RenderCache = function() {

        // render list
        var renderLists = {};
        for(var i = 0; i < LAYER_RENDER_LIST.length; i++) {
            renderLists[LAYER_RENDER_LIST[i]] = new Array();
        }
        this.renderLists = renderLists;

        // lights
        this.lights = {
            ambient: new Float32Array([0, 0, 0, 1]),
            directional: [],
            directionalShadowMap: [],
            directionalShadowMatrix: [],
            point: [],
            pointShadowMap: [],
            pointShadowMatrix: [],
            spot: [],
            spotShadowMap: [],
            spotShadowMatrix: [],
            shadows: [],
            ambientsNum: 0,
            directsNum: 0,
            pointsNum: 0,
            spotsNum: 0,
            shadowsNum: 0,
            totalNum: 0
        };

        // camera
        this.camera = null;

        // fog
        this.fog = null;

        // clippingPlanes
        this.clippingPlanes = null;
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
        this.clippingPlanes = scene.clippingPlanes;
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

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                var material = object.material;

                if(Array.isArray(material)){
                    var groups = object.geometry.groups;

                    for(var i = 0; i < groups.length; i++) {
                        var group = groups[i];
                        var groupMaterial = material[group.materialIndex];
                        if(groupMaterial) {

                            this.renderLists[groupMaterial.transparent ? RENDER_LAYER.TRANSPARENT : RENDER_LAYER.DEFAULT].push({
                                object: object,
                                geometry: object.geometry,
                                material: groupMaterial,
                                z: helpVector3.z,
                                group: group
                            });

                        }
                    }
                } else {
                    this.renderLists[material.transparent ? RENDER_LAYER.TRANSPARENT : RENDER_LAYER.DEFAULT].push({
                        object: object,
                        geometry: object.geometry,
                        material: object.material,
                        z: helpVector3.z
                    });
                }

                break;
            case OBJECT_TYPE.CANVAS2D:
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

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                this.renderLists[RENDER_LAYER.CANVAS2D].push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });
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

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                this.renderLists[RENDER_LAYER.SPRITE].push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });

                // no shadow
                break;
            case OBJECT_TYPE.PARTICLE:

                helpVector3.setFromMatrixPosition(object.worldMatrix);
                helpVector3.applyMatrix4(camera.viewMatrix).applyMatrix4(camera.projectionMatrix);

                this.renderLists[RENDER_LAYER.PARTICLE].push({
                    object: object,
                    geometry: object.geometry,
                    material: object.material,
                    z: helpVector3.z
                });
                break;
            case OBJECT_TYPE.LIGHT:
                var lights = this.lights;
                if (object.lightType == LIGHT_TYPE.AMBIENT) {
                    var intensity = object.intensity;
                    var color = object.color;

                    lights.ambient[0] += color.r * intensity;
                    lights.ambient[1] += color.g * intensity;
                    lights.ambient[2] += color.b * intensity;

                    lights.ambientsNum++;
                } else if (object.lightType == LIGHT_TYPE.DIRECT) {
                    var intensity = object.intensity;
                    var color = object.color;

                    var cache = getLightCache(object);

                    cache.color[0] = color.r * intensity;
                    cache.color[1] = color.g * intensity;
                    cache.color[2] = color.b * intensity;

                    var direction = helpVector3;
                    object.getWorldDirection(direction);
                    direction.transformDirection(camera.viewMatrix);

                    cache.direction[0] = direction.x;
                    cache.direction[1] = direction.y;
                    cache.direction[2] = direction.z;

                    if(object.castShadow) {
                        cache.shadow = true;
                        cache.shadowBias = object.shadow.bias;
                        cache.shadowRadius = object.shadow.radius;
                        cache.shadowMapSize[0] = object.shadow.mapSize.x;
                        cache.shadowMapSize[1] = object.shadow.mapSize.y;
                    } else {
                        cache.shadow = false;
                    }

                    if(object.castShadow) {

                        // resize typed array
                        var needSize = (lights.directsNum + 1) * 16;
                        if(lights.directionalShadowMatrix.length < needSize) {
                            var old = lights.directionalShadowMatrix;
                            lights.directionalShadowMatrix = new Float32Array(needSize);
                            lights.directionalShadowMatrix.set(old);
                        }

                        lights.directionalShadowMatrix.set(object.shadow.matrix.elements, lights.directsNum * 16);
                        lights.directionalShadowMap[lights.directsNum] = object.shadow.map;
                    }

                    lights.directional[lights.directsNum] = cache;

                    lights.directsNum++;
                } else if (object.lightType == LIGHT_TYPE.POINT) {
                    var intensity = object.intensity;
                    var color = object.color;
                    var distance = object.distance;
                    var decay = object.decay;

                    var cache = getLightCache(object);

                    cache.color[0] = color.r * intensity;
                    cache.color[1] = color.g * intensity;
                    cache.color[2] = color.b * intensity;

                    cache.distance = distance;
                    cache.decay = decay;

                    var position = helpVector3.setFromMatrixPosition(object.worldMatrix).applyMatrix4(camera.viewMatrix);

                    cache.position[0] = position.x;
                    cache.position[1] = position.y;
                    cache.position[2] = position.z;

                    if(object.castShadow) {
                        cache.shadow = true;
                        cache.shadowBias = object.shadow.bias;
                        cache.shadowRadius = object.shadow.radius;
                        cache.shadowMapSize[0] = object.shadow.mapSize.x;
                        cache.shadowMapSize[1] = object.shadow.mapSize.y;
                        cache.shadowCameraNear = object.shadow.cameraNear;
                        cache.shadowCameraFar = object.shadow.cameraFar;
                    } else {
                        cache.shadow = false;
                    }

                    if(object.castShadow) {

                        // resize typed array
                        var needSize = (lights.pointsNum + 1) * 16;
                        if(lights.pointShadowMatrix.length < needSize) {
                            var old = lights.pointShadowMatrix;
                            lights.pointShadowMatrix = new Float32Array(needSize);
                            lights.pointShadowMatrix.set(old);
                        }

                        lights.pointShadowMatrix.set(object.shadow.matrix.elements, lights.pointsNum * 16);
                        lights.pointShadowMap[lights.pointsNum] = object.shadow.map;
                    }

                    lights.point[lights.pointsNum] = cache;

                    lights.pointsNum++;
                } else if (object.lightType == LIGHT_TYPE.SPOT) {
                    var intensity = object.intensity;
                    var color = object.color;
                    var distance = object.distance;
                    var decay = object.decay;

                    var cache = getLightCache(object);

                    cache.color[0] = color.r * intensity;
                    cache.color[1] = color.g * intensity;
                    cache.color[2] = color.b * intensity;

                    cache.distance = distance;
                    cache.decay = decay;

                    var position = helpVector3.setFromMatrixPosition(object.worldMatrix).applyMatrix4(camera.viewMatrix);

                    cache.position[0] = position.x;
                    cache.position[1] = position.y;
                    cache.position[2] = position.z;

                    var direction = helpVector3;
                    object.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);

                    cache.direction[0] = direction.x;
                    cache.direction[1] = direction.y;
                    cache.direction[2] = direction.z;

                    var coneCos = Math.cos(object.angle);
                    var penumbraCos = Math.cos(object.angle * (1 - object.penumbra));

                    cache.coneCos = coneCos;
                    cache.penumbraCos = penumbraCos;

                    if(object.castShadow) {
                        cache.shadow = true;
                        cache.shadowBias = object.shadow.bias;
                        cache.shadowRadius = object.shadow.radius;
                        cache.shadowMapSize[0] = object.shadow.mapSize.x;
                        cache.shadowMapSize[1] = object.shadow.mapSize.y;
                    } else {
                        cache.shadow = false;
                    }

                    if(object.castShadow) {

                        // resize typed array
                        var needSize = (lights.spotsNum + 1) * 16;
                        if(lights.spotShadowMatrix.length < needSize) {
                            var old = lights.spotShadowMatrix;
                            lights.spotShadowMatrix = new Float32Array(needSize);
                            lights.spotShadowMatrix.set(old);
                        }

                        lights.spotShadowMatrix.set(object.shadow.matrix.elements, lights.spotsNum * 16);
                        lights.spotShadowMap[lights.spotsNum] = object.shadow.map;
                    }

                    lights.spot[lights.spotsNum] = cache;

                    lights.spotsNum++;
                }

                if (object.castShadow && object.lightType !== LIGHT_TYPE.AMBIENT) {
                    lights.shadows.push(object);
                    lights.shadowsNum++;
                }

                lights.totalNum++;
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
        var renderLists = this.renderLists;
        renderLists[RENDER_LAYER.DEFAULT].sort(sortFrontToBack); // need sort?
        renderLists[RENDER_LAYER.TRANSPARENT].sort(sortBackToFront);
        renderLists[RENDER_LAYER.SPRITE].sort(sortBackToFront);
        renderLists[RENDER_LAYER.PARTICLE].sort(sortBackToFront);
        // TODO canvas2d object should render in order?
    }

    /**
     * clear
     */
    RenderCache.prototype.clear = function() {
        var renderLists = this.renderLists;
        for(var layer in renderLists) {
            renderLists[layer].length = 0;
        }

        var lights = this.lights;
        for(var i = 0; i < 3; i++) {
            lights.ambient[i] = 0;
        }
        lights.shadows.length = 0;
        lights.ambientsNum = 0;
        lights.directsNum = 0;
        lights.pointsNum = 0;
        lights.spotsNum = 0;
        lights.shadowsNum = 0;
        lights.totalNum = 0;
    }

    zen3d.RenderCache = RenderCache;
})();