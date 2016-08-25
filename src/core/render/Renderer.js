(function() {
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
        gl.enable(gl.BLEND);

        // lights
        this.lights = {
            directLights: new Array(),
            ambientLights: new Array(),
            pointLights: new Array()
        };

        // render list
        this.opaqueObjects = new Array();
        this.transparentObjects = new Array();

        // camera
        this.camera = null;
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera) {

        this.clear();

        this.camera = camera;

        scene.updateMatrix();

        this.cacheObjects(scene);

        // sort display list
        // opaque objects render from front to back
        this.opaqueObjects.sort(function(a, b) {
            var za = a.position.z;
            var zb = b.position.z;
            return za - zb;
        });

        // transparent objects render from back to front
        this.transparentObjects.sort(function(a, b) {
            var za = a.position.z;
            var zb = b.position.z;
            return zb - za;
        });

        this.flush();
    }

    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;
    var MATERIAL_TYPE = zen3d.MATERIAL_TYPE;
    /**
     * cache object
     */
    Renderer.prototype.cacheObjects = function(object) {

        switch (object.type) {
            case OBJECT_TYPE.MESH:
                this.cacheObject(object);
                break;
            case OBJECT_TYPE.LIGHT:
                if(object.lightType == LIGHT_TYPE.AMBIENT) {
                    this.lights.ambientLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.DIRECT) {
                    this.lights.directLights.push(object);
                } else if(object.lightType == LIGHT_TYPE.POINT) {
                    this.lights.pointLights.push(object);
                }
                break;
            case OBJECT_TYPE.CAMERA:
                // do nothing
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

        var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			this.cacheObjects(children[i]);

		}
    }

    /**
     * cache object
     */
    Renderer.prototype.cacheObject = function(object) {
        var material = object.material;

        if(material.type == MATERIAL_TYPE.TEXTURE) {
            if(!material.checkMapInit()) {
                return;
            }
        }

        if(material.transparent) {
            this.transparentObjects.push(object);
        } else {
            this.opaqueObjects.push(object);
        }
    }

    /**
     * flush
     */
    Renderer.prototype.flush = function() {
        this.flushList(this.opaqueObjects);
        this.flushList(this.transparentObjects);
    }

    Renderer.prototype.flushList = function(renderList) {
        var camera = this.camera;

        var vertices = this.vertices;
        var indices = this.indices;

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

            var program = zen3d.getProgram(gl, material, lights);
            gl.useProgram(program.id);

            var a_Position = gl.getAttribLocation(program.id, "a_Position");
            gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 4 * 17, 0);
            gl.enableVertexAttribArray(a_Position);

            var a_Normal = gl.getAttribLocation(program.id, "a_Normal");
            gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 4 * 17, 4 * 3);
            gl.enableVertexAttribArray(a_Normal);

            var projectionMat = camera.projectionMatrix.elements;
            var u_Projection = gl.getUniformLocation(program.id, "u_Projection");
            gl.uniformMatrix4fv(u_Projection, false, projectionMat);

            var viewMatrix = camera.viewMatrix.elements;
            var u_View = gl.getUniformLocation(program.id, "u_View");
            gl.uniformMatrix4fv(u_View, false, viewMatrix);

            var modelMatrix = object.worldMatrix.elements;
            var u_Model = gl.getUniformLocation(program.id, "u_Model");
            gl.uniformMatrix4fv(u_Model, false, modelMatrix);

            /////////////////light
            var ambientLights = lights.ambientLights;
            for(var k = 0; k < ambientLights.length; k++) {
                var light = ambientLights[k];

                var intensity = light.intensity;
                var color = zen3d.hex2RGB(light.color);

                var u_Ambient_intensity = gl.getUniformLocation(program.id, "u_Ambient[" + k + "].intensity");
                var u_Ambient_color = gl.getUniformLocation(program.id, "u_Ambient[" + k + "].color");
                gl.uniform4f(u_Ambient_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
                gl.uniform1f(u_Ambient_intensity, intensity);
            }

            var directLights = lights.directLights;
            var helpMatrix = new zen3d.Matrix4();
            for(var k = 0; k < directLights.length; k++) {
                var light = directLights[k];

                var intensity = light.intensity;
                var direction = light.direction;
                var color = zen3d.hex2RGB(light.color);

                var u_Directional_direction = gl.getUniformLocation(program.id, "u_Directional[" + k + "].direction");
                var u_Directional_intensity = gl.getUniformLocation(program.id, "u_Directional[" + k + "].intensity");
                var u_Directional_color = gl.getUniformLocation(program.id, "u_Directional[" + k + "].color");
                gl.uniform3f(u_Directional_direction, direction.x, direction.y, direction.z);
                gl.uniform1f(u_Directional_intensity, intensity);
                gl.uniform4f(u_Directional_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
            }

            var pointLights = lights.pointLights;
            for(var k = 0; k < pointLights.length; k++) {
                var light = pointLights[k];

                var position = light.position;
                var intensity = light.intensity;
                var color = zen3d.hex2RGB(light.color);

                var u_Point_position = gl.getUniformLocation(program.id, "u_Point[" + k + "].position");
                gl.uniform3f(u_Point_position, position.x, position.y, position.z);
                var u_Point_intensity = gl.getUniformLocation(program.id, "u_Point[" + k + "].intensity");
                gl.uniform1f(u_Point_intensity, intensity);
                var u_Point_color = gl.getUniformLocation(program.id, "u_Point[" + k + "].color");
                gl.uniform4f(u_Point_color, color[0] / 255, color[1] / 255, color[2] / 255, 1);
            }

            if(directLights.length > 0) {
                var viewITMatrix = helpMatrix.copy(camera.viewMatrix).inverse().transpose().elements;
                var u_ViewITMat = gl.getUniformLocation(program.id, "u_ViewITMat");
                gl.uniformMatrix4fv(u_ViewITMat, false, viewITMatrix);
            } else if(pointLights.length > 0) {
                var viewMatrix = camera.viewMatrix.elements;
                var u_ViewMat = gl.getUniformLocation(program.id, "u_ViewMat");
                gl.uniformMatrix4fv(u_ViewMat, false, viewMatrix);
            }
            /////////////////

            if(material.type == MATERIAL_TYPE.COLOR) { // color

                var color = zen3d.hex2RGB(material.color);
                var u_Color = gl.getUniformLocation(program.id, "u_Color");
                gl.uniform4f(u_Color, color[0] / 255, color[1] / 255, color[2] / 255, 1);

            }
            else if(material.type == MATERIAL_TYPE.TEXTURE) { // texture

                var a_Uv = gl.getAttribLocation(program.id, "a_Uv");
                gl.vertexAttribPointer(a_Uv, 2, gl.FLOAT, false, 4 * 17, 4 * 13);
                gl.enableVertexAttribArray(a_Uv);

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, material.diffuseMap.glTexture);
            }

            // draw
            gl.drawElements(gl.TRIANGLES, indicesIndex, gl.UNSIGNED_SHORT, 0);
        }
    }

    /**
     * clear
     */
    Renderer.prototype.clear = function(object) {
        this.transparentObjects.length = 0;
        this.opaqueObjects.length = 0;
        this.lights.ambientLights.length = 0;
        this.lights.directLights.length = 0;
        this.lights.pointLights.length = 0;
        this.camera = null;
    }

    zen3d.Renderer = Renderer;
})();
