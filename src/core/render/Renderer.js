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

        camera.viewMatrix.getInverse(camera.worldMatrix);// update view matrix

        this.cache.cacheScene(scene, camera);

        this.cache.sort();

        this.renderShadow();

        if(renderTarget === undefined) {
            renderTarget = null;
        }
        this.setRenderTarget(renderTarget);

        if(this.autoClear || forceClear) {
            this.state.clearColor(0, 0, 0, 0);
            this.clear(true, true, true);
        }

        this.renderList(this.cache.opaqueObjects);
        this.renderList(this.cache.transparentObjects);

        this.cache.clear();

        if(renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }
    }

    /**
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
        var renderList = this.cache.shadowObjects;

        if(renderList.length == 0) {
            return;
        }

        var gl = this.gl;

        var lights = this.cache.shadowLights;
        for(var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            for(var j = 0; j < faces; j++) {

                if(isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                this.setRenderTarget(shadowTarget);

                this.state.clearColor(1, 1, 1, 1);
                this.clear(true, true);

                for(var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = object.material;

                    var offset = this._uploadGeometry(object.geometry);

                    var program = zen3d.getDepthProgram(gl, this);
                    gl.useProgram(program.id);

                    var location = program.attributes.a_Position.location;
                    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 0);
                    gl.enableVertexAttribArray(location);

                    // update uniforms
                    var uniforms = program.uniforms;
                    for(var key in uniforms) {
                        var location = uniforms[key].location;
                        switch(key) {
                            // pvm matrix
                            case "u_Projection":
                                var projectionMat = camera.projectionMatrix.elements;
                                gl.uniformMatrix4fv(location, false, projectionMat);
                                break;
                            case "u_View":
                                var viewMatrix = camera.viewMatrix.elements;
                                gl.uniformMatrix4fv(location, false, viewMatrix);
                                break;
                            case "u_Model":
                                var modelMatrix = object.worldMatrix.elements;
                                gl.uniformMatrix4fv(location, false, modelMatrix);
                                break;
                            case "lightPos":
                                helpVector3.setFromMatrixPosition(light.worldMatrix);
                                gl.uniform3f(location, helpVector3.x, helpVector3.y, helpVector3.z);
                        }
                    }

                    this.state.setBlend(BLEND_TYPE.NONE);

                    // draw
                    gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);
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

        for(var i = 0, l = renderList.length; i < l; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = renderItem.material;

            var offset = this._uploadGeometry(renderItem.geometry);

            // get program
            var program = zen3d.getProgram(gl, this, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ], fog);
            gl.useProgram(program.id);

            // update attributes
            var attributes = program.attributes;
            for(var key in attributes) {
                var location = attributes[key].location;
                switch(key) {
                    case "a_Position":
                        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 0);
                        break;
                    case "a_Normal":
                        gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 4 * 17, 4 * 3);
                        break;
                    case "a_Uv":
                        gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 4 * 17, 4 * 13);
                        break;
                    default:
                        console.warn("attribute " + key + " not found!");
                }
                gl.enableVertexAttribArray(location);
            }

            // update uniforms
            var uniforms = program.uniforms;
            for(var key in uniforms) {
                var location = uniforms[key].location;
                switch(key) {

                    // pvm matrix
                    case "u_Projection":
                        var projectionMat = camera.projectionMatrix.elements;
                        gl.uniformMatrix4fv(location, false, projectionMat);
                        break;
                    case "u_View":
                        var viewMatrix = camera.viewMatrix.elements;
                        gl.uniformMatrix4fv(location, false, viewMatrix);
                        break;
                    case "u_Model":
                        var modelMatrix = object.worldMatrix.elements;
                        gl.uniformMatrix4fv(location, false, modelMatrix);
                        break;

                    case "u_Color":
                        var color = zen3d.hex2RGB(material.color);
                        gl.uniform3f(location, color[0] / 255, color[1] / 255, color[2] / 255);
                        break;
                    case "u_Opacity":
                        gl.uniform1f(location, material.opacity);
                        break;

                    case "texture":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.map, slot);
                        gl.uniform1i(location, slot);
                        break;
                    case "normalMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.normalMap, slot);
                        gl.uniform1i(location, slot);
                        break;
                    case "envMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.envMap, slot);
                        gl.uniform1i(location, slot);
                        break;
                    case "cubeMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(material.cubeMap, slot);
                        gl.uniform1i(location, slot);
                        break;

                    case "u_EnvMap_Intensity":
                        gl.uniform1f(location, material.envMapIntensity);
                        break;
                    case "u_Specular":
                        var specular = material.specular;
                        gl.uniform1f(location, specular);
                        break;
                    case "u_SpecularColor":
                        var color = zen3d.hex2RGB(material.specularColor);
                        gl.uniform4f(location, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        gl.uniform3f(location, helpVector3.x, helpVector3.y, helpVector3.z);
                        break;
                    case "u_FogColor":
                        var color = zen3d.hex2RGB(fog.color);
                        gl.uniform3f(location, color[0] / 255, color[1] / 255, color[2] / 255);
                        break;
                    case "u_FogDensity":
                        var density = fog.density;
                        gl.uniform1f(location, density);
                        break;
                    case "u_FogNear":
                        var near = fog.near;
                        gl.uniform1f(location, near);
                        break;
                    case "u_FogFar":
                        var far = fog.far;
                        gl.uniform1f(location, far);
                        break;
                }
            }

            /////////////////light
            var basic = material.type == MATERIAL_TYPE.BASIC;
            var cube = material.type == MATERIAL_TYPE.CUBE;

            if(!basic && !cube) {
                for(var k = 0; k < ambientLightsNum; k++) {
                    var light = ambientLights[k];

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Ambient_intensity = uniforms["u_Ambient[" + k + "].intensity"].location;
                    var u_Ambient_color = uniforms["u_Ambient[" + k + "].color"].location;
                    gl.uniform4f(u_Ambient_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    gl.uniform1f(u_Ambient_intensity, intensity);
                }


                for(var k = 0; k < directLightsNum; k++) {
                    var light = directLights[k];

                    var intensity = light.intensity;
                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);
                    var color = zen3d.hex2RGB(light.color);

                    var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"].location;
                    var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"].location;
                    var u_Directional_color = uniforms["u_Directional[" + k + "].color"].location;
                    gl.uniform3f(u_Directional_direction, helpVector3.x, helpVector3.y, helpVector3.z);
                    gl.uniform1f(u_Directional_intensity, intensity);
                    gl.uniform4f(u_Directional_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);

                    // shadow
                    var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"].location;
                    gl.uniform1i(u_Directional_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow) {
                        var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(directionalShadowMatrix, false, light.shadow.matrix.elements);

                        var directionalShadowMap = uniforms["directionalShadowMap[" + k + "]"].location;
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        gl.uniform1i(directionalShadowMap, slot);
                    }

                }

                for(var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);
                    var distance = light.distance;
                    var decay = light.decay;

                    var u_Point_position = uniforms["u_Point[" + k + "].position"].location;
                    gl.uniform3f(u_Point_position, helpVector3.x, helpVector3.y, helpVector3.z);
                    var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"].location;
                    gl.uniform1f(u_Point_intensity, intensity);
                    var u_Point_color = uniforms["u_Point[" + k + "].color"].location;
                    gl.uniform4f(u_Point_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    var u_Point_distance = uniforms["u_Point[" + k + "].distance"].location;
                    gl.uniform1f(u_Point_distance, distance);
                    var u_Point_decay = uniforms["u_Point[" + k + "].decay"].location;
                    gl.uniform1f(u_Point_decay, decay);

                    // shadow
                    var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"].location;
                    gl.uniform1i(u_Point_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow) {
                        var pointShadowMap = uniforms["pointShadowMap[" + k + "]"].location;
                        var slot = this.allocTexUnit();
                        this.texture.setTextureCube(light.shadow.map, slot);
                        gl.uniform1i(pointShadowMap, slot);
                    }
                }

                for(var k = 0; k < spotLightsNum; k++) {
                    var light = spotLights[k];

                    helpVector3.setFromMatrixPosition(light.worldMatrix).applyMatrix4(camera.viewMatrix);

                    var u_Spot_position = uniforms["u_Spot[" + k + "].position"].location;
                    gl.uniform3f(u_Spot_position, helpVector3.x, helpVector3.y, helpVector3.z);

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);
                    var distance = light.distance;
                    var decay = light.decay;

                    light.getWorldDirection(helpVector3);
                    helpVector3.transformDirection(camera.viewMatrix);

                    var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"].location;
                    gl.uniform3f(u_Spot_direction, helpVector3.x, helpVector3.y, helpVector3.z);

                    var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"].location;
                    gl.uniform1f(u_Spot_intensity, intensity);
                    var u_Spot_color = uniforms["u_Spot[" + k + "].color"].location;
                    gl.uniform4f(u_Spot_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"].location;
                    gl.uniform1f(u_Spot_distance, distance);
                    var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"].location;
                    gl.uniform1f(u_Spot_decay, decay);

                    var coneCos = Math.cos( light.angle );
                    var penumbraCos = Math.cos( light.angle * ( 1 - light.penumbra ) );
                    var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"].location;
                    gl.uniform1f(u_Spot_coneCos, coneCos);
                    var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"].location;
                    gl.uniform1f(u_Spot_penumbraCos, penumbraCos);

                    // shadow
                    var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"].location;
                    gl.uniform1i(u_Spot_shadow, light.castShadow ? 1 : 0);

                    if(light.castShadow && object.receiveShadow) {
                        var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(spotShadowMatrix, false, light.shadow.matrix.elements);

                        var spotShadowMap = uniforms["spotShadowMap[" + k + "]"].location;
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(light.shadow.map, slot);
                        gl.uniform1i(spotShadowMap, slot);
                    }
                }
            }
            ///////

            if(material.transparent) {
                this.state.setBlend(BLEND_TYPE.NORMAL, material.premultipliedAlpha);
            } else {
                this.state.setBlend(BLEND_TYPE.NONE);
            }

            // draw
            gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }
    }

    /**
     * update geometry to GPU
     * @return offset {number}
     */
    Renderer.prototype._uploadGeometry = function(geometry) {
        return geometry.bind(this);
    }

    /**
     * set render target
     */
    Renderer.prototype.setRenderTarget = function(target) {
        var gl = this.gl;

        if(!target) {
            if(this._currentRenderTarget === target) {

            } else {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);

                this._currentRenderTarget = null;

                this.state.viewport(0, 0, this.width, this.height);
            }

            return;
        }

        var isCube = target.activeCubeFace !== undefined;

        if(this._currentRenderTarget !== target) {
            if(!isCube) {
                this.texture.setRenderTarget2D(target);
            } else {
                this.texture.setRenderTargetCube(target);
            }

            this._currentRenderTarget = target;
        } else {
            if(isCube) {
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

		if ( color === undefined || color ) bits |= gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= gl.STENCIL_BUFFER_BIT;

		gl.clear( bits );
    }

    /**
     * alloc texture unit
     **/
    Renderer.prototype.allocTexUnit = function() {
        var textureUnit = this._usedTextureUnits;

		if ( textureUnit >= this.capabilities.maxTextures ) {

			console.warn( 'trying to use ' + textureUnit + ' texture units while this GPU supports only ' + capabilities.maxTextures );

		}

		this._usedTextureUnits += 1;

		return textureUnit;
    }

    zen3d.Renderer = Renderer;
})();
