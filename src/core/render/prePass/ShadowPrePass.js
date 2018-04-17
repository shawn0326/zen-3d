(function() {
    var ShadowPrePass = function() {
        this.depthMaterial = new zen3d.DepthMaterial();
        this.depthMaterial.packToRGBA = true;

        this.distanceMaterial = new zen3d.DistanceMaterial();
    }

    ShadowPrePass.prototype.render = function(renderer) {
        var state = renderer.state;

        var lights = renderer.cache.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == zen3d.LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;
            var renderList = renderer.cache.shadowObjects;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                renderer.texture.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                renderer.renderer.clear(true, true);

                if (renderList.length == 0) {
                    continue;
                }

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                renderer.renderer.renderPass(renderer, renderList, camera, {
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
    }

    zen3d.ShadowPrePass = ShadowPrePass;
})();