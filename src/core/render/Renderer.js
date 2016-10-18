(function() {
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;

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
        this.width = view.clientWidth;
        this.height = view.clientHeight;

        // array buffer
        this.vertices = new Float32Array(524288);
        this.vertexBuffer = gl.createBuffer();
        this.indices = new Uint16Array(524288);
        this.indexBuffer = gl.createBuffer();

        // init webgl
        gl.enable(gl.STENCIL_TEST);
        gl.enable(gl.DEPTH_TEST);
        // cull face
        gl.enable(gl.CULL_FACE);
        // gl.FRONT_AND_BACK, gl.FRONT, gl.BACK
        gl.cullFace(gl.BACK);
        // gl.CW, gl.CCW
        gl.frontFace(gl.CW);

        // object cache
        this.cache = new zen3d.RenderCache();

        // camera
        this.camera = null;

        // use dfdx and dfdy must enable OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "OES_standard_derivatives");
        // GL_OES_standard_derivatives
        var ext = zen3d.getExtension(gl, "GL_OES_standard_derivatives");
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera) {

        scene.updateMatrix();

        camera.viewMatrix.getInverse(camera.worldMatrix);// update view matrix
        this.camera = camera;

        this.cache.cache(scene);

        this.cache.sort();

        this.renderShadow();

        this.flush();

        this.cache.clear();
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

            if(!light.shadow.isInit) {
                light.shadow.init(gl);
            }

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            this.setRenderTarget(shadowTarget);

            for(var j = 0; j < faces; j++) {

                if(isPointLight) {
                    shadow.update(light, j);
                    // bind faces
                    shadowTarget.bindTextureCube(shadow.map, j);
                } else {
                    shadow.update(light);
                }

                gl.clearColor(1., 1., 1., 1.);
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

                for(var n = 0, l = renderList.length; n < l; n++) {
                    var object = renderList[n];
                    var material = object.material;

                    var offset = this._uploadGeometry(object.geometry);

                    var program = zen3d.getDepthProgram(gl);
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

                    gl.disable(gl.BLEND);

                    // draw
                    gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);
                }

            }

            this.clearRenderTarget();
        }
    }

    /**
     * flush
     */
    Renderer.prototype.flush = function() {
        this.flushList(this.cache.opaqueObjects);
        this.flushList(this.cache.transparentObjects);
    }

    var helpVector3 = new zen3d.Vector3();

    Renderer.prototype.flushList = function(renderList) {
        var camera = this.camera;
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

            var object = renderList[i];
            var material = object.material;

            var offset = this._uploadGeometry(object.geometry);

            // get program
            var program = zen3d.getProgram(gl, object, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum,
                spotLightsNum
            ]);
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
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, material.map.glTexture);
                        gl.uniform1i(location, 0);
                        break;
                    case "normalMap":
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, material.normalMap.glTexture);
                        gl.uniform1i(location, 1);
                        break;
                    case "envMap":
                        gl.activeTexture(gl.TEXTURE2);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.envMap.glTexture);
                        gl.uniform1i(location, 2);
                        break;
                    case "cubeMap":
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, material.cubeMap.glTexture);
                        gl.uniform1i(location, 0);
                        break;

                    case "u_EnvMap_Intensity":
                        gl.uniform1f(location, material.envMapIntensity);
                        break;
                    case "u_Specular":
                        var specular = material.specular;
                        gl.uniform1f(location, specular);
                        break;
                    case "u_CameraPosition":
                        helpVector3.setFromMatrixPosition(camera.worldMatrix);
                        gl.uniform3f(location, helpVector3.x, helpVector3.y, helpVector3.z);
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

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var directionalShadowMatrix = uniforms["directionalShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(directionalShadowMatrix, false, light.shadow.matrix.elements);

                        var directionalShadowMap = uniforms["directionalShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_2D, light.shadow.map.glTexture);
                        gl.uniform1i(directionalShadowMap, 3);
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

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var pointShadowMap = uniforms["pointShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, light.shadow.map.glTexture);
                        gl.uniform1i(pointShadowMap, 3);
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

                    if(light.castShadow && object.receiveShadow && light.shadow.isInit) {
                        var spotShadowMatrix = uniforms["spotShadowMatrix[" + k + "]"].location;
                        gl.uniformMatrix4fv(spotShadowMatrix, false, light.shadow.matrix.elements);

                        var spotShadowMap = uniforms["spotShadowMap[" + k + "]"].location;
                        gl.activeTexture(gl.TEXTURE3);
                        gl.bindTexture(gl.TEXTURE_2D, light.shadow.map.glTexture);
                        gl.uniform1i(spotShadowMap, 3);
                    }
                }
            }
            ///////

            if(material.transparent) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.disable(gl.BLEND);
            }

            // draw
            gl.drawElements(gl.TRIANGLES, offset, gl.UNSIGNED_SHORT, 0);
        }
    }

    /**
     * update geometry to GPU
     * @return offset {number}
     */
    Renderer.prototype._uploadGeometry = function(geometry) {
        var vertices = this.vertices;
        var indices = this.indices;

        var verticesIndex = 0;
        var indicesIndex = 0;
        // copy vertices
        for(var j = 0, verticesArray = geometry.verticesArray, verticesLen = verticesArray.length; j < verticesLen; j++) {
            vertices[verticesIndex++] = verticesArray[j];
        }
        // copy indices
        for(var k = 0, indicesArray = geometry.indicesArray, indicesLen = indicesArray.length; k < indicesLen; k++) {
            indices[indicesIndex++] = indicesArray[k];
        }

        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        var vertices_view = vertices.subarray(0, verticesIndex);
        gl.bufferData(gl.ARRAY_BUFFER, vertices_view, gl.STREAM_DRAW);
        var indices_view = indices.subarray(0, indicesIndex);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices_view, gl.STATIC_DRAW);

        return indicesIndex;
    }

    /**
     * set render target
     */
    Renderer.prototype.setRenderTarget = function(target) {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, target.frameBuffer);

        gl.viewport(0, 0, target.width, target.height);
    }

    /**
     * clear render target
     */
    Renderer.prototype.clearRenderTarget = function() {
        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        gl.viewport(0, 0, this.width, this.height);
    }

    /**
     * clear buffer
     */
    Renderer.prototype.clear = function() {
        var gl = this.gl;

        gl.clearColor(0., 0., 0., 0.);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    zen3d.Renderer = Renderer;
})();
