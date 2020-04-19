import { shallowMount } from '@vue/test-utils';

// 'import' is being buggy with bring in vue components. and it's also old babel, thus 'default'
const BeatmapCard = require('../BeatmapCard.vue').default;

describe('static BeatmapCard', () => {
    it('has a data hook', () => {
        expect(typeof BeatmapCard.data).toBe('function');
    });
});

describe('mounted BeatmapCard', () => {
    const selectionCallback = jest.fn();

    const mounted = shallowMount(BeatmapCard, {
        propsData: {
            beatmapId: 1,
            version: 'Version 1',
            setId: 22,
            title: 'Fur Elise',
            artist: 'Beethoven',
            previewUrl: 'something.mp3',
            selectionCallback: selectionCallback,
        },
    });

    it('sets the correct default data', () => {
        expect(typeof BeatmapCard.data).toBe('function');
        const defaultData = BeatmapCard.data();
        expect(defaultData.audio.constructor.name).toBe('HTMLAudioElement');
    });

    it('renders correct messages', () => {
        expect(mounted.find('.beatmap-title').text()).toBe('Fur Elise');
        expect(mounted.find('.beatmap-artist').text()).toBe('Beethoven');
    });

    it('plays the audio when clicked', () => {
        const mockPlay = jest.fn();
        const mockPause = jest.fn();
        mounted.setData({
            audio: {
                play: mockPlay,
                pause: mockPause,
                paused: true,
                currentTime: 0,
            },
        });
        mounted.find('button').trigger('click');
        expect(mockPlay).toHaveBeenCalled();
        expect(mockPause).not.toHaveBeenCalled();

        mounted.setData({
            audio: {
                paused: false,
            },
        });
        mounted.find('button').trigger('click');
        expect(mockPause).toHaveBeenCalled();
    });
});
