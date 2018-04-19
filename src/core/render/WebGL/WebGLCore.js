(function() {
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var BLEND_TYPE = zen3d.BLEND_TYPE;
    var DRAW_SIDE = zen3d.DRAW_SIDE;
    var WEBGL_UNIFORM_TYPE = zen3d.WEBGL_UNIFORM_TYPE;

    var helpVector3 = new zen3d.Vector3();

    var defaultGetMaterial = function(renderable) {
        return renderable.material;
    };

    var getClippingPlanesData = function() {
        var planesData;
        var plane = new zen3d.Plane();
        return function getClippingPlanesData(planes, camera) {
            if(!planesData || planesData.length < planes.length * 4) {
                planesData = new Float32Array(planes.length * 4);
            }

            for(var i = 0; i < planes.length; i++) {
                plane.copy(planes[i]).applyMatrix4(camera.viewMatrix);
                planesData[i * 4 + 0] = plane.normal.x;
                planesData[i * 4 + 1] = plane.normal.y;
                planesData[i * 4 + 2] = plane.normal.z;
                planesData[i * 4 + 3] = plane.constant;
            }
            return planesData;
        }
    }();

    /**
     * render method by WebGL.
     * just for render pass once in one render target
     */
    var WebGLCore = function(gl) {
        this.gl = gl;
        
        var properties = new zen3d.WebGLProperties();
        this.properties = properties;

        var capabilities = new zen3d.WebGLCapabilities(gl);
        this.capabilities = capabilities;

        var state = new zen3d.WebGLState(gl, capabilities);
        state.enable(gl.STENCIL_TEST);
        state.enable(gl.DEPTH_TEST);
        state.setCullFace(CULL_FACE_TYPE.BACK);
        state.setFlipSided(false);
        state.clearColor(0, 0, 0, 0);
        this.state = state;

        this.texture = new zen3d.WebGLTexture(gl, state, properties, capabilities);

        this.geometry = new zen3d.WebGLGeometry(gl, state, properties, capabilities);

        this._usedTextureUnits = 0;

        this._currentGeometryProgram = "";
    }

    /**
     * clear buffer
     */
    WebGLCore.prototype.clear = function(color, depth, stencil) {
        var gl = this.gl;

        var bits = 0;

        if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
        if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
        if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;

        gl.clear(bits);
    }

    /**
     * Render a single renderable list in camera in sequence
     * @param {Array} list List of all renderables.
     * @param {zen3d.Camera} camera Camera provide view matrix and porjection matrix.
     * @param {Object} [config] ?
     * @param {Function} [config.getMaterial] Get renderable material.
     * @param {RenderCache} [config.cache] render cache
     */
    WebGLCore.prototype.renderPass = function(renderList, camera, config) {
        config = config || {};

        var gl = this.gl;
        var state = this.state;

        var getMaterial = config.getMaterial || defaultGetMaterial;
        var cache = config.cache || {};
        
        var targetWidth = state.currentRenderTarget.width;
        var targetHeight = state.currentRenderTarget.height;

        for (var i = 0, l = renderList.length; i < l; i++) {

            var renderItem = renderList[i];
            var object = renderItem.object;
            var material = getMaterial.call(this, renderItem);
            var geometry = renderItem.geometry;
            var group = renderItem.group;

            var program = zen3d.getProgram(this, camera, material, object, cache);
            state.setProgram(program);

            this.geometry.setGeometry(geometry);

            var geometryProgram = program.uuid + "_" + geometry.uuid;
            if(geometryProgram !== this._currentGeometryProgram) {
                this.setupVertexAttributes(program, geometry);
                this._currentGeometryProgram = geometryProgram;
            }

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
                    case "aoMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.aoMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "aoMapIntensity":
                        uniform.setValue(material.aoMapIntensity);
                        break;
                    case "u_Roughness":
                        uniform.setValue(material.roughness);
                        break;
                    case "roughnessMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.roughnessMap, slot);
                        uniform.setValue(slot);
                        break;
                    case "u_Metalness":
                        uniform.setValue(material.metalness);
                        break;
                    case "metalnessMap":
                        var slot = this.allocTexUnit();
                        this.texture.setTexture2D(material.metalnessMap, slot);
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
                        var color = cache.fog.color;
                        uniform.setValue(color.r, color.g, color.b);
                        break;
                    case "u_FogDensity":
                        uniform.setValue(cache.fog.density);
                        break;
                    case "u_FogNear":
                        uniform.setValue(cache.fog.near);
                        break;
                    case "u_FogFar":
                        uniform.setValue(cache.fog.far);
                        break;
                    case "u_PointSize":
                        uniform.setValue(material.size);
                        break;
                    case "u_PointScale":
                        var scale = targetHeight * 0.5; // three.js do this
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
                    case "clippingPlanes[0]":
                        var planesData = getClippingPlanesData(cache.clippingPlanes || [], camera);
                        gl.uniform4fv(uniform.location, planesData);
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
            if(object.type === zen3d.OBJECT_TYPE.SKINNED_MESH) {
                this.uploadSkeleton(uniforms, object, program.id);
            }

            if (material.acceptLight && cache.lights) {
                this.uploadLights(uniforms, cache.lights, object.receiveShadow, camera, program.id);
            }

            var frontFaceCW = object.worldMatrix.determinant() < 0;
            this.setStates(material, frontFaceCW);

            if(object.type === zen3d.OBJECT_TYPE.CANVAS2D) {
                var curViewX, curViewY, curViewW, curViewH;
                if(object.isScreenCanvas) {
                    curViewX = state.currentViewport.x;
                    curViewY = state.currentViewport.y;
                    curViewW = state.currentViewport.z;
                    curViewH = state.currentViewport.w;
                    object.setRenderViewport(curViewX, curViewY, curViewW, curViewH);
                    state.viewport(object.viewport.x, object.viewport.y, object.viewport.z, object.viewport.w);
                }

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

                if(object.isScreenCanvas) {
                    state.viewport(curViewX, curViewY, curViewW, curViewH);
                }
            } else {
                this.draw(geometry, material, group);
            }

            // reset used tex Unit
            this._usedTextureUnits = 0;
        }
    }

    /**
     * @private
     * set states
     * @param {boolean} frontFaceCW
     */
    WebGLCore.prototype.setStates = function(material, frontFaceCW) {
        var gl = this.gl;
        var state = this.state;

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

        var flipSided = ( material.side === DRAW_SIDE.BACK );
		if ( frontFaceCW ) flipSided = ! flipSided;

        state.setFlipSided(flipSided);

        // set line width
        if(material.lineWidth !== undefined) {
            state.setLineWidth(material.lineWidth);
        }
    }

    /**
     * @private
     * gl draw
     */
    WebGLCore.prototype.draw = function(geometry, material, group) {
        var gl = this.gl;

        var useIndexBuffer = geometry.index !== null;

        var drawStart = 0;
        var drawCount = useIndexBuffer ? geometry.index.count : geometry.getAttribute("a_Position").count;
        var groupStart = group ? group.start : 0;
        var groupCount = group ? group.count : Infinity;
        drawStart = Math.max(drawStart, groupStart);
        drawCount = Math.min(drawCount, groupCount);

        if(useIndexBuffer) {
            gl.drawElements(material.drawMode, drawCount, gl.UNSIGNED_SHORT, drawStart * 2);
        } else {
            gl.drawArrays(material.drawMode, drawStart, drawCount);
        }
    }

    /**
     * @private
     * upload skeleton uniforms
     */
    WebGLCore.prototype.uploadSkeleton = function(uniforms, object, programId) {
        if(object.skeleton && object.skeleton.bones.length > 0) {
            var skeleton = object.skeleton;
            var gl = this.gl;

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
                var location = gl.getUniformLocation(programId, "boneMatrices");
                gl.uniformMatrix4fv(location, false, skeleton.boneMatrices);
            }
        }
    }

    var directShadowMaps = [];
    var pointShadowMaps = [];
    var spotShadowMaps = [];

    /**
     * @private
     * upload lights uniforms
     * TODO a better function for array & struct uniforms upload
     */
    WebGLCore.prototype.uploadLights = function(uniforms, lights, receiveShadow, camera, programId) {
        var gl = this.gl;

        if(lights.ambientsNum > 0) {
            uniforms.u_AmbientLightColor.set(lights.ambient);
        }

        for (var k = 0; k < lights.directsNum; k++) {
            var light = lights.directional[k];

            var u_Directional_direction = uniforms["u_Directional[" + k + "].direction"];
            u_Directional_direction.set(light.direction);
            var u_Directional_intensity = uniforms["u_Directional[" + k + "].intensity"];
            u_Directional_intensity.setValue(1);
            var u_Directional_color = uniforms["u_Directional[" + k + "].color"];
            u_Directional_color.set(light.color);

            var shadow = light.shadow && receiveShadow;

            var u_Directional_shadow = uniforms["u_Directional[" + k + "].shadow"];
            u_Directional_shadow.setValue(shadow ? 1 : 0);

            if(shadow) {
                var u_Directional_shadowBias = uniforms["u_Directional[" + k + "].shadowBias"];
                u_Directional_shadowBias.setValue(light.shadowBias);
                var u_Directional_shadowRadius = uniforms["u_Directional[" + k + "].shadowRadius"];
                u_Directional_shadowRadius.setValue(light.shadowRadius);
                var u_Directional_shadowMapSize = uniforms["u_Directional[" + k + "].shadowMapSize"];
                u_Directional_shadowMapSize.set(light.shadowMapSize);

                var slot = this.allocTexUnit();
                this.texture.setTexture2D(lights.directionalShadowMap[k], slot);
                directShadowMaps[k] = slot;
            }
        }
        if(directShadowMaps.length > 0) {
            var directionalShadowMap = uniforms["directionalShadowMap[0]"];
            gl.uniform1iv(directionalShadowMap.location, directShadowMaps);

            directShadowMaps.length = 0;

            var directionalShadowMatrix = uniforms["directionalShadowMatrix[0]"];
            gl.uniformMatrix4fv(directionalShadowMatrix.location, false, lights.directionalShadowMatrix);
        }

        for (var k = 0; k < lights.pointsNum; k++) {
            var light = lights.point[k];

            var u_Point_position = uniforms["u_Point[" + k + "].position"];
            u_Point_position.set(light.position);
            var u_Point_intensity = uniforms["u_Point[" + k + "].intensity"];
            u_Point_intensity.setValue(1);
            var u_Point_color = uniforms["u_Point[" + k + "].color"];
            u_Point_color.set(light.color);
            var u_Point_distance = uniforms["u_Point[" + k + "].distance"];
            u_Point_distance.setValue(light.distance);
            var u_Point_decay = uniforms["u_Point[" + k + "].decay"];
            u_Point_decay.setValue(light.decay);

            var shadow = light.shadow && receiveShadow;

            var u_Point_shadow = uniforms["u_Point[" + k + "].shadow"];
            u_Point_shadow.setValue(shadow ? 1 : 0);

            if (shadow) {
                var u_Point_shadowBias = uniforms["u_Point[" + k + "].shadowBias"];
                u_Point_shadowBias.setValue(light.shadowBias);
                var u_Point_shadowRadius = uniforms["u_Point[" + k + "].shadowRadius"];
                u_Point_shadowRadius.setValue(light.shadowRadius);
                var u_Point_shadowMapSize = uniforms["u_Point[" + k + "].shadowMapSize"];
                u_Point_shadowMapSize.set(light.shadowMapSize);
                var u_Point_shadowCameraNear = uniforms["u_Point[" + k + "].shadowCameraNear"];
                u_Point_shadowCameraNear.setValue(light.shadowCameraNear);
                var u_Point_shadowCameraFar = uniforms["u_Point[" + k + "].shadowCameraFar"];
                u_Point_shadowCameraFar.setValue(light.shadowCameraFar);

                var slot = this.allocTexUnit();
                this.texture.setTextureCube(lights.pointShadowMap[k], slot);
                pointShadowMaps[k] = slot;
            }
        }
        if(pointShadowMaps.length > 0) {
            var pointShadowMap = uniforms["pointShadowMap[0]"];
            gl.uniform1iv(pointShadowMap.location, pointShadowMaps);

            pointShadowMaps.length = 0;
        }

        for (var k = 0; k < lights.spotsNum; k++) {
            var light = lights.spot[k];

            var u_Spot_position = uniforms["u_Spot[" + k + "].position"];
            u_Spot_position.set(light.position);
            var u_Spot_direction = uniforms["u_Spot[" + k + "].direction"];
            u_Spot_direction.set(light.direction);
            var u_Spot_intensity = uniforms["u_Spot[" + k + "].intensity"];
            u_Spot_intensity.setValue(1);
            var u_Spot_color = uniforms["u_Spot[" + k + "].color"];
            u_Spot_color.set(light.color);
            var u_Spot_distance = uniforms["u_Spot[" + k + "].distance"];
            u_Spot_distance.setValue(light.distance);
            var u_Spot_decay = uniforms["u_Spot[" + k + "].decay"];
            u_Spot_decay.setValue(light.decay);
            var u_Spot_coneCos = uniforms["u_Spot[" + k + "].coneCos"];
            u_Spot_coneCos.setValue(light.coneCos);
            var u_Spot_penumbraCos = uniforms["u_Spot[" + k + "].penumbraCos"];
            u_Spot_penumbraCos.setValue(light.penumbraCos);

            var shadow = light.shadow && receiveShadow;

            var u_Spot_shadow = uniforms["u_Spot[" + k + "].shadow"];
            u_Spot_shadow.setValue(shadow ? 1 : 0);

            if (shadow) {
                var u_Spot_shadowBias = uniforms["u_Spot[" + k + "].shadowBias"];
                u_Spot_shadowBias.setValue(light.shadowBias);
                var u_Spot_shadowRadius = uniforms["u_Spot[" + k + "].shadowRadius"];
                u_Spot_shadowRadius.setValue(light.shadowRadius);
                var u_Spot_shadowMapSize = uniforms["u_Spot[" + k + "].shadowMapSize"];
                u_Spot_shadowMapSize.set(light.shadowMapSize);

                var slot = this.allocTexUnit();
                this.texture.setTexture2D(lights.spotShadowMap[k], slot);
                spotShadowMaps[k] = slot;
            }
        }
        if(spotShadowMaps.length > 0) {
            var spotShadowMap = uniforms["spotShadowMap[0]"];
            gl.uniform1iv(spotShadowMap.location, spotShadowMaps);

            spotShadowMaps.length = 0;

            var spotShadowMatrix = uniforms["spotShadowMatrix[0]"];
            gl.uniformMatrix4fv(spotShadowMatrix.location, false, lights.spotShadowMatrix);
        }
    }

    /**
     * @private
     * alloc texture unit
     */
    WebGLCore.prototype.allocTexUnit = function() {
        var textureUnit = this._usedTextureUnits;

        if (textureUnit >= this.capabilities.maxTextures) {

            console.warn('trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);

        }

        this._usedTextureUnits += 1;

        return textureUnit;
    }

    /**
     * @private 
     */
    WebGLCore.prototype.setupVertexAttributes = function(program, geometry) {
        var gl = this.gl;
        var attributes = program.attributes;
        var properties = this.properties;
        for (var key in attributes) {
            var programAttribute = attributes[key];
            var geometryAttribute = geometry.getAttribute(key);
            if(geometryAttribute) {
                var normalized = geometryAttribute.normalized;
				var size = geometryAttribute.size;
                if(programAttribute.count !== size) {
                    console.warn("WebGLCore: attribute " + key + " size not match! " + programAttribute.count + " : " + size);
                }

                var attribute;
                if(geometryAttribute.isInterleavedBufferAttribute) {
                    attribute = properties.get(geometryAttribute.data);
                } else {
                    attribute = properties.get(geometryAttribute);
                }
                var buffer = attribute.buffer;
				var type = attribute.type;
                if(programAttribute.format !== type) {
                    console.warn("WebGLCore: attribute " + key + " type not match! " + programAttribute.format + " : " + type);
                }
				var bytesPerElement = attribute.bytesPerElement;

                if(geometryAttribute.isInterleavedBufferAttribute) {
                    var data = geometryAttribute.data;
    				var stride = data.stride;
    				var offset = geometryAttribute.offset;

                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, programAttribute.format, normalized, bytesPerElement * stride, bytesPerElement * offset);
                    gl.enableVertexAttribArray(programAttribute.location);
                } else {
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.vertexAttribPointer(programAttribute.location, programAttribute.count, programAttribute.format, normalized, 0, 0);
                    gl.enableVertexAttribArray(programAttribute.location);
                }
            } else {
                console.warn("WebGLCore: geometry attribute " + key + " not found!");
            }
        }

        // bind index if could
        if(geometry.index) {
            var indexProperty = properties.get(geometry.index);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexProperty.buffer);
        }
    }

    zen3d.WebGLCore = WebGLCore;
})();