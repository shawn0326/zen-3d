(function() {
    var RENDER_LAYER = zen3d.RENDER_LAYER;
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

    var ShadowMapPass = function() {
        this.depthMaterial = new zen3d.DepthMaterial();
        this.depthMaterial.packToRGBA = true;

        this.distanceMaterial = new zen3d.DistanceMaterial();
    }

    ShadowMapPass.prototype.render = function(glCore, scene) {
        
        var gl = glCore.gl;
        var state = glCore.state;

        // force disable stencil
        var useStencil = state.states[gl.STENCIL_TEST];
        if(useStencil) {
            state.disable(gl.STENCIL_TEST);
        }

        var lights = scene.cache.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;
            var renderLists = scene.cache.renderLists;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                glCore.texture.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                glCore.clear(true, true);

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                // ignore transparent objects
                glCore.renderPass(renderLists[RENDER_LAYER.DEFAULT], camera, {
                    getMaterial: function(renderable) {
                        // copy draw side
                        material.side = renderable.material.side;
                        return material;
                    },
                    ifRender: function(renderable) {
                        return renderable.object.castShadow;
                    }
                });

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }

        if(useStencil) {
            state.enable(gl.STENCIL_TEST);
        }
    }

    zen3d.ShadowMapPass = ShadowMapPass;
})();