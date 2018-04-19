(function() {
    var RENDER_LAYER = zen3d.RENDER_LAYER;
    var LAYER_RENDER_LIST = zen3d.LAYER_RENDER_LIST;

    var ForwardPass = function() {
        
    }

    ForwardPass.prototype.render = function(renderer, scene) {
        var camera = scene.cache.camera;

        var renderLists = scene.cache.renderLists;
        for(var i = 0; i < LAYER_RENDER_LIST.length; i++) {
            var layer = LAYER_RENDER_LIST[i];
            // TODO separate different renderers to avoid branchs
            if(layer === RENDER_LAYER.SPRITE) {
                renderer.renderSprites(renderLists[layer], camera, scene.cache.fog);
            } else if(layer === RENDER_LAYER.PARTICLE) {
                renderer.renderParticles(renderLists[layer], camera);
            } else {
                renderer.glCore.renderPass(renderLists[layer], camera, {
                    getMaterial: function(renderable) {
                        return scene.overrideMaterial || renderable.material;
                    },
                    cache: scene.cache
                });
            }
        }
    }

    zen3d.ForwardPass = ForwardPass;
})();