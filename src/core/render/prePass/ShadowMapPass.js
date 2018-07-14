import {DepthMaterial} from '../../material/DepthMaterial.js';
import {DistanceMaterial} from '../../material/DistanceMaterial.js';
import {LIGHT_TYPE} from '../../const.js';

function ShadowMapPass() {
    this.depthMaterial = new DepthMaterial();
    this.depthMaterial.packToRGBA = true;

    this.distanceMaterial = new DistanceMaterial();
}

Object.assign(ShadowMapPass.prototype, {

    render: function(glCore, scene) {
    
        var gl = glCore.gl;
        var state = glCore.state;

        // force disable stencil
        var useStencil = state.states[gl.STENCIL_TEST];
        if(useStencil) {
            state.disable(gl.STENCIL_TEST);
        }

        var lights = scene.lights.shadows;
        for (var i = 0; i < lights.length; i++) {
            var light = lights[i];

            var shadow = light.shadow;
            var camera = shadow.camera;
            var shadowTarget = shadow.renderTarget;
            var isPointLight = light.lightType == LIGHT_TYPE.POINT ? true : false;
            var faces = isPointLight ? 6 : 1;

            for (var j = 0; j < faces; j++) {

                if (isPointLight) {
                    shadow.update(light, j);
                    shadowTarget.activeCubeFace = j;
                } else {
                    shadow.update(light);
                }

                var renderList = scene.updateRenderList(camera);

                glCore.texture.setRenderTarget(shadowTarget);

                state.clearColor(1, 1, 1, 1);
                glCore.clear(true, true);

                var material = isPointLight ? this.distanceMaterial : this.depthMaterial;
                material.uniforms = material.uniforms || {};
                material.uniforms["nearDistance"] = shadow.cameraNear;
                material.uniforms["farDistance"] = shadow.cameraFar;

                glCore.renderPass(renderList.opaque, camera, {
                    getMaterial: function(renderable) {
                        // copy draw side
                        material.side = renderable.material.side;
                        return material;
                    },
                    ifRender: function(renderable) {
                        return renderable.object.castShadow;
                    }
                });

                // ignore transparent objects?

            }

            // set generateMipmaps false
            // this.texture.updateRenderTargetMipmap(shadowTarget);

        }

        if(useStencil) {
            state.enable(gl.STENCIL_TEST);
        }
    }

});

export {ShadowMapPass};