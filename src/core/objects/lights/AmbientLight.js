(function() {

    // imports
    var Light = zen3d.Light;
    var LIGHT_TYPE = zen3d.LIGHT_TYPE;

    /**
     * AmbientLight
     * @class
     */
    function AmbientLight() {
        Light.call(this);

        this.lightType = LIGHT_TYPE.AMBIENT;
    }

    AmbientLight.prototype = Object.create(Light.prototype);
    AmbientLight.prototype.constructor = AmbientLight;

    // exports
    zen3d.AmbientLight = AmbientLight;

})();
