const HitCircle = require('../src/app/hitCircle');
const PlayScene = require('../src/app/playScene');

function sum(a, b) {
    return a + b;
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});

test('timing circle radius', () => {
    const playScene = new PlayScene();
    expect(playScene).not.toBe(null);
});
