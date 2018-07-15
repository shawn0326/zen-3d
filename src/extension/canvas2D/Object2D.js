function Object2D() {
    this.width = 0;
    this.height = 0;

    // bla bla ...
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.anchorX = 0;
    this.anchorY = 0;

    // a 3x3 transform matrix
    this.matrix = new zen3d.Matrix3();
    // used to cache world transform
    this.worldMatrix = new zen3d.Matrix3();

    // children
    this.children = new Array();
    // parent
    this.parent = null;

    this.boundingBox = new zen3d.Box2();
}

/**
 * add child to object2d
 */
Object2D.prototype.add = function(object) {
    this.children.push(object);
    object.parent = this;
}

/**
 * remove child from object2d
 */
Object2D.prototype.remove = function(object) {
    var index = this.children.indexOf(object);
    if (index !== -1) {
        this.children.splice(index, 1);
    }
    object.parent = null;
}

/**
 * get object by name
 */
Object2D.prototype.getObjectByName = function(name) {
    return this.getObjectByProperty('name', name);
}

/**
 * get object by property
 */
Object2D.prototype.getObjectByProperty = function(name, value) {
    if (this[name] === value) return this;

    for (var i = 0, l = this.children.length; i < l; i++) {

        var child = this.children[i];
        var object = child.getObjectByProperty(name, value);

        if (object !== undefined) {

            return object;

        }

    }

    return undefined;
}

/**
 * update matrix
 */
Object2D.prototype.updateMatrix = function() {
    var matrix = this.matrix.transform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.anchorX * this.width, this.anchorY * this.height);

    this.worldMatrix.copy(matrix);

    if (this.parent) {
        var parentMatrix = this.parent.worldMatrix;
        this.worldMatrix.premultiply(parentMatrix);
    }

    var children = this.children;
    for (var i = 0, l = children.length; i < l; i++) {
        children[i].updateMatrix();
    }
}

Object2D.prototype.computeBoundingBox = function() {
    this.boundingBox.set(this.x, this.y, this.x + this.width, this.y + this.height);
}

export {Object2D};