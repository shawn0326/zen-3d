(function() {

    // imports
    var FOG_TYPE = zen3d.FOG_TYPE;
    var Color3 = zen3d.Color3;

    /**
     * Fog
     * @class
     */
    function Fog(color, near, far) {

        this.fogType = FOG_TYPE.NORMAL;

        this.color = new Color3( (color !== undefined) ? color : 0x000000 );

        this.near = (near !== undefined) ? near : 1;
        this.far = (far !== undefined) ? far : 1000;
    }

    // exports
    zen3d.Fog = Fog;

})();