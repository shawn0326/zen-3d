(function() {
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

    var ForwardPass = function() {
        
    }

    ForwardPass.prototype.render = function(glCore, scene) {
        var camera = scene.cache.camera;

        var renderLists = scene.cache.renderLists;
        for(var i = 0; i < LAYER_RENDER_LIST.length; i++) {
            var layer = LAYER_RENDER_LIST[i];
            glCore.renderPass(renderLists[layer], camera, {
                getMaterial: function(renderable) {
                    return scene.overrideMaterial || renderable.material;
                },
                cache: scene.cache
            });
        }
    }

    zen3d.ForwardPass = ForwardPass;
})();