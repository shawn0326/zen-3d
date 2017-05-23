QUnit.module("Quaternion");

QUnit.test("constructor", function(assert) {
    var a = new zen3d.Quaternion();
    assert.ok(a.x == 0, "Passed!");
    assert.ok(a.y == 0, "Passed!");
    assert.ok(a.z == 0, "Passed!");
    assert.ok(a.w == 1, "Passed!");
});

QUnit.test("setFromUnitVectors", function(assert) {
    var a = new zen3d.Quaternion();

    var b = new zen3d.Vector3();
    var c = new zen3d.Vector3();

    b.set(0, 0, 1 );
    c.set(0, 0, -1);

    a.setFromUnitVectors(b, c);

    assert.ok(Math.abs(a.x - 0   ) < 0.000001, "Passed!");
    assert.ok(Math.abs(a.y - (-1)) < 0.000001, "Passed!");
    assert.ok(Math.abs(a.z - 0   ) < 0.000001, "Passed!");
    assert.ok(Math.abs(a.w - 0   ) < 0.000001, "Passed!");
});