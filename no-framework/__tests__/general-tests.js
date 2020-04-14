const {Game, BeatCircle} = require('../game.js')


test("creating new circles", () => {
    const game = new Game();
    const x = 1337;
    const y = 420;
    game.addCircle(x, y);
    expect(game.gameElements.length).toBe(1);
    expect(game.gameElements[0].x).toBe(x);
    expect(game.gameElements[0].y).toBe(y);
});

test("if sound would play on click", () => {
    const audio = {
        paused: true,
        play: jest.fn(),
        currentTime: 0,
    }

    const beatCircle = new BeatCircle(30, 40, audio);
    beatCircle.onClick();

    expect(audio.play).toHaveBeenCalled();
});

test("if sound would restart on click", () => {
    const audio = {
        paused: false,
        play: jest.fn(),
        currentTime: 2000,
    }

    const beatCircle = new BeatCircle(30, 40, audio);
    beatCircle.onClick();

    expect(audio.play).not.toHaveBeenCalled();
    expect(audio.currentTime).toBe(0);
});
