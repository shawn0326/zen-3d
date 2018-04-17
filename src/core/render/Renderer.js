(function() {
    var CULL_FACE_TYPE = zen3d.CULL_FACE_TYPE;
    

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
        var width = view.width;
        var height = view.height;

        this.autoClear = true;

        this.renderer = new zen3d.WebGLRenderer(gl);

        this.performance = new zen3d.Performance();

        this.shadowMapPass = new zen3d.ShadowMapPass();
        this.forwardPass = new zen3d.ForwardPass();

        // no texture & framebuffer in this render target
        // just create this as a flag
        this.backRenderTarget = new zen3d.RenderTargetBase(width, height);

        this.shadowAutoUpdate = true;
        this.shadowNeedsUpdate = false;
    }

    /**
     * resize
     */
    Renderer.prototype.resize = function(width, height) {
        this.view.width = width;
        this.view.height = height;

        this.setViewport(0, 0, width, height);
    }

    /**
     * setViewport
     */
    Renderer.prototype.setViewport = function(x, y, width, height) {
        this.backRenderTarget.viewport.set(x, y, width, height);
    }

    /**
     * render scene with camera
     */
    Renderer.prototype.render = function(scene, camera, renderTarget, forceClear) {
        var performance = this.performance;

        performance.updateFps();

        performance.startCounter("render", 60);

        camera.viewMatrix.getInverse(camera.worldMatrix); // update view matrix

        scene.update(camera); // update scene

        performance.startCounter("renderShadow", 60);   

        if ( this.shadowAutoUpdate || this.shadowNeedsUpdate ) {
            this.shadowMapPass.render(this, scene);

            this.shadowNeedsUpdate = false;
        }

        performance.endCounter("renderShadow");

        if (renderTarget === undefined) {
            renderTarget = this.backRenderTarget;
        }
        this.renderer.texture.setRenderTarget(renderTarget);

        if (this.autoClear || forceClear) {
            this.renderer.state.clearColor(0, 0, 0, 0);
            this.renderer.clear(true, true, true);
        }

        performance.startCounter("renderList", 60);
        this.forwardPass.render(this, scene);
        performance.endCounter("renderList");

        if (!!renderTarget.texture) {
            this.renderer.texture.updateRenderTargetMipmap(renderTarget);
        }

        this.performance.endCounter("render");
    }

    var spritePosition = new zen3d.Vector3();
    var spriteRotation = new zen3d.Quaternion();
    var spriteScale = new zen3d.Vector3();

    /**
     * TODO use renderPass instead 
     */
    Renderer.prototype.renderSprites = function(sprites, camera, fog) {
        if (sprites.length === 0) {
            return;
        }

        var gl = this.gl;
        var state = this.renderer.state;
        var geometry = zen3d.Sprite.geometry;
        var material = sprites[0].material;

        var program = zen3d.getProgram(gl, this.renderer, material);
        state.setProgram(program);

        // bind a shared geometry
        this.renderer.geometry.setGeometry(geometry);
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
            this.renderer.texture.setTexture2D(material.diffuseMap, slot);
            uniforms.map.setValue(slot);

            gl.drawElements(material.drawMode, 6, gl.UNSIGNED_SHORT, 0);

            // reset used tex Unit
            this.renderer._usedTextureUnits = 0;
        }

    }

    /**
     * TODO use renderPass instead 
     */
    Renderer.prototype.renderParticles = function(particles, camera) {
        if (particles.length === 0) {
            return;
        }

        var gl = this.gl;
        var state = this.renderer.state;

        for (var i = 0, l = particles.length; i < l; i++) {
            var particle = particles[i].object;
            var geometry = particles[i].geometry;
            var material = particles[i].material;

            var program = zen3d.getProgram(gl, this.renderer, material);
            state.setProgram(program);

            this.renderer.geometry.setGeometry(geometry);
            this.renderer.setupVertexAttributes(program, geometry);

            var uniforms = program.uniforms;
            uniforms.uTime.setValue(particle.time);
            uniforms.uScale.setValue(1);

            uniforms.u_Projection.setValue(camera.projectionMatrix.elements);
            uniforms.u_View.setValue(camera.viewMatrix.elements);
            uniforms.u_Model.setValue(particle.worldMatrix.elements);

            var slot = this.renderer.allocTexUnit();
            this.renderer.texture.setTexture2D(particle.particleNoiseTex, slot);
            uniforms.tNoise.setValue(slot);

            var slot = this.renderer.allocTexUnit();
            this.renderer.texture.setTexture2D(particle.particleSpriteTex, slot);
            uniforms.tSprite.setValue(slot);

            this.renderer.setStates(material);

            gl.drawArrays(material.drawMode, 0, geometry.getAttribute("a_Position").count);

            this.renderer._usedTextureUnits = 0;
        }
    }

    zen3d.Renderer = Renderer;
})();