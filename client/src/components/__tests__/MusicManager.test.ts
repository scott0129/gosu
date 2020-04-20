import MusicManager from '../MusicManager';

function voidPromiseFunc(): Promise<void> {
    return Promise.resolve();
}

// jsdom doesn't mock these functions for us :(
window.HTMLMediaElement.prototype.load = voidPromiseFunc;
window.HTMLMediaElement.prototype.play = voidPromiseFunc;
window.HTMLMediaElement.prototype.pause = voidPromiseFunc;

describe('music manager behavior', () => {
    const beatmaps = [
        {
            beatmap_id: 1,
            artist: 'Bach',
            title: 'Ave Maria',
            preview_url: 'example.com/1',
            set_id: 11,
            version: 'The good one',
        },
        {
            beatmap_id: 2,
            artist: 'Beethoven',
            title: 'Fur Elise',
            preview_url: 'example.com/2',
            set_id: 12,
            version: 'The ok one',
        },
    ];

    const gameStartCallback = jest.fn();

    const manager = new MusicManager(beatmaps, gameStartCallback);

    it('previews music when clicked once', () => {
        manager.select(beatmaps[0].beatmap_id);

        expect(manager.getSelected()).toBe(beatmaps[0].beatmap_id);
        expect(gameStartCallback).not.toHaveBeenCalled();
    });

    it('switches music when clicked once', () => {
        manager.select(beatmaps[1].beatmap_id);

        expect(manager.getSelected()).toBe(beatmaps[1].beatmap_id);
        expect(gameStartCallback).not.toHaveBeenCalled();
    });

    it('plays game when clicked twice', () => {
        expect(gameStartCallback).not.toHaveBeenCalled();

        manager.select(beatmaps[1].beatmap_id);

        expect(gameStartCallback).toHaveBeenCalled();
        expect(gameStartCallback.mock.calls[0][0]).toBe(beatmaps[1]);
    });
});
