(function() {
    
    // imports
    var Light = zen3d.Light;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;
    var SpotLightShadow = zen3d.SpotLightShadow;

    /**
     * SpotLight
     * @class
     */
    function SpotLight() {
        Light.call(this);

        this.lightType = LIGHT_TYPE.SPOT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        // from 0 to 1
        this.penumbra = 0;

        this.angle = Math.PI / 6;

        this.shadow = new SpotLightShadow();
    }

    SpotLight.prototype = Object.assign(Object.create(Light.prototype), {

        constructor: SpotLight,

        copy: function(source) {
            Light.prototype.copy.call(this, source);
    
            this.shadow.copy(source.shadow);
    
            return this;
        }
    });

    // exports
    zen3d.SpotLight = SpotLight;

})();
