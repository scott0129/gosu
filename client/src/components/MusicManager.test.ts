import MusicManager from './MusicManager';

function voidPromiseFunc(): Promise<void> {
    return Promise.resolve();
}

// jsdom doesn't mock these functions for us :(
window.HTMLMediaElement.prototype.load = voidPromiseFunc;
window.HTMLMediaElement.prototype.play = voidPromiseFunc;
window.HTMLMediaElement.prototype.pause = voidPromiseFunc;

describe('music manager behavior', () => {
    const previewUrls = ['./5445.mp3', './497769.mp3', './200948.mp3'];

    const gameStartCallback = jest.fn();

    const manager = new MusicManager(previewUrls, gameStartCallback);

    it('is not playing when initialted', () => {
        expect(manager.getSelected()).toBe('');
    });

    it('previews music when clicked once', () => {
        manager.select(previewUrls[0]);

        expect(manager.getSelected()).toBe(previewUrls[0]);
        expect(gameStartCallback).not.toHaveBeenCalled();
    });

    it('switches music when clicked once', () => {
        manager.select(previewUrls[1]);

        expect(manager.getSelected()).toBe(previewUrls[1]);
        expect(gameStartCallback).not.toHaveBeenCalled();
    });

    it('plays game when clicked twice', () => {
        expect(gameStartCallback).not.toHaveBeenCalled();

        manager.select(previewUrls[1]);

        expect(gameStartCallback).toHaveBeenCalled();
        expect(gameStartCallback.mock.calls[0][0]).toBe(previewUrls[1]);
    });
});
