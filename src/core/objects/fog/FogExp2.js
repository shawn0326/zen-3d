(function() {

    // imports
    var FOG_TYPE = zen3d.FOG_TYPE;
    var Color3 = zen3d.Color3;

    /**
     * FogExp2
     * @class
     */
    function FogExp2(color, density) {

        this.fogType = FOG_TYPE.EXP2;

        this.color = new Color3( (color !== undefined) ? color : 0x000000 );

        this.density = (density !== undefined) ? density : 0.00025;
    }

    // exports
    zen3d.FogExp2 = FogExp2;

})();