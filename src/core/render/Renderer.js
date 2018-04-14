(function() {
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    var RENDER_LAYER = zen3d.RENDER_LAYER;
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

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

        this.shadowType = zen3d.SHADOW_TYPE.PCF_SOFT;

        this.clippingPlanes = []; // Planes array

        this.gammaFactor = 2.0;
    	this.gammaInput = false;
    	this.gammaOutput = false;

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

        this.renderer = new zen3d.WebGLRenderer(gl, state, properties, capabilities, this.texture, this.geometry);

        this.performance = new zen3d.Performance();

        this.depthMaterial = new zen3d.DepthMaterial();
        this.depthMaterial.packToRGBA = true;
        this.distanceMaterial = new zen3d.DistanceMaterial();

        // object cache
        this.cache = new zen3d.RenderCache();

        this._currentRenderTarget = null;

        this._currentViewport = new zen3d.Vector4(0, 0, this.width, this.height);

        this.shadowAutoUpdate = true;
        this.shadowNeedsUpdate = false
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
        var useStencil = this.state.states[this.gl.STENCIL_TEST];
        if(useStencil) {
            this.state.disable(this.gl.STENCIL_TEST);
        }
        this.renderShadow();
        if(useStencil) {
            this.state.enable(this.gl.STENCIL_TEST);
        }
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
        var renderLists = this.cache.renderLists;
        for(var i = 0; i < LAYER_RENDER_LIST.length; i++) {
            var layer = LAYER_RENDER_LIST[i];
            // TODO separate different renderers to avoid branchs
            if(layer === RENDER_LAYER.SPRITE) {
                this.renderSprites(renderLists[layer]);
            } else if(layer === RENDER_LAYER.PARTICLE) {
                this.renderParticles(renderLists[layer]);
            } else {
                this.renderer.renderPass(this, renderLists[layer], camera, {
                    getMaterial: function(renderable) {
                        return scene.overrideMaterial || renderable.material;
                    },
                    lights: this.cache.lights,
                    fog: this.cache.fog,
                    clippingPlanes: this.clippingPlanes
                });
            }
        }
        performance.endCounter("renderList");

        this.cache.clear();

        if (renderTarget) {
            this.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    /**
     * TODO use PrePass insteads
     * render shadow map for lights
     */
    Renderer.prototype.renderShadow = function() {
		if ( this.shadowAutoUpdate === false && this.shadowNeedsUpdate === false ) return;

        var gl = this.gl;
        var state = this.state;

        var lights = this.cache.lights.shadows;
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
                    continue;
                }

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                this.renderer.renderPass(this, renderList, camera, {
                    getMaterial: function(renderable) {
                        // copy draw side
                        material.side = renderable.material.side;
                        return material;
                    }
                });

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }

        this.shadowNeedsUpdate = false;
    }

    var spritePosition = new zen3d.Vector3();
    var spriteRotation = new zen3d.Quaternion();
    var spriteScale = new zen3d.Vector3();

    /**
     * TODO use renderPass instead 
     */
    Renderer.prototype.renderSprites = function(sprites) {
        if (sprites.length === 0) {
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
        this.renderer.setupVertexAttributes(program, geometry);

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
            var material = sprites[i].material;

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

            this.renderer.setStates(material);

            var slot = this.renderer.allocTexUnit();
            this.texture.setTexture2D(material.diffuseMap, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(material.drawMode, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this.renderer._usedTextureUnits = 0;
        }

    }

    /**
     * TODO use renderPass instead 
     */
    Renderer.prototype.renderParticles = function(particles) {
        if (particles.length === 0) {
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
            this.renderer.setupVertexAttributes(program, geometry);

            var uniforms = program.uniforms;
            uniforms.uTime.setValue(particle.time);
            uniforms.uScale.setValue(1);

            uniforms.u_Projection.setValue(camera.projectionMatrix.elements);
            uniforms.u_View.setValue(camera.viewMatrix.elements);
            uniforms.u_Model.setValue(particle.worldMatrix.elements);

            var slot = this.renderer.allocTexUnit();
            this.texture.setTexture2D(particle.particleNoiseTex, slot);
            uniforms.tNoise.setValue(slot);

            var slot = this.renderer.allocTexUnit();
            this.texture.setTexture2D(particle.particleSpriteTex, slot);
            uniforms.tSprite.setValue(slot);

            this.renderer.setStates(material);

            gl.drawArrays(material.drawMode, 0, geometry.getAttribute("a_Position").count);

            this.renderer._usedTextureUnits = 0;
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

    Renderer.prototype.getCurrentRenderTarget = function() {
        return this._currentRenderTarget;
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

    zen3d.Renderer = Renderer;
})();