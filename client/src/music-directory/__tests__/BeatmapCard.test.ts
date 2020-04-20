import { shallowMount } from '@vue/test-utils';

// 'import' is being buggy with bring in vue components. and it's also old babel, thus 'default'
const BeatmapCard = require('../BeatmapCard.vue').default;

describe('wrapper BeatmapCard', () => {
    const selectionCallback = jest.fn();

    const wrapper = shallowMount(BeatmapCard, {
        propsData: {
            beatmapId: 1,
            version: 'Version 1',
            setId: 22,
            title: 'Fur Elise',
            artist: 'Beethoven',
            previewUrl: 'something.mp3',
            beingPreviewed: false,
        },
    });

    it('renders correct messages', () => {
        expect(wrapper.find('.beatmap-title').text()).toBe('Fur Elise');
        expect(wrapper.find('.beatmap-artist').text()).toBe('Beethoven');
    });

    it('has the expected HTML structure', () => {
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('changes html class when being previewed', (done) => {
        wrapper.setProps({
            beingPreviewed: true,
        });
        wrapper.vm.$nextTick(() => {
            wrapper.find('.beatmap-card.selected').exists();
            done()
        })
    });

});
