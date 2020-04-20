<template>
    <div class="beatmap-listing">
        <BeatmapCard
            v-for="beatmap in beatmaps"
            ref="domBeatmaps"
            v-bind:key="beatmap.beatmap_id"
            v-bind:beatmapId="beatmap.beatmap_id"
            v-bind:version="beatmap.version"
            v-bind:setId="beatmap.set_id"
            v-bind:title="beatmap.title"
            v-bind:artist="beatmap.artist"
            v-bind:previewUrl="beatmap.preview_url"
            v-bind:beingPreviewed="beatmap.beatmap_id === currentPreviewId"
            v-on:click.native.stop="selectSongCallback(beatmap.beatmap_id)"
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
            manager: new MusicManager(this.beatmaps, this.playGameCallback),
            currentPreviewId: -1,
        };
    },
    methods: {
        selectSongCallback(beatmapId): void {
            this.manager.select(beatmapId);
            this.currentPreviewId = beatmapId;
        },
    },
    components: {
        BeatmapCard,
    },
    props: {
        beatmaps: Array,
        playGameCallback: Function,
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
