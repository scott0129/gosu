<template>
    <div class="beatmap-listing">
        <BeatmapCard
            v-for="beatmap in beatmaps"
            v-bind:key="beatmap.beatmap_id"
            v-bind:beatmapId="beatmap.beatmap_id"
            v-bind:version="beatmap.version"
            v-bind:setId="beatmap.set_id"
            v-bind:title="beatmap.title"
            v-bind:artist="beatmap.artist"
            v-bind:previewUrl="beatmap.preview_url"
            v-bind:selectionCallback="manager.getSelectCallback()"
        ></BeatmapCard>
    </div>
</template>

<script lang="ts">
import BeatmapCard from './BeatmapCard';
import MusicManager from './MusicManager';

export default {
    name: 'MusicDirectory',
    data(): Record<string, any> {
        return {
            paused: true,
            audio: new Audio('https://b.ppy.sh/preview/675615.mp3'),
            manager: new MusicManager(this.beatmaps, this.selectionCallback),
        };
    },
    components: {
        BeatmapCard,
    },
    props: {
        beatmaps: Array,
        selectionCallback: Function,
    },
};
</script>

<style scoped>
.container {
    width: 600px;
    margin: 50px auto;
    text-align: center;
}
</style>
