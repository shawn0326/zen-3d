(function() {
    var ShadowMapPass = function() {
        this.depthMaterial = new zen3d.DepthMaterial();
        this.depthMaterial.packToRGBA = true;

        this.distanceMaterial = new zen3d.DistanceMaterial();
    }

    ShadowMapPass.prototype.render = function(renderer, scene) {
        
        var state = renderer.renderer.state;

        // force disable stencil
        var useStencil = state.states[renderer.gl.STENCIL_TEST];
        if(useStencil) {
            state.disable(renderer.gl.STENCIL_TEST);
        }

        var lights = scene.cache.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;
            var renderList = scene.cache.shadowObjects;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                renderer.renderer.texture.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                renderer.renderer.clear(true, true);

                if (renderList.length == 0) {
                    continue;
                }

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                renderer.renderer.renderPass(renderList, camera, {
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

        if(useStencil) {
            state.enable(renderer.gl.STENCIL_TEST);
        }
    }

    zen3d.ShadowMapPass = ShadowMapPass;
})();