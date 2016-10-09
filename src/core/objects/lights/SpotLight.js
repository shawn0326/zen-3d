(function() {
    /**
     * SpotLight
     * @class
     */
    var SpotLight = function() {
        SpotLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.SPOT;

        // decay of this light
        this.decay = 2;

        // distance of this light
        this.distance = 200;

        // TODO does not support lights with rotated
        // direction of this light
        this.direction = new zen3d.Vector3();

        this.penumbra = 0;

        this.angle = Math.PI / 3;
    }

    zen3d.inherit(SpotLight, zen3d.Light);

    zen3d.SpotLight = SpotLight;
})();
