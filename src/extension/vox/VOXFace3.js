function VOXFace3(a, b, c, normal, color, materialIndex) {
    this.a = a;
    this.b = b;
    this.c = c;

    this.normal = normal ? normal : new zen3d.Vector3();

    this.color = color ? color : new zen3d.Color3();

    this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
}

VOXFace3.prototype.copy = function(source) {
    this.a = source.a;
    this.b = source.b;
    this.c = source.c;

    this.normal.copy( source.normal );
    this.color.copy( source.color );

    this.materialIndex = source.materialIndex;

    return this;
}

VOXFace3.prototype.clone = function() {
    return new VOXFace3().copy(this);
}

export {VOXFace3};