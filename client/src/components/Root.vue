<template>
    <div class="container">
        <!-- <div :is="currentComponent"></div> -->
        <MusicDirectory
            v-if="beatmaps"
            v-bind:beatmaps="beatmaps"
        ></MusicDirectory>
        <a v-else href="/login">Connect to Osu</a>
        <div id="game-area"></div>
    </div>
</template>

<script lang="ts">
import MusicDirectory from './MusicDirectory';
import OsuGameVue from './OsuGameVue';

export default {
    name: 'Root',
    components: {
        MusicDirectory,
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
        };
    },
    methods: {
        startGame: function () {
            this.currentComponent = OsuGameVue;
        },
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
