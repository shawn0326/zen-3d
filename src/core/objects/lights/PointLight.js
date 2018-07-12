(function() {

    // imports
    var Light = zen3d.Light;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;
    var PointLightShadow = zen3d.PointLightShadow;

    /**
     * PointLight
     * @class
     */
    function PointLight() {
        Light.call(this);

        this.lightType = LIGHT_TYPE.POINT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        this.shadow = new PointLightShadow();
    }

    PointLight.prototype = Object.assign(Object.create(Light.prototype), {

        constructor: PointLight,

        copy: function(source) {
            Light.prototype.copy.call(this, source);
    
            this.shadow.copy(source.shadow);
    
            return this;
        }
    });

    // exports
    zen3d.PointLight = PointLight;
    
})();
