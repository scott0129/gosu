<template>
    <div class="container">
        <!-- <div :is="currentComponent"></div> -->
        <OsuGameVue v-if="gameIsPlaying"></OsuGameVue>
        <MusicDirectory
            v-else-if="beatmaps"
            v-bind:beatmaps="beatmaps"
            v-bind:playGameCallback="startPlayingGame"
        ></MusicDirectory>
        <a v-else href="/login">Connect to Osu</a>
    </div>
</template>

<script lang="ts">
import MusicDirectory from './music-directory/MusicDirectory';
import OsuGameVue from './gameplay/OsuGameVue';

export default {
    name: 'Root',
    components: {
        MusicDirectory,
        OsuGameVue,
    },
    data() {
        const beatmapCookie = $cookies.get('beatmaps');
        let parsedBeatmaps = null;
        if (beatmapCookie) {
            parsedBeatmaps = JSON.parse(beatmapCookie);
        }
        return {
            currentComponent: MusicDirectory,
            beatmaps: parsedBeatmaps,
            gameIsPlaying: false,
            beatmapInfo: null,
        };
    },
    methods: {
        startPlayingGame: function(beatmapObj) {
            this.gameIsPlaying = true;
            
            // AFAIK the window.beatmap is the only way to pass the data to Phaser
            this.beatmapInfo = beatmapObj;
            window.beatmapInfo = beatmapObj;
        },
    },
};
</script>

<style scope>
body {
    padding: 0;
    margin: 0;
}

.container {
    width: 100%;
    height: 100%;
}
</style>
