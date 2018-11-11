(function() {
    var BlurPass = function() {
        zen3d.ShaderPostPass.call(this, zen3d.BlurShader);

        this.setKernelSize(5);
    }

    BlurPass.prototype = Object.assign(Object.create(zen3d.ShaderPostPass.prototype), {
        constructor: BlurPass,

        setKernelSize: function(val) {
            if(val == 13) {
                this.material.defines["KERNEL_SIZE_INT"] = 13;
                this.material.defines["KERNEL_SIZE_FLOAT"] = "13.0";
                this.uniforms["kernel"] = [0.02, 0.03, 0.06, 0.08, 0.11, 0.13, 0.14, 0.13, 0.11, 0.08, 0.06, 0.03, 0.02];
            } else if(val == 9) {
                this.material.defines["KERNEL_SIZE_INT"] = 9;
                this.material.defines["KERNEL_SIZE_FLOAT"] = "9.0";
                this.uniforms["kernel"] = [0.07, 0.09, 0.12, 0.14, 0.16, 0.14, 0.12, 0.09, 0.07];
            } else {
                this.material.defines["KERNEL_SIZE_INT"] = 5;
                this.material.defines["KERNEL_SIZE_FLOAT"] = "5.0";
                this.uniforms["kernel"] = [0.122581, 0.233062, 0.288713, 0.233062, 0.122581];
            }
        }
    });

    zen3d.BlurPass = BlurPass;
})();