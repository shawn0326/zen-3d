(function() {

    // imports
    var generateUUID = zen3d.generateUUID;
    var EventDispatcher = zen3d.EventDispatcher;

    /**
     * RenderTargetBase Class
     * @class
     */
    function RenderTargetBase(width, height) {
        EventDispatcher.call(this);

        this.uuid = generateUUID();

        this.width = width;
        this.height = height;

        this.depthBuffer = true;
        this.stencilBuffer = true;
    }

    RenderTargetBase.prototype = Object.assign(Object.create(EventDispatcher.prototype), {

        constructor: RenderTargetBase,

        /**
         * resize render target
         */
        resize: function(width, height) {
            if(this.width !== width || this.height !== height) {
                this.dispose();
            }
    
            this.width = width;
            this.height = height;
        },

        dispose: function() {
            this.dispatchEvent({type: 'dispose'});
        }

    });

    // exports
    zen3d.RenderTargetBase = RenderTargetBase;

})();