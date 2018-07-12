(function() {

    // imports
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;
    var Mesh = zen3d.Mesh;

    /**
     * SkinnedMesh
     * @class
     */
    function SkinnedMesh(geometry, material) {
        Mesh.call(this, geometry, material);

        this.type = OBJECT_TYPE.SKINNED_MESH;

        this.skeleton = undefined;
    }

    SkinnedMesh.prototype = Object.assign(Object.create(Mesh.prototype), {

        constructor: SkinnedMesh,

        updateMatrix: function() {
            Mesh.prototype.updateMatrix.call(this);
    
            if(this.skeleton) {
                this.skeleton.updateBones();
            }
        },

        clone: function () {
            return new this.constructor( this.geometry, this.material ).copy( this );
        }

    });

    // exports
    zen3d.SkinnedMesh = SkinnedMesh;
    
})();
