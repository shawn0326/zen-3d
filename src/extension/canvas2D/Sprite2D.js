(function() {

    var Sprite2D = function() {
        zen3d.Object2D.call(this);

        this.texture = null;
    }

    Sprite2D.prototype = Object.create(zen3d.Object2D.prototype);
    Sprite2D.prototype.constructor = Sprite2D;

    zen3d.Sprite2D = Sprite2D;
    
})();