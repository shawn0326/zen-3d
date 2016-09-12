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
            // alpha: false, // effect performance, default false
            // premultipliedAlpha: false, // effect performance, default false
            stencil: true
        });
        // width and height, same with the canvas
        this.width = view.clientWidth;
        this.height = view.clientHeight;

        // array buffer
        this.vertices = new Float32Array(2000 * 4 * 5);
        this.vertexBuffer = gl.createBuffer();
        this.indices = new Uint16Array(2000 * 6);
        this.indexBuffer = gl.createBuffer();

        // init webgl
        gl.enable(gl.STENCIL_TEST);
        gl.enable(gl.DEPTH_TEST);

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

        this.camera = camera;

        scene.updateMatrix();

        this.cache.cache(scene);

        this.cache.sort();

        this.flush();

        this.cache.clear();
    }

    /**
     * flush
     */
    Renderer.prototype.flush = function() {
        this.flushList(this.cache.opaqueObjects);
        this.flushList(this.cache.transparentObjects);
    }

    Renderer.prototype.flushList = function(renderList) {
        var camera = this.camera;

        var vertices = this.vertices;
        var indices = this.indices;

        var ambientLights = this.cache.ambientLights;
        var directLights = this.cache.directLights;
        var pointLights = this.cache.pointLights;
        var ambientLightsNum = ambientLights.length;
        var directLightsNum = directLights.length;
        var pointLightsNum = pointLights.length;
        var lightsNum = ambientLightsNum + directLightsNum + pointLightsNum;

        for(var i = 0, l = renderList.length; i < l; i++) {

            var object = renderList[i];
            var geometry = object.geometry;
            var material = object.material;
            var lights = this.lights;

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

            var program = zen3d.getProgram(gl, material, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum
            ]);
            var uniforms = program.uniforms;
            var attributes = program.attributes;
            gl.useProgram(program.id);

            var a_Position = attributes.a_Position.location;
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 17, 0);
            gl.enableVertexAttribArray(a_Position);

            var projectionMat = camera.projectionMatrix.elements;
            gl.uniformMatrix4fv(uniforms.u_Projection.location, false, projectionMat);

            var viewMatrix = camera.viewMatrix.elements;
            gl.uniformMatrix4fv(uniforms.u_View.location, false, viewMatrix);

            var modelMatrix = object.worldMatrix.elements;
            gl.uniformMatrix4fv(uniforms.u_Model.location, false, modelMatrix);

            gl.uniform1f(uniforms.u_Opacity.location, material.opacity);

            /////////////////light
            var basic = material.type == MATERIAL_TYPE.BASIC;

            if(!basic) {
                for(var k = 0; k < ambientLightsNum; k++) {
                    var light = ambientLights[k];

                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Ambient_intensity = uniforms["u_Ambient[" + k + "].intensity"].location;
                    var u_Ambient_color = uniforms["u_Ambient[" + k + "].color"].location;
                    gl.uniform4f(u_Ambient_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                    gl.uniform1f(u_Ambient_intensity, intensity);
                }

                var helpMatrix = new zen3d.Matrix4();
                for(var k = 0; k < directLightsNum; k++) {
                    var light = directLights[k];

                    var intensity = light.intensity;
                    var direction = light.direction;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"].location;
                    var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"].location;
                    var u_Directional_color = uniforms["u_Directional[" + k + "].color"].location;
                    gl.uniform3f(u_Directional_direction, direction.x, direction.y, direction.z);
                    gl.uniform1f(u_Directional_intensity, intensity);
                    gl.uniform4f(u_Directional_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                }

                for(var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

                    var position = light.position;
                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Point_position = uniforms["u_Point[" + k + "].position"].location;
                    gl.uniform3f(u_Point_position, position.x, position.y, position.z);
                    var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"].location;
                    gl.uniform1f(u_Point_intensity, intensity);
                    var u_Point_color = uniforms["u_Point[" + k + "].color"].location;
                    gl.uniform4f(u_Point_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                }

                if(directLightsNum > 0) {
                    var viewITMatrix = helpMatrix.copy(camera.viewMatrix).inverse().transpose().elements;
                    // var viewITMatrix = camera.viewMatrix.elements;
                    // console.log(viewITMatrix)
                    gl.uniformMatrix4fv(uniforms.u_ViewITMat.location, false, viewITMatrix);
                }

                if(pointLightsNum > 0 || (directLightsNum > 0 && material.type == MATERIAL_TYPE.PHONE)) {
                    var viewMatrix = camera.viewMatrix.elements;
                    gl.uniformMatrix4fv(uniforms.u_ViewMat.location, false, viewMatrix);
                }

                if(directLightsNum > 0 || pointLightsNum > 0) {

                    var a_Normal = attributes.a_Normal.location;
                    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 4 * 17, 4 * 3);
                    gl.enableVertexAttribArray(a_Normal);

                    if(material.normalMap) {
                        gl.activeTexture(gl.TEXTURE1);
                        gl.bindTexture(gl.TEXTURE_2D, material.normalMap.glTexture);
                        gl.uniform1i(uniforms.normalMap.location, 1);

                        // console.log(uniforms)
                        // console.log(gl.getProgramParameter(program.id, gl.ACTIVE_UNIFORMS))
                        // console.log(camera.viewMatrix)
                        // var mat = helpMatrix.copy(camera.viewMatrix).multiply(object.worldMatrix).inverse().transpose().elements;
                        // var mat = helpMatrix.identify().inverse().transpose().elements;
                        // gl.uniformMatrix4fv(uniforms.u_VMITMat.location, false, mat);

                    }
                }

                if(material.type == MATERIAL_TYPE.PHONE) {
                    var eye = camera.position;
                    var u_Eye = gl.getUniformLocation(program.id, "u_Eye");
                    gl.uniform3f(u_Eye, eye.x, eye.y, eye.z);

                    var specular = material.specular;
                    var u_Specular = gl.getUniformLocation(program.id, "u_Specular");
                    gl.uniform1f(u_Specular, specular);
                }
            }
            /////////////////

            if(material.map) {
                var a_Uv = attributes.a_Uv.location;
                gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 4 * 17, 4 * 13);
                gl.enableVertexAttribArray(a_Uv);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, material.map.glTexture);
                gl.uniform1i(uniforms.texture.location, 0);
            } else {
                var color = zen3d.hex2RGB(material.color);
                gl.uniform4f(uniforms.u_Color.location, color[0] / 255, color[1] / 255, color[2] / 255, 1);

                if((directLightsNum > 0 || pointLightsNum > 0) && material.normalMap) {
                    var a_Uv = attributes.a_Uv.location;
                    gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 4 * 17, 4 * 13);
                    gl.enableVertexAttribArray(a_Uv);

                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, material.map.glTexture);
                    gl.uniform1i(uniforms.texture.location, 0);
                }
            }

            if(material.transparent) {
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            } else {
                gl.disable(gl.BLEND);
            }

            // draw
            gl.drawElements(gl.TRIANGLES, indicesIndex, gl.UNSIGNED_SHORT, 0);
        }
    }

    zen3d.Renderer = Renderer;
})();
