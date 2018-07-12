(function() {

    // imports
    var Light = zen3d.Light;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;
    var DirectionalLightShadow = zen3d.DirectionalLightShadow;

    /**
     * DirectionalLight
     * @class
     */
    function DirectionalLight() {
        Light.call(this);

        this.lightType = LIGHT_TYPE.DIRECT;

        this.shadow = new DirectionalLightShadow();
    }

    DirectionalLight.prototype = Object.assign(Object.create(Light.prototype), {

        constructor: DirectionalLight,

        copy: function(source) {
            Light.prototype.copy.call(this, source);
    
            this.shadow.copy(source.shadow);
            
            return this;
        }

    });

    // exports
    zen3d.DirectionalLight = DirectionalLight;

})();
