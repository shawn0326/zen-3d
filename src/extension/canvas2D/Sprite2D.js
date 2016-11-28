(function() {
    var Sprite2D = function() {
        Sprite2D.superClass.constructor.call(this);

        this.texture = null;
    }

    zen3d.inherit(Sprite2D, zen3d.Object2D);

    zen3d.Sprite2D = Sprite2D;
})();