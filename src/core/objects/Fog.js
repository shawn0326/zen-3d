(function() {
    /**
     * Fog
     * @class
     */
    var Fog = function(color, near, far) {

        this.fogType = zen3d.FOG_TYPE.NORMAL;

        this.color = new zen3d.Color3( (color !== undefined) ? color : 0x000000 );

        this.near = (near !== undefined) ? near : 1;
        this.far = (far !== undefined) ? far : 1000;
    }

    zen3d.Fog = Fog;
})();