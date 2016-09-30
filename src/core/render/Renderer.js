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

            // get program
            var program = zen3d.getProgram(gl, material, [
                ambientLightsNum,
                directLightsNum,
                pointLightsNum
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
                        var position = camera.position;
                        gl.uniform3f(location, position.x, position.y, position.z);
                        break;
                }
            }

            /////////////////light
            var basic = material.type == MATERIAL_TYPE.BASIC;
            var cube = material.type == MATERIAL_TYPE.CUBE;
            var helpMatrix = new zen3d.Matrix4();
            var helpVector4 = new zen3d.Vector4();
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
                    var direction = light.direction;
                    var viewITMatrix = helpMatrix.copy(camera.viewMatrix).inverse().transpose();
                    helpVector4.set(direction.x, direction.y, direction.z, 1).applyMatrix4(viewITMatrix);
                    var color = zen3d.hex2RGB(light.color);

                    var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"].location;
                    var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"].location;
                    var u_Directional_color = uniforms["u_Directional[" + k + "].color"].location;
                    gl.uniform3f(u_Directional_direction, helpVector4.x, helpVector4.y, helpVector4.z);
                    gl.uniform1f(u_Directional_intensity, intensity);
                    gl.uniform4f(u_Directional_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                }

                for(var k = 0; k < pointLightsNum; k++) {
                    var light = pointLights[k];

                    var position = light.position;
                    var viewMatrix = camera.viewMatrix;
                    helpVector4.set(position.x, position.y, position.z, 1).applyMatrix4(viewMatrix);
                    var intensity = light.intensity;
                    var color = zen3d.hex2RGB(light.color);

                    var u_Point_position = uniforms["u_Point[" + k + "].position"].location;
                    gl.uniform3f(u_Point_position, helpVector4.x, helpVector4.y, helpVector4.z);
                    var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"].location;
                    gl.uniform1f(u_Point_intensity, intensity);
                    var u_Point_color = uniforms["u_Point[" + k + "].color"].location;
                    gl.uniform4f(u_Point_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
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
            gl.drawElements(gl.TRIANGLES, indicesIndex, gl.UNSIGNED_SHORT, 0);
        }
    }

    zen3d.Renderer = Renderer;
})();
