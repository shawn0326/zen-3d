(function() {
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

    var ForwardPass = function() {
        
    }

    ForwardPass.prototype.render = function(glCore, scene, camera) {
        var renderList = scene.updateRenderList(camera);

        glCore.renderPass(renderList.opaque, camera, {
            getMaterial: function(renderable) {
                return scene.overrideMaterial || renderable.material;
            },
            cache: scene
        });

        glCore.renderPass(renderList.transparent, camera, {
            getMaterial: function(renderable) {
                return scene.overrideMaterial || renderable.material;
            },
            cache: scene
        });

        // remove UI render from this pass
        glCore.renderPass(renderList.ui, camera, {
            getMaterial: function(renderable) {
                return scene.overrideMaterial || renderable.material;
            },
            cache: scene
        });
    }

    zen3d.ForwardPass = ForwardPass;
})();