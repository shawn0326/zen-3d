QUnit.module("Sphere");

QUnit.test("constructor", function(assert) {
    var a = new zen3d.Sphere();
    assert.ok(a.center.equals(zero3), "Passed!");
    assert.ok(a.radius == 0, "Passed!");

    a = new zen3d.Sphere(one3.clone(), 1);
    assert.ok(a.center.equals(one3), "Passed!");
    assert.ok(a.radius == 1, "Passed!");
});

QUnit.test("copy", function(assert) {
    var a = new zen3d.Sphere(one3.clone(), 1);
    var b = new zen3d.Sphere().copy(a);

    assert.ok(b.center.equals(one3), "Passed!");
    assert.ok(b.radius == 1, "Passed!");

    // ensure that it is a true copy
    a.center = zero3;
    a.radius = 0;
    assert.ok(b.center.equals(one3), "Passed!");
    assert.ok(b.radius == 1, "Passed!");
});

QUnit.test("set", function(assert) {
    var a = new zen3d.Sphere();
    assert.ok(a.center.equals(zero3), "Passed!");
    assert.ok(a.radius == 0, "Passed!");

    a.set(one3, 1);
    assert.ok(a.center.equals(one3), "Passed!");
    assert.ok(a.radius == 1, "Passed!");
});

QUnit.test("getBoundingBox", function(assert) {
    var a = new zen3d.Sphere(one3.clone(), 1);

    assert.ok(a.getBoundingBox().equals(new zen3d.Box3(zero3, two3)), "Passed!");

    a.set(zero3, 0);
    assert.ok(a.getBoundingBox().equals(new zen3d.Box3(zero3, zero3)), "Passed!");
});

QUnit.test("applyMatrix4", function(assert) {
    var a = new zen3d.Sphere(one3.clone(), 1);

    var m = new zen3d.Matrix4().makeTranslation(1, -2, 1);

    assert.ok(a.clone().applyMatrix4(m).getBoundingBox().equals(a.getBoundingBox().applyMatrix4(m)), "Passed!");
});