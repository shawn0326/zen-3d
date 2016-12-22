(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;

    /**
     * Renderer
     * @class
     */
    var Renderer = function(view) {

        // canvas
        this.view = view;
        // gl context
        var gl = this.gl = view.getContext("webgl", {
            antialias: true, // effect performance!! default false
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
        state.setCullFace(CULL_FACE_TYPE.FRONT);
        state.viewport(0, 0, this.width, this.height);
        state.clearColor(0, 0, 0, 0);
        this.state = state;

        this.texture = new zen3d.WebGLTexture(gl, state, properties, capabilities);

        this.geometry = new zen3d.WebGLGeometry(gl, state, properties, capabilities);

        // object cache
        this.cache = new zen3d.RenderCache();

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "GL_OES_standard_derivatives");

        this._usedTextureUnits = 0;

        this._currentRenderTarget = null;
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.width = width;
        this.height = height;

        this.view.width = width;
        this.view.height = height;

        this.state.viewport(0, 0, width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {

        scene.updateMatrix();

        camera.viewMatrix.getInverse(camera.worldMatrix); // update view matrix

        this.cache.cacheScene(scene, camera);

        this.cache.sort();

        this.renderShadow();

        if (renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.state.clearColor(0, 0, 0, 0);
            this.clear(true, true, true);
        }

        this.renderList(this.cache.opaqueObjects);
        this.renderList(this.cache.transparentObjects);
        this.renderList(this.cache.canvas2dObjects);

        this.renderSprites(this.cache.sprites);

        this.cache.clear();

        if (renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var renderList = this.cache.shadowObjects;

        if (renderList.length == 0) {
            return;
        }

        var gl = this.gl;

        var lights = this.cache.shadowLights;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                this.setRenderTarget(shadowTarget);

                this.state.clearColor(1, 1, 1, 1);
                this.clear(true, true);

                for (var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = object.material;

                    this.geometry.setGeometry(object.geometry);

                    var program = zen3d.getDepthProgram(gl, this);
                    gl.useProgram(program.id);

                    var a_Position = program.attributes.a_Position;
                    gl.vertexAttribPointer(a_Position.location, a_Position.count, a_Position.format, false, 4 * 17, 0);
                    gl.enableVertexAttribArray(a_Position.location);

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
                        }
                    }

                    this.state.setBlend(BLEND_TYPE.NONE);
                    this.state.enable(gl.DEPTH_TEST);

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

            this.geometry.setGeometry(geometry);

            var program = zen3d.getProgram(gl, this, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ], fog);
            gl.useProgram(program.id);

            // update attributes
            var attributes = program.attributes;
            for (var key in attributes) {
                var attribute = attributes[key];
                switch (key) {
                    case "a_Position":
                        gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 0);
                        break;
                    case "a_Normal":
                        gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 3);
                        break;
                    case "a_Uv":
                        if (object.type === zen3d.OBJECT_TYPE.CANVAS2D) {
                            gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 3);
                        } else {
                            gl.vertexAttribPointer(attribute.location, attribute.count, attribute.format, false, 4 * geometry.vertexSize, 4 * 13);
                        }
                        break;
                    default:
                        console.warn("attribute " + key + " not found!");
                }
                gl.enableVertexAttribArray(attribute.location);
            }

            // update uniforms
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
                        var color = material.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_Opacity":
                        uniform.setValue(material.opacity);
                        break;

                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.map, slot);
                        uniform.setValue(slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        uniform.setValue(slot);
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
                        uniform.setValue(material.specular);
                        break;
                    case "u_SpecularColor":
                        var color = material.specularColor;
                        uniform.setValue(color.r, color.g, color.b, 1);
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
                }
            }

            /////////////////light
            var basic = material.type === MATERIAL_TYPE.BASIC;
            var cube = material.type === MATERIAL_TYPE.CUBE;
            var points = material.type === MATERIAL_TYPE.POINT;
            var canvas2d = object.type === zen3d.OBJECT_TYPE.CANVAS2D;

            if (!basic && !cube && !points && !canvas2d) {
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
                this.state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                this.state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                this.state.enable(gl.DEPTH_TEST);
            } else {
                this.state.disable(gl.DEPTH_TEST);
            }

            // draw
            if (object.type === zen3d.OBJECT_TYPE.POINT) {
                gl.drawArrays(gl.POINTS, 0, geometry.getVerticesCount());
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

        // bind a shared geometry
        this.geometry.setGeometry(zen3d.Sprite.geometry);

        var program = zen3d.getSpriteProgram(gl, this);
        gl.useProgram(program.id);

        var attributes = program.attributes;
        var position = attributes.position;
        gl.vertexAttribPointer(position.location, position.count, position.format, false, 2 * 8, 0);
        gl.enableVertexAttribArray(position.location);
        var uv = attributes.uv;
        gl.vertexAttribPointer(uv.location, uv.count, uv.format, false, 2 * 8, 8);
        gl.enableVertexAttribArray(uv.location);

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

            if (material.map !== null) {
                // TODO offset
                // uniforms.uvOffset.setValue(uniforms.uvOffset, material.map.offset.x, material.map.offset.y);
                // uniforms.uvScale.setValue(uniforms.uvScale, material.map.repeat.x, material.map.repeat.y);
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            } else {
                uniforms.uvOffset.setValue(0, 0);
                uniforms.uvScale.setValue(1, 1);
            }

            uniforms.opacity.setValue(material.opacity);
            uniforms.color.setValue(material.color.r, material.color.g, material.color.b);

            uniforms.rotation.setValue(material.rotation);
            uniforms.scale.setValue(scale[0], scale[1]);

            // set blend
            if (material.transparent) {
                this.state.setBlend(material.blending, material.premultipliedAlpha);
            } else {
                this.state.setBlend(BLEND_TYPE.NONE);
            }

            // set depth test
            if (material.depthTest) {
                this.state.enable(gl.DEPTH_TEST);
            } else {
                this.state.disable(gl.DEPTH_TEST);
            }

            var slot = this.allocTexUnit();
            this.texture.setTexture2D(material.map, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
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

                this.state.viewport(0, 0, this.width, this.height);
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

    zen3d.Renderer = Renderer;
})();