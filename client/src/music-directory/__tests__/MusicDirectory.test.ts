import { mount, shallowMount } from '@vue/test-utils';

// 'import' is being buggy with bring in vue components. and it's also old babel, thus 'default'
const MusicDirectory = require('../MusicDirectory.vue').default;
const BeatmapCard = require('../BeatmapCard.vue').default;


const mockBeatmaps = [
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

const mockPause = jest.fn();
const mockPlay = jest.fn();
const mockLoad = jest.fn();

window.HTMLMediaElement.prototype.load = mockLoad;
window.HTMLMediaElement.prototype.play = mockPlay; 
window.HTMLMediaElement.prototype.pause = mockPause; 

beforeEach( () => {
    jest.clearAllMocks();
});


describe('render tests', () => {
    const wrapper = mount(MusicDirectory, {
        propsData: {
            beatmaps: mockBeatmaps,
            beingPreviewed: () => {},
        },
    });

    it('renders two BeatmapCards', () => {
        expect(wrapper.findAll(BeatmapCard).length).toBe(2);
    });

    it('has the expected HTML structure', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });
});

describe('sound tests', () => {
    it('plays the audio when clicked', async () => {
        const wrapper = mount(MusicDirectory, {
            propsData: {
                beatmaps: mockBeatmaps,
                playGameCallback: () => {},
            },
        });

        expect(mockLoad).not.toHaveBeenCalled();
        expect(mockPlay).not.toHaveBeenCalled();

        wrapper.findAll(BeatmapCard).at(0).trigger('click');

        await wrapper.vm.$nextTick();

        expect(mockLoad).toHaveBeenCalled();
        expect(wrapper.find('.beatmap-card.selected').exists()).toBe(true);

        // This event is normally dispatched when the mp3 is fully loaded, which should cause it to play
        wrapper.vm.$data.manager.audioElement.dispatchEvent(new Event('canplaythrough'));
        expect(mockPlay).toHaveBeenCalled();
    });
});

describe('transition tests', () => {
    const startPlayingGame = jest.fn();

    const wrapper = mount(MusicDirectory, {
        propsData: {
            beatmaps: mockBeatmaps,
            playGameCallback: startPlayingGame,
        },
    });
    
    it('does not play the game when a card is clicked once', () => {
        wrapper.findAll(BeatmapCard).at(0).trigger('click');
        expect(startPlayingGame).not.toHaveBeenCalled();
    });
    
    it('also does not play when a different card is clicked once', () => {
        wrapper.findAll(BeatmapCard).at(1).trigger('click');
        expect(startPlayingGame).not.toHaveBeenCalled();
    });

    it('plays the game when clicked again', () => {
        wrapper.findAll(BeatmapCard).at(1).trigger('click');
        expect(startPlayingGame).toHaveBeenCalled();
        expect(startPlayingGame.mock.calls[0][0]).toBe(mockBeatmaps[1]);
    });
});
