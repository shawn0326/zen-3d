(function() {
    
    var TemporalSuperSampling = function() {
        var prevFrame = new zen3d.RenderTarget2D(width, height);
        prevFrame.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        prevFrame.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        prevFrame.texture.generateMipmaps = false;

        this._prevFrame = prevFrame;
        
        var output = new zen3d.RenderTarget2D(width, height);
        output.texture.minFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        output.texture.magFilter = zen3d.WEBGL_TEXTURE_FILTER.LINEAR;
        output.texture.generateMipmaps = false;

        this._output = output;

        this._blendPass = new zen3d.ShaderPostPass(zen3d.BlendShader);
        this._blendPass.material.depthWrite = false;
        this._blendPass.material.depthTest = false;
    }
    
    TemporalSuperSampling.prototype = Object.assign(TemporalSuperSampling.prototype, {
    
        /**
         * @param {zen3d.GLCore} glCore
         * @param {zen3d.TextureBase} texture input texture
         * @param {boolean} first
         * @return {zen3d.TextureBase} output texture
         */
        sample: function(glCore, texture, first) {

            this._blendPass.uniforms["tDiffuse1"] = texture;
            this._blendPass.uniforms["tDiffuse2"] = this._prevFrame.texture;
            this._blendPass.uniforms["opacity1"] = first ? 1 : 0.1;
            this._blendPass.uniforms["opacity2"] = first ? 0 : 0.9;

            glCore.texture.setRenderTarget(this._output);

            glCore.state.clearColor(0, 0, 0, 0);
            glCore.clear(true, true, true);

            this._blendPass.render(glCore);

            var temp = this._prevFrame;
            this._prevFrame = this._output;
            this._output = temp;

            return this._prevFrame.texture;

        },

        /**
         * @return {zen3d.TextureBase} output texture
         */
        output: function() {
            return this._prevFrame.texture;
        }
    
    });

    zen3d.TemporalSuperSampling = TemporalSuperSampling;
})();