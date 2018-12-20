import { DepthMaterial } from '../../material/DepthMaterial.js';
import { DistanceMaterial } from '../../material/DistanceMaterial.js';
import { LIGHT_TYPE } from '../../const.js';
import { Vector4 } from '../../math/Vector4.js';
import { Texture2D } from '../../texture/Texture2D.js';
import { WEBGL_TEXTURE_FILTER, WEBGL_PIXEL_FORMAT, WEBGL_PIXEL_TYPE, ATTACHMENT, WEBGL_COMPARE_FUNC } from '../../const.js';

function convertLightShadowToWebGL2(lightShadow) {
    if (!lightShadow.depthMap) {
        var depthTexture = new Texture2D();
        depthTexture.type = WEBGL_PIXEL_TYPE.FLOAT_32_UNSIGNED_INT_24_8_REV;
        depthTexture.format = WEBGL_PIXEL_FORMAT.DEPTH_STENCIL;
        depthTexture.internalformat = WEBGL_PIXEL_FORMAT.DEPTH32F_STENCIL8;
        depthTexture.magFilter = WEBGL_TEXTURE_FILTER.LINEAR;
        depthTexture.minFilter = WEBGL_TEXTURE_FILTER.LINEAR;
        depthTexture.compare = WEBGL_COMPARE_FUNC.LESS;
        depthTexture.generateMipmaps = false;
        lightShadow.renderTarget.attach(
            depthTexture,
            ATTACHMENT.DEPTH_STENCIL_ATTACHMENT
        );
        lightShadow.depthMap = depthTexture;
    }
}

/**
 * Shadow map pre pass.
 * @constructor
 * @memberof zen3d
 */
function ShadowMapPass() {
    this.depthMaterial = new DepthMaterial();
    this.depthMaterial.packToRGBA = true;

    this.distanceMaterial = new DistanceMaterial();

    this.oldClearColor = new Vector4();
}

/**
 * Render shadow map.
 * @param {zen3d.WebGLCore} glCore
 * @param {zen3d.Scene} scene
 */
ShadowMapPass.prototype.render = function(glCore, scene) {

    var gl = glCore.gl;
    var state = glCore.state;

    // force disable stencil
    var useStencil = state.states[gl.STENCIL_TEST];
    if (useStencil) {
        state.stencilBuffer.setTest(false);
    }

    this.oldClearColor.copy(state.colorBuffer.getClear());
    state.colorBuffer.setClear(1, 1, 1, 1);

    var lights = scene.lights.shadows;
    for (var i = 0; i < lights.length; i++) {
        var light = lights[i];

        var shadow = light.shadow;
        var camera = shadow.camera;
        var shadowTarget = shadow.renderTarget;
        var isPointLight = light.lightType == LIGHT_TYPE.POINT ? true : false;
        var faces = isPointLight ? 6 : 1;

        if (glCore.capabilities.version >= 2) {

            if (!isPointLight) {
                convertLightShadowToWebGL2(shadow);
            }

        }

        for (var j = 0; j < faces; j++) {

            if (isPointLight) {
                shadow.update(light, j);
                shadowTarget.activeCubeFace = j;
            } else {
                shadow.update(light);
            }

            var renderList = scene.updateRenderList(camera);

            glCore.renderTarget.setRenderTarget(shadowTarget);

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
        // glCore.renderTarget.updateRenderTargetMipmap(shadowTarget);

    }

    if (useStencil) {
        state.stencilBuffer.setTest(true);
    }

    state.colorBuffer.setClear(this.oldClearColor.x, this.oldClearColor.y, this.oldClearColor.z, this.oldClearColor.w);

}

export { ShadowMapPass };