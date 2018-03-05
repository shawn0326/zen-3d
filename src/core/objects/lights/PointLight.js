(function() {
    /**
     * PointLight
     * @class
     */
    var PointLight = function() {
        PointLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.POINT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        this.shadow = new zen3d.PointLightShadow();
    }

    zen3d.inherit(PointLight, zen3d.Light);

    PointLight.prototype.copy = function(source) {
        PointLight.superClass.copy.call(this, source);

        this.shadow.copy(source.shadow);

        return this;
    }

    zen3d.PointLight = PointLight;
})();
