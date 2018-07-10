(function() {

    // imports
    var Object3D = zen3d.Object3D;
    var OBJECT_TYPE = zen3d.OBJECT_TYPE;

    /**
     * Group
     * @class
     */
    function Group() {
        Object3D.call(this);

        this.type = OBJECT_TYPE.GROUP;
    }

    Group.prototype = Object.create(Object3D.prototype);
    Group.prototype.constructor = Group;

    // exports
    zen3d.Group = Group;

})();
