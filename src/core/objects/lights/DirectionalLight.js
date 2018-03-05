(function() {
    /**
     * DirectionalLight
     * @class
     */
    var DirectionalLight = function() {
        DirectionalLight.superClass.constructor.call(this);

        this.lightType = zen3d.LIGHT_TYPE.DIRECT;

        this.shadow = new zen3d.DirectionalLightShadow();
    }

    zen3d.inherit(DirectionalLight, zen3d.Light);

    DirectionalLight.prototype.copy = function(source) {
        DirectionalLight.superClass.copy.call(this, source);

        this.shadow.copy(source.shadow);
        
        return this;
    }

    zen3d.DirectionalLight = DirectionalLight;
})();
