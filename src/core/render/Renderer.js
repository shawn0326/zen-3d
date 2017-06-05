(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var DRAW_SIDE = zen3d.DRAW_SIDE;
    var WEBGL_UNIFORM_TYPE = zen3d.WEBGL_UNIFORM_TYPE;

    /**
     * Renderer
     * @class
     */
    var Renderer = function(view) {

        // canvas
        this.view = view;
        // gl context
        var gl = this.gl = view.getContext("webgl", {
            antialias: true, // antialias
            alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        // width and height, same with the canvas
        this.width = view.width;
        this.height = view.height;

        this.autoClear = true;

        // init webgl
        var properties = new zen3d.WebGLProperties();
        this.properties = properties;

        var capabilities = new zen3d.WebGLCapabilities(gl);
        this.capabilities = capabilities;

        var state = new zen3d.WebGLState(gl, capabilities);
        state.enable(gl.STENCIL_TEST);
        state.enable(gl.DEPTH_TEST);
        state.setCullFace(CULL_FACE_TYPE.BACK);
        state.setFlipSided(false);
        state.viewport(0, 0, this.width, this.height);
        state.clearColor(0, 0, 0, 0);
        this.state = state;

        this.texture = new zen3d.WebGLTexture(gl, state, properties, capabilities);

        this.geometry = new zen3d.WebGLGeometry(gl, state, properties, capabilities);

        this.performance = new zen3d.Performance();

        this.depthMaterial = new zen3d.DepthMaterial();

        // object cache
        this.cache = new zen3d.RenderCache();

        this._usedTextureUnits = 0;

        this._currentRenderTarget = null;

        this._currentViewport = new zen3d.Vector4(0, 0, this.width, this.height);
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;

        this.view.width = width;
        this.view.height = height;

        this.setViewport(0, 0, width, height);
    }

    /**
     * setViewport
     */
    Renderer.prototype.setViewport = function(x, y, width, height) {
        this._currentViewport.set(x, y, width, height);
        this.state.viewport(x, y, width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var performance = this.performance;

        performance.updateFps();

        performance.startCounter("render", 60);

        performance.startCounter("updateMatrix", 60);
        scene.updateMatrix();
        performance.endCounter("updateMatrix");

        camera.viewMatrix.getInverse(camera.worldMatrix); // update view matrix

        performance.startCounter("cacheScene", 60);
        this.cache.cacheScene(scene, camera);
        this.cache.sort();
        performance.endCounter("cacheScene");

        performance.startCounter("renderShadow", 60);
        this.renderShadow();
        performance.endCounter("renderShadow");

        if (renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.state.clearColor(0, 0, 0, 0);
            this.clear(true, true, true);
        }

        performance.startCounter("renderList", 60);
        this.renderList(this.cache.opaqueObjects);
        this.renderList(this.cache.transparentObjects);
        this.renderList(this.cache.canvas2dObjects);
        this.renderSprites(this.cache.sprites);
        this.renderParticles(this.cache.particles);
        performance.endCounter("renderList");

        this.cache.clear();

        if (renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var gl = this.gl;
        var state = this.state;

        var lights = this.cache.shadowLights;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;
            var renderList = this.cache.shadowObjects;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                this.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                this.clear(true, true);

                if (renderList.length == 0) {
                    return;
                }

                for (var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = this.depthMaterial;
                    var geometry = object.geometry;

                    var program = zen3d.getProgram(gl, this, material, object);
                    state.setProgram(program);

                    this.geometry.setGeometry(geometry);
                    this.setupVertexAttributes(program, geometry);

                    // update uniforms
                    var uniforms = program.uniforms;
                    for (var key in uniforms) {
                        var uniform = uniforms[key];
                        switch (key) {
                            // pvm matrix
                            case "u_Projection":
                                var projectionMat = camera.projectionMatrix.elements;
                                uniform.setValue(projectionMat);
                                break;
                            case "u_View":
                                var viewMatrix = camera.viewMatrix.elements;
                                uniform.setValue(viewMatrix);
                                break;
                            case "u_Model":
                                var modelMatrix = object.worldMatrix.elements;
                                uniform.setValue(modelMatrix);
                                break;
                            case "lightPos":
                                helpVector3.setFromMatrixPosition(light.worldMatrix);
                                uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                                break;
                        }
                    }

                    // boneMatrices
                    if(object.type === zen3d.OBJECT_TYPE.SKINNED_MESH && object.skeleton && object.skeleton.bones.length > 0) {
                        var skeleton = object.skeleton;

                        if(this.capabilities.maxVertexTextures > 0 && this.capabilities.floatTextures) {
                            if(skeleton.boneTexture === undefined) {
                                var size = Math.sqrt(skeleton.bones.length * 4);
                                size = zen3d.nextPowerOfTwo(Math.ceil(size));
                                size = Math.max(4, size);

                                var boneMatrices = new Float32Array(size * size * 4);
                                boneMatrices.set(skeleton.boneMatrices);

                                var boneTexture = new zen3d.TextureData(boneMatrices, size, size);

                                skeleton.boneMatrices = boneMatrices;
                                skeleton.boneTexture = boneTexture;
                                skeleton.boneTextureSize = size;
                            }

                            var slot = this.allocTexUnit();
                            this.texture.setTexture2D(skeleton.boneTexture, slot);

                            if(uniforms["boneTexture"]) {
                                uniforms["boneTexture"].setValue(slot);
                            }

                            if(uniforms["boneTextureSize"]) {
                                uniforms["boneTextureSize"].setValue(skeleton.boneTextureSize);
                            }
                        } else {
                            // TODO a cache for uniform location
                            var location = gl.getUniformLocation(program.id, "boneMatrices");
                            gl.uniformMatrix4fv(location, false, skeleton.boneMatrices);
                        }
                    }

                    state.setBlend(BLEND_TYPE.NONE);
                    state.disable(gl.DEPTH_TEST);
                    // set draw side
                    material = object.material;
                    state.setCullFace(
                        (material.side === DRAW_SIDE.DOUBLE) ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK
                    );
                    state.setFlipSided(
                        material.side === DRAW_SIDE.BACK
                    );

                    // draw
                    gl.drawElements(gl.TRIANGLES, object.geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);
                }

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }
    }

    var helpVector3 = new zen3d.Vector3();

    Renderer.prototype.renderList = function(renderList) {
        var camera = this.cache.camera;
        var fog = this.cache.fog;
        var gl = this.gl;
        var state = this.state;

        var ambientLights = this.cache.ambientLights;
        var directLights = this.cache.directLights;
        var pointLights = this.cache.pointLights;
        var spotLights = this.cache.spotLights;
        var ambientLightsNum = ambientLights.length;
        var directLightsNum = directLights.length;
        var pointLightsNum = pointLights.length;
        var spotLightsNum = spotLights.length;
        var lightsNum = ambientLightsNum + directLightsNum + pointLightsNum + spotLightsNum;

        for (var i = 0, l = renderList.length; i < l; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = renderItem.material;
            var geometry = renderItem.geometry;

            var program = zen3d.getProgram(gl, this, object.material, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ], fog);
            state.setProgram(program);

            this.geometry.setGeometry(geometry);
            this.setupVertexAttributes(program, geometry);

            // update uniforms
            // TODO need a better upload method
            var uniforms = program.uniforms;
            for (var key in uniforms) {
                var uniform = uniforms[key];
                switch (key) {

                    // pvm matrix
                    case "u_Projection":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var projectionMat = object.orthoCamera.projectionMatrix.elements;
                        } else {
                            var projectionMat = camera.projectionMatrix.elements;
                        }

                        uniform.setValue(projectionMat);
                        break;
                    case "u_View":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D && object.isScreenCanvas) {
                            var viewMatrix = object.orthoCamera.viewMatrix.elements;
                        } else {
                            var viewMatrix = camera.viewMatrix.elements;
                        }

                        uniform.setValue(viewMatrix);
                        break;
                    case "u_Model":
                        var modelMatrix = object.worldMatrix.elements;
                        uniform.setValue(modelMatrix);
                        break;

                    case "u_Color":
                        var color = material.diffuse;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_Opacity":
                        uniform.setValue(material.opacity);
                        break;

                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.diffuseMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.bumpMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "bumpScale":
                        uniform.setValue(material.bumpScale);
                        break;
                    case "envMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.envMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "cubeMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.cubeMap, slot);
                        uniform.setValue(slot);
                        break;

                    case "u_EnvMap_Intensity":
                        uniform.setValue(material.envMapIntensity);
                        break;
                    case "u_Specular":
                        uniform.setValue(material.shininess);
                        break;
                    case "u_SpecularColor":
                        var color = material.specular;
                        uniform.setValue(color.r, color.g, color.b, 1);
                        break;
                    case "specularMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.specularMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "emissive":
                        var color = material.emissive;
                        var intensity = material.emissiveIntensity;
                        uniform.setValue(color.r * intensity, color.g * intensity, color.b * intensity);
                        break;
                    case "emissiveMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.emissiveMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        uniform.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                        break;
                    case "u_FogColor":
                        var color = fog.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_FogDensity":
                        uniform.setValue(fog.density);
                        break;
                    case "u_FogNear":
                        uniform.setValue(fog.near);
                        break;
                    case "u_FogFar":
                        uniform.setValue(fog.far);
                        break;
                    case "u_PointSize":
                        uniform.setValue(material.size);
                        break;
                    case "u_PointScale":
                        var scale = this.height * 0.5; // three.js do this
                        uniform.setValue(scale);
                        break;
                    case "dashSize":
                        uniform.setValue(material.dashSize);
                        break;
                    case "totalSize":
                        uniform.setValue(material.dashSize + material.gapSize);
                        break;
                    case "scale":
                        uniform.setValue(material.scale);
                        break;
                    default:
                        // upload custom uniforms
                        if(material.uniforms && material.uniforms[key]) {
                            if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_2D) {
                                var slot = this.allocTexUnit();
                                this.texture.setTexture2D(material.uniforms[key], slot);
                                uniform.setValue(slot);
                            } else if(uniform.type === WEBGL_UNIFORM_TYPE.SAMPLER_CUBE) {
                                var slot = this.allocTexUnit();
                                this.texture.setTextureCube(material.uniforms[key], slot);
                                uniform.setValue(slot);
                            } else {
                                uniform.set(material.uniforms[key]);
                            }
                        }
                        break;
                }
            }

            // boneMatrices
            if(object.type === zen3d.OBJECT_TYPE.SKINNED_MESH && object.skeleton && object.skeleton.bones.length > 0) {
                var skeleton = object.skeleton;

                if(this.capabilities.maxVertexTextures > 0 && this.capabilities.floatTextures) {
                    if(skeleton.boneTexture === undefined) {
                        var size = Math.sqrt(skeleton.bones.length * 4);
                        size = zen3d.nextPowerOfTwo(Math.ceil(size));
                        size = Math.max(4, size);

                        var boneMatrices = new Float32Array(size * size * 4);
                        boneMatrices.set(skeleton.boneMatrices);

                        var boneTexture = new zen3d.TextureData(boneMatrices, size, size);

                        skeleton.boneMatrices = boneMatrices;
                        skeleton.boneTexture = boneTexture;
                        skeleton.boneTextureSize = size;
                    }

                    var slot = this.allocTexUnit();
                    this.texture.setTexture2D(skeleton.boneTexture, slot);

                    if(uniforms["boneTexture"]) {
                        uniforms["boneTexture"].setValue(slot);
                    }

                    if(uniforms["boneTextureSize"]) {
                        uniforms["boneTextureSize"].setValue(skeleton.boneTextureSize);
                    }
                } else {
                    // TODO a cache for uniform location
                    var location = gl.getUniformLocation(program.id, "boneMatrices");
                    gl.uniformMatrix4fv(location, false, skeleton.boneMatrices);
                }
            }

            /////////////////light
            // only lambert & phong material support light
            if (material.type === MATERIAL_TYPE.LAMBERT || material.type === MATERIAL_TYPE.PHONG) {
                for (var k = 0; k < ambientLightsNum; k++) {
                    var light = ambientLights[k];

                    var intensity = light.intensity;
                    var color = light.color;

                    var u_Ambient_intensity = uniforms["u_Ambient[" + k + "].intensity"];
                    var u_Ambient_color = uniforms["u_Ambient[" + k + "].color"];
                    u_Ambient_intensity.setValue(intensity);
                    u_Ambient_color.setValue(color.r, color.g, color.b, 1);
                }


                for (var k = 0; k < directLightsNum; k++) {
                    var light = directLights[k];

                    var intensity = light.intensity;
                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);
                    var color = light.color;

                    var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"];
                    var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"];
                    var u_Directional_color = uniforms["u_Directional[" + k + "].color"];
                    u_Directional_direction.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                    u_Directional_intensity.setValue(intensity);
                    u_Directional_color.setValue(color.r, color.g, color.b, 1);

                    // shadow
                    var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"];
                    u_Directional_shadow.setValue(light.castShadow ? 1 : 0);

                    if (light.castShadow && object.receiveShadow) {
                        var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"];
                        directionalShadowMatrix.setValue(light.shadow.matrix.elements);

                        var directionalShadowMap = uniforms["directionalShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        directionalShadowMap.setValue(slot);
                    }

                }

                for (var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var intensity = light.intensity;
                    var color = light.color;
                    var distance = light.distance;
                    var decay = light.decay;

                    var u_Point_position = uniforms["u_Point[" + k + "].position"];
                    u_Point_position.setValue(helpVector3.x, helpVector3.y, helpVector3.z);
                    var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"];
                    u_Point_intensity.setValue(intensity);
                    var u_Point_color = uniforms["u_Point[" + k + "].color"];
                    u_Point_color.setValue(color.r, color.g, color.b, 1);
                    var u_Point_distance = uniforms["u_Point[" + k + "].distance"];
                    u_Point_distance.setValue(distance);
                    var u_Point_decay = uniforms["u_Point[" + k + "].decay"];
                    u_Point_decay.setValue(decay);

                    // shadow
                    var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"];
                    u_Point_shadow.setValue(light.castShadow ? 1 : 0);

                    if (light.castShadow && object.receiveShadow) {
                        var pointShadowMap = uniforms["pointShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(light.shadow.map, slot);
                        pointShadowMap.setValue(slot);
                    }
                }

                for (var k = 0; k < spotLightsNum; k++) {
                    var light = spotLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var u_Spot_position = uniforms["u_Spot[" + k + "].position"];
                    u_Spot_position.setValue(helpVector3.x, helpVector3.y, helpVector3.z);

                    var intensity = light.intensity;
                    var color = light.color;
                    var distance = light.distance;
                    var decay = light.decay;

                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);

                    var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"];
                    u_Spot_direction.setValue(helpVector3.x, helpVector3.y, helpVector3.z);

                    var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"];
                    u_Spot_intensity.setValue(intensity);
                    var u_Spot_color = uniforms["u_Spot[" + k + "].color"];
                    u_Spot_color.setValue(color.r, color.g, color.b, 1);
                    var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"];
                    u_Spot_distance.setValue(distance);
                    var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"];
                    u_Spot_decay.setValue(decay);

                    var coneCos = Math.cos(light.angle);
                    var penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
                    var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"];
                    u_Spot_coneCos.setValue(coneCos);
                    var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"];
                    u_Spot_penumbraCos.setValue(penumbraCos);

                    // shadow
                    var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"];
                    u_Spot_shadow.setValue(light.castShadow ? 1 : 0);

                    if (light.castShadow && object.receiveShadow) {
                        var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"];
                        spotShadowMatrix.setValue(light.shadow.matrix.elements);

                        var spotShadowMap = uniforms["spotShadowMap[" + k + "]"];
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        spotShadowMap.setValue(slot);
                    }
                }
            }
            ///////

            // set blend
            if (material.transparent) {
                state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                state.enable(gl.DEPTH_TEST);
                state.depthMask(material.depthWrite);
            } else {
                state.disable(gl.DEPTH_TEST);
            }

            // set draw side
            state.setCullFace(
                (material.side === DRAW_SIDE.DOUBLE) ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK
            );
            state.setFlipSided(
                material.side === DRAW_SIDE.BACK
            );

            // draw
            if (object.type === zen3d.OBJECT_TYPE.POINT) {
                gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINE_STRIP, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE_LOOP) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINE_LOOP, 0, geometry.getVerticesCount());
            } else if(object.type === zen3d.OBJECT_TYPE.LINE_SEGMENTS) {
                state.setLineWidth(material.lineWidth);
                gl.drawArrays(gl.LINES, 0, geometry.getVerticesCount());
            } else if (object.type === zen3d.OBJECT_TYPE.CANVAS2D) {
                var _offset = 0;
                for (var j = 0; j < object.drawArray.length; j++) {
                    var drawData = object.drawArray[j];

                    var slot = this.allocTexUnit();
                    this.texture.setTexture2D(drawData.texture, slot);
                    uniforms.spriteTexture.setValue(slot);

                    gl.drawElements(gl.TRIANGLES, drawData.count * 6, gl.UNSIGNED_SHORT, _offset * 2);
                    _offset += drawData.count * 6;
                    this._usedTextureUnits = 0;
                }
            } else {
                gl.drawElements(gl.TRIANGLES, geometry.getIndicesCount(), gl.UNSIGNED_SHORT, 0);
            }

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }
    }

    var spritePosition = new zen3d.Vector3();
    var spriteRotation = new zen3d.Quaternion();
    var spriteScale = new zen3d.Vector3();

    Renderer.prototype.renderSprites = function(sprites) {
        if (this.cache.sprites.length === 0) {
            return;
        }

        var camera = this.cache.camera;
        var fog = this.cache.fog;
        var gl = this.gl;
        var state = this.state;
        var geometry = zen3d.Sprite.geometry;
        var material = sprites[0].material;

        var program = zen3d.getProgram(gl, this, material);
        state.setProgram(program);

        // bind a shared geometry
        this.geometry.setGeometry(geometry);
        this.setupVertexAttributes(program, geometry);

        var uniforms = program.uniforms;
        uniforms.projectionMatrix.setValue(camera.projectionMatrix.elements);

        // fog
        var sceneFogType = 0;
        if (fog) {
            uniforms.fogColor.setValue(fog.color.r, fog.color.g, fog.color.b);

            if (fog.fogType === zen3d.FOG_TYPE.NORMAL) {
                uniforms.fogNear.setValue(fog.near);
                uniforms.fogFar.setValue(fog.far);

                uniforms.fogType.setValue(1);
                sceneFogType = 1;
            } else if (fog.fogType === zen3d.FOG_TYPE.EXP2) {
                uniforms.fogDensity.setValue(fog.density);
                uniforms.fogType.setValue(2);
                sceneFogType = 2;
            }
        } else {
            uniforms.fogType.setValue(0);
            sceneFogType = 0;
        }

        // render
        var scale = [];

        for (var i = 0, l = sprites.length; i < l; i++) {
            var sprite = sprites[i].object;
            var material = sprite.material;

            uniforms.alphaTest.setValue(0);
            uniforms.viewMatrix.setValue(camera.viewMatrix.elements);
            uniforms.modelMatrix.setValue(sprite.worldMatrix.elements);

            sprite.worldMatrix.decompose(spritePosition, spriteRotation, spriteScale);

            scale[0] = spriteScale.x;
            scale[1] = spriteScale.y;

            var fogType = 0;

            if (fog && material.fog) {
                fogType = sceneFogType;
            }

            uniforms.fogType.setValue(fogType);

            if (material.diffuseMap !== null) {
                // TODO offset
                // uniforms.uvOffset.setValue(uniforms.uvOffset, material.diffuseMap.offset.x, material.diffuseMap.offset.y);
                // uniforms.uvScale.setValue(uniforms.uvScale, material.diffuseMap.repeat.x, material.diffuseMap.repeat.y);
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            } else {
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            }

            uniforms.opacity.setValue(material.opacity);
            uniforms.color.setValue(material.diffuse.r, material.diffuse.g, material.diffuse.b);

            uniforms.rotation.setValue(material.rotation);
            uniforms.scale.setValue(scale[0], scale[1]);

            // set blend
            if (material.transparent) {
                state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                state.enable(gl.DEPTH_TEST);
                state.depthMask(material.depthWrite);
            } else {
                state.disable(gl.DEPTH_TEST);
            }

            // set draw side
            state.setCullFace(
                (material.side === DRAW_SIDE.DOUBLE) ? CULL_FACE_TYPE.NONE : CULL_FACE_TYPE.BACK
            );
            state.setFlipSided(
                material.side === DRAW_SIDE.BACK
            );

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(material.diffuseMap, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }

    }

    Renderer.prototype.renderParticles = function(particles) {
        if (this.cache.particles.length === 0) {
            return;
        }

        var camera = this.cache.camera;
        var gl = this.gl;
        var state = this.state;

        for (var i = 0, l = particles.length; i < l; i++) {
            var particle = particles[i].object;
            var geometry = particles[i].geometry;
            var material = particles[i].material;

            var program = zen3d.getProgram(gl, this, material);
            state.setProgram(program);

            this.geometry.setGeometry(geometry);
            this.setupVertexAttributes(program, geometry);

            var uniforms = program.uniforms;
            uniforms.uTime.setValue(particle.time);
            uniforms.uScale.setValue(1);

            uniforms.u_Projection.setValue(camera.projectionMatrix.elements);
            uniforms.u_View.setValue(camera.viewMatrix.elements);
            uniforms.u_Model.setValue(particle.worldMatrix.elements);

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(particle.particleNoiseTex, slot);
            uniforms.tNoise.setValue(slot);

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(particle.particleSpriteTex, slot);
            uniforms.tSprite.setValue(slot);

            state.setBlend(BLEND_TYPE.ADD);
            state.enable(gl.DEPTH_TEST);
            state.depthMask(false);
            state.setCullFace(CULL_FACE_TYPE.BACK);
            state.setFlipSided(false);

            gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());

            this._usedTextureUnits = 0;
        }
    }

    /**
     * set render target
     */
    Renderer.prototype.setRenderTarget = function(target) {
        var gl = this.gl;

        if (!target) {
            if (this._currentRenderTarget === target) {

            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                this._currentRenderTarget = null;

                this.state.viewport(
                    this._currentViewport.x,
                    this._currentViewport.y,
                    this._currentViewport.z,
                    this._currentViewport.w);
            }

            return;
        }

        var isCube = target.activeCubeFace !== undefined;

        if (this._currentRenderTarget !== target) {
            if (!isCube) {
                this.texture.setRenderTarget2D(target);
            } else {
                this.texture.setRenderTargetCube(target);
            }

            this._currentRenderTarget = target;
        } else {
            if (isCube) {
                var textureProperties = this.properties.get(target.texture);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + target.activeCubeFace, textureProperties.__webglTexture, 0);
            }
        }

        this.state.viewport(0, 0, target.width, target.height);
    }

    /**
     * clear buffer
     */
    Renderer.prototype.clear = function(color, depth, stencil) {
        var gl = this.gl;

        var bits = 0;

        if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;

        gl.clear(bits);
    }

    /**
     * alloc texture unit
     **/
    Renderer.prototype.allocTexUnit = function() {
        var textureUnit = this._usedTextureUnits;

        if (textureUnit >= this.capabilities.maxTextures) {

            console.warn('trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);

        }

        this._usedTextureUnits += 1;

        return textureUnit;
    }

    Renderer.prototype.setupVertexAttributes = function(program, geometry) {
        var gl = this.gl;
        var attributes = program.attributes;
        for (var key in attributes) {
            var attribute = attributes[key];
            var format = geometry.vertexFormat[key];
            if(format) {
                if(attribute.count !== format.size) {
                    console.warn("Renderer: attribute " + key + " size not match!");
                }
                gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, format.normalized, 4 * format.stride, 4 * format.offset);
                gl.enableVertexAttribArray(attribute.location);
            } else {
                console.warn("Renderer: attribute " + key + " not found!");
            }
        }
    }

    zen3d.Renderer = Renderer;
})();