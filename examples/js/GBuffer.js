(function() {

    function GBuffer(width, height) {

        this._renderTarget1 = new zen3d.RenderTarget2D(width, height);
        this._renderTarget1.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this._renderTarget1.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.NEAREST;
        this._renderTarget1.texture.pixelType = zen3d.WEBGL_PIXEL_TYPE.HALF_FLOAT;
        this._renderTarget1.texture.generateMipmaps = false;
        this._renderTarget1.depthTexture = new zen3d.TextureDepth(width, height);
        this._renderTarget1.depthTexture.pixelType = zen3d.WEBGL_PIXEL_TYPE.UNSIGNED_INT_24_8;
        this._renderTarget1.depthTexture.pixelFormat = zen3d.WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;

        this._renderTarget2 = new zen3d.RenderTarget2D(width, height);
        this._renderTarget2.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._renderTarget2.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        this._renderTarget2.texture.generateMipmaps = false;

        this._normalGlossinessMaterial = new zen3d.ShaderMaterial(zen3d.GBufferShader.normalGlossiness);

        this._albedoMetalnessMaterial = new zen3d.ShaderMaterial(zen3d.GBufferShader.albedoMetalness);

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

            var normalGlossinessMaterial = this._normalGlossinessMaterial;
            var albedoMetalnessMaterial = this._albedoMetalnessMaterial;

            // TODO Use MRT if support

            var renderList = scene.getRenderList(camera);

            // render normalDepthRenderTarget

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

                    if (renderable.material.roughness !== undefined) {
                        normalGlossinessMaterial.uniforms["roughness"] = renderable.material.roughness;
                    } else {
                        normalGlossinessMaterial.uniforms["roughness"] = 0.5;
                    }

                    return normalGlossinessMaterial;
                },
                ifRender: function(renderable) {
                    // todo support more object type
                    if (renderable.object.material.type == zen3d.MATERIAL_TYPE.LINE) {
                        return false;
                    }
                    return renderable.object.type == zen3d.OBJECT_TYPE.MESH || renderable.object.type == zen3d.OBJECT_TYPE.SKINNED_MESH;
                }
            });

            // render albedoMetalnessRenderTarget

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
                },
                ifRender: function(renderable) {
                    // todo support more object type
                    if (renderable.object.material.type == zen3d.MATERIAL_TYPE.LINE) {
                        return false;
                    }
                    return renderable.object.type == zen3d.OBJECT_TYPE.MESH || renderable.object.type == zen3d.OBJECT_TYPE.SKINNED_MESH;
                }
            });

        },

        renderDebug: function(glCore, camera, type) {
            // TODO debug
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
            return this._renderTarget1.depthTexture;
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
            return this._renderTarget2.texture;
        },

        dispose: function() {

            this._renderTarget1.dispose();
            this._renderTarget2.dispose();

        }

    });

    zen3d.GBuffer = GBuffer;

})();