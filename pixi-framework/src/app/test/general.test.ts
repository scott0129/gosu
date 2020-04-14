import { GameApp, HitCircle } from '../app';

let dateNow;

beforeAll(() => {
    var global: any;
    global.Date = {
        now: dateNow,
    }
});

test('if circle shrinks', () => {
    const audio = {
        sound: {
            play: jest.fn(),
        }
    }

    const hitCircle = new HitCircle(20, 50, audio);

    const big    = hitCircle.getTimingCircle(0);
    const medium = hitCircle.getTimingCircle(0.5);
    const small  = hitCircle.getTimingCircle(1);

    expect(big.radius).toBeLessThan(medium.radius);
    expect(medium.radius).toBeLessThan(small.radius);
});
