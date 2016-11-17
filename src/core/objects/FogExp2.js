(function() {
    /**
     * FogExp2
     * @class
     */
    var FogExp2 = function(color, density) {

        this.fogType = zen3d.FOG_TYPE.EXP2;

        this.color = new zen3d.Color3( (color !== undefined) ? color : 0x000000 );

        this.density = (density !== undefined) ? density : 0.00025;
    }

    zen3d.FogExp2 = FogExp2;
})();