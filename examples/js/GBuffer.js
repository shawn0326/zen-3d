(function() {

    var debugTypes = {
        normal: 0,
        depth: 1,
        position: 2,
        glossiness: 3,
        metalness: 4,
        albedo: 5
    };

    var helpMatrix4 = new zen3d.Matrix4();

    function GBuffer(width, height) {

        this._renderTarget1 = new zen3d.RenderTarget2D(width, height);
        this._renderTarget1.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this._renderTarget1.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this._renderTarget1.texture.pixelType = zen3d.WEBGL_PIXEL_TYPE.HALF_FLOAT;
        this._renderTarget1.texture.generateMipmaps = false;  

        this._depthTexture = zen3d.Texture2D.createDepthTexture(false); // higher precision for depth
        this._renderTarget1.attach(
            this._depthTexture,
            zen3d.ATTACHMENT.DEPTH_ATTACHMENT
        );

        this._texture2 = new zen3d.Texture2D();
        this._texture2.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._texture2.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._texture2.generateMipmaps = false;

        this._useMRT = false;

        this._renderTarget2 = new zen3d.RenderTarget2D(width, height);
        this._renderTarget2.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._renderTarget2.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._renderTarget2.texture.generateMipmaps = false;

        this._normalGlossinessMaterial = new zen3d.ShaderMaterial(zen3d.GBufferShader.normalGlossiness);

        this._albedoMetalnessMaterial = new zen3d.ShaderMaterial(zen3d.GBufferShader.albedoMetalness);

        this._MRTMaterial = new zen3d.ShaderMaterial(zen3d.GBufferShader.MRT);

        this._debugPass = new zen3d.ShaderPostPass(zen3d.GBufferShader.debug);

        this.enableNormalGlossiness = true;

        this.enableAlbedoMetalness = true;

    }

    Object.assign(GBuffer.prototype, {

        /**
         * Set G Buffer size.
         * @param {number} width
         * @param {number} height
         */
        resize: function(width, height) {

            this._renderTarget1.resize(width, height);
            this._renderTarget2.resize(width, height);

        },

        update: function(glCore, scene, camera) {

            var renderList = scene.getRenderList(camera);

            // Use MRT if support
            if (glCore.capabilities.version === 2 || glCore.capabilities.drawBuffersExt) {

                if (!this._useMRT) {
                    this._useMRT = true;

                    if (glCore.capabilities.version === 2) {
                        // todo webgl2 pixel type
                        this._renderTarget1.texture.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_BYTE;

                        this._renderTarget1.detach(zen3d.ATTACHMENT.DEPTH_STENCIL_ATTACHMENT);
                        this._depthTexture.pixelFormat =  zen3d.WEBGL_PIXEL_FORMAT.DEPTH_COMPONENT;
                        this._depthTexture.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_INT;
                        this._renderTarget1.attach(
                            this._depthTexture,
                            zen3d.ATTACHMENT.DEPTH_ATTACHMENT
                        );
                    }

                    this._renderTarget1.attach(
                        this._texture2,
                        zen3d.ATTACHMENT.COLOR_ATTACHMENT1
                    );
                }

                var mrtMaterial = this._MRTMaterial;

                glCore.texture.setRenderTarget(this._renderTarget1);

                glCore.state.clearColor(0, 0, 0, 0);
                glCore.clear(true, true, true);

                glCore.renderPass(renderList.opaque, camera, {
                    scene: scene,
                    getMaterial: function(renderable) {
                        if(!renderable.geometry.attributes["a_Normal"]) {
                            mrtMaterial.shading = zen3d.SHADING_TYPE.FLAT_SHADING;
                        } else {
                            mrtMaterial.shading = zen3d.SHADING_TYPE.SMOOTH_SHADING;
                        }

                        mrtMaterial.diffuse.copy(renderable.material.diffuse);

                        // ignore if alpha < 0.99
                        if(renderable.material.diffuseMap) { 
                            mrtMaterial.defines["USE_DIFFUSE_MAP"] = "";
                            mrtMaterial.defines["ALPHATEST"] = 0.999;
                            mrtMaterial.diffuseMap = renderable.material.diffuseMap;
                        } else {
                            mrtMaterial.defines["USE_DIFFUSE_MAP"] = false;
                            mrtMaterial.defines["ALPHATEST"] = false;
                            mrtMaterial.diffuseMap = null;
                        }

                        if (renderable.material.roughness !== undefined) {
                            mrtMaterial.uniforms["roughness"] = renderable.material.roughness;
                        } else {
                            mrtMaterial.uniforms["roughness"] = 0.5;
                        }

                        if (renderable.material.roughnessMap) {
                            mrtMaterial.roughnessMap = renderable.material.roughnessMap;
                        } else {
                            mrtMaterial.roughnessMap = null;
                        }

                        if (renderable.material.metalness !== undefined) {
                            mrtMaterial.uniforms["metalness"] = renderable.material.metalness;
                        } else {
                            mrtMaterial.uniforms["metalness"] = 0.5;
                        }
    
                        if (renderable.material.metalnessMap) {
                            mrtMaterial.metalnessMap = renderable.material.metalnessMap;
                        } else {
                            mrtMaterial.metalnessMap = null;
                        }

                        return mrtMaterial;
                    },
                    ifRender: function(renderable) {
                        return !!renderable.geometry.getAttribute("a_Normal");
                    }
                });

                return;

            }

            // render normalDepthRenderTarget

            if (this.enableNormalGlossiness) {

                var normalGlossinessMaterial = this._normalGlossinessMaterial;

                glCore.texture.setRenderTarget(this._renderTarget1);

                glCore.state.clearColor(0, 0, 0, 0);
                glCore.clear(true, true, true);

                glCore.renderPass(renderList.opaque, camera, {
                    scene: scene,
                    getMaterial: function(renderable) {
                        if(!renderable.geometry.attributes["a_Normal"]) {
                            normalGlossinessMaterial.shading = zen3d.SHADING_TYPE.FLAT_SHADING;
                        } else {
                            normalGlossinessMaterial.shading = zen3d.SHADING_TYPE.SMOOTH_SHADING;
                        }

                        // ignore if alpha < 0.99
                        if(renderable.material.diffuseMap) { 
                            normalGlossinessMaterial.defines["USE_DIFFUSE_MAP"] = "";
                            normalGlossinessMaterial.defines["ALPHATEST"] = 0.999;
                            normalGlossinessMaterial.diffuseMap = renderable.material.diffuseMap;
                        } else {
                            normalGlossinessMaterial.defines["USE_DIFFUSE_MAP"] = false;
                            normalGlossinessMaterial.defines["ALPHATEST"] = false;
                            normalGlossinessMaterial.diffuseMap = null;
                        }

                        if (renderable.material.roughness !== undefined) {
                            normalGlossinessMaterial.uniforms["roughness"] = renderable.material.roughness;
                        } else {
                            normalGlossinessMaterial.uniforms["roughness"] = 0.5;
                        }

                        if (renderable.material.roughnessMap) {
                            normalGlossinessMaterial.roughnessMap = renderable.material.roughnessMap;
                        } else {
                            normalGlossinessMaterial.roughnessMap = null;
                        }

                        return normalGlossinessMaterial;
                    },
                    ifRender: function(renderable) {
                        return !!renderable.geometry.getAttribute("a_Normal");
                    }
                });

            }

            // render albedoMetalnessRenderTarget

            if (this.enableAlbedoMetalness) {

                var albedoMetalnessMaterial = this._albedoMetalnessMaterial;

                glCore.texture.setRenderTarget(this._renderTarget2);
    
                glCore.state.clearColor(0, 0, 0, 0);
                glCore.clear(true, true, true);
    
                glCore.renderPass(renderList.opaque, camera, {
                    scene: scene,
                    getMaterial: function(renderable) {
                        albedoMetalnessMaterial.diffuse.copy(renderable.material.diffuse);
                        albedoMetalnessMaterial.diffuseMap = renderable.material.diffuseMap;
                        
                        if (renderable.material.metalness !== undefined) {
                            albedoMetalnessMaterial.uniforms["metalness"] = renderable.material.metalness;
                        } else {
                            albedoMetalnessMaterial.uniforms["metalness"] = 0.5;
                        }
    
                        if (renderable.material.metalnessMap) {
                            albedoMetalnessMaterial.metalnessMap = renderable.material.metalnessMap;
                        } else {
                            albedoMetalnessMaterial.metalnessMap = null;
                        }
    
                        return albedoMetalnessMaterial;
                    },
                    ifRender: function(renderable) {
                        return !!renderable.geometry.getAttribute("a_Normal");
                    }
                });

            }

        },

        /**
         * Debug output of gBuffer. Use `type` parameter to choos the debug output type, which can be:
         *
         * + 'normal'
         * + 'depth'
         * + 'position'
         * + 'glossiness'
         * + 'metalness'
         * + 'albedo'
         *
         * @param {zen3d.GLCore} renderer
         * @param {zen3d.Camera} camera
         * @param {string} [type='normal']
         */
        renderDebug: function(glCore, camera, type) {
            this._debugPass.uniforms["normalGlossinessTexture"] = this.getNormalGlossinessTexture();
            this._debugPass.uniforms["depthTexture"] = this.getDepthTexture();
            this._debugPass.uniforms["albedoMetalnessTexture"] = this.getAlbedoMetalnessTexture();
            this._debugPass.uniforms["debug"] = debugTypes[type] || 0;
            this._debugPass.uniforms["viewWidth"] = glCore.state.currentRenderTarget.width;
            this._debugPass.uniforms["viewHeight"] = glCore.state.currentRenderTarget.height;
            helpMatrix4.multiplyMatrices(camera.projectionMatrix, camera.viewMatrix).inverse();
            this._debugPass.uniforms["matProjViewInverse"].set(helpMatrix4.elements);
            this._debugPass.render(glCore);
        },

        /**
         * Get normal glossiness texture.
         * Channel storage:
         * + R: normal.x * 0.5 + 0.5
         * + G: normal.y * 0.5 + 0.5
         * + B: normal.z * 0.5 + 0.5
         * + A: glossiness
         * @return {zen3d.Texture2D}
         */
        getNormalGlossinessTexture: function() {
            return this._renderTarget1.texture;
        },

        /**
         * Get depth texture.
         * Channel storage:
         * + R: depth
         * @return {zen3d.TextureDepth}
         */
        getDepthTexture: function() {
            return this._depthTexture;
        },

        /**
         * Get albedo metalness texture.
         * Channel storage:
         * + R: albedo.r
         * + G: albedo.g
         * + B: albedo.b
         * + A: metalness
         * @return {zen3d.Texture2D}
         */
        getAlbedoMetalnessTexture: function() {
            return this._useMRT ? this._texture2 : this._renderTarget2.texture;
        },

        dispose: function() {

            this._renderTarget1.dispose();
            this._renderTarget2.dispose();

            this._depthTexture.dispose();
            this._texture2.dispose();

        }

    });

    zen3d.GBuffer = GBuffer;

})();