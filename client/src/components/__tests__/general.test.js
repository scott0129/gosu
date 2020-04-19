import HitCircle from require('../app/scenes/hitCircle');
import PlayScene from require('../app/scenes/playScene');

function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

