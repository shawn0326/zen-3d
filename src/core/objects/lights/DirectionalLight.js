(function() {
    /**
     * DirectionalLight
     * @class
     */
    var DirectionalLight = function() {
        DirectionalLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.DIRECT;
    }

    zen3d.inherit(DirectionalLight, zen3d.Light);

    zen3d.DirectionalLight = DirectionalLight;
})();
