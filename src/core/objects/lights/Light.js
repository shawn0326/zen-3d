(function() {
    /**
     * Light
     * @class
     */
    var Light = function() {
        Light.superClass.constructor.call(this);

        this.type = zen3d.OBJECT_TYPE.LIGHT;

        this.lightType = "";

        // default light color is white
        this.color = new zen3d.Color3(0xffffff);

        // light intensity, default 1
        this.intensity = 1;
    }

    zen3d.inherit(Light, zen3d.Object3D);

    Light.prototype.copy = function(source) {
        Light.superClass.copy.call(this, source);

        this.type = source.type;
        this.lightType = source.lightType;
        this.color.copy(source.color);
        this.intensity = source.intensity;

        return this;
    }

    zen3d.Light = Light;
})();
