<template>
    <div v-on:click="selectionCallback(beatmapId)" class="beatmap-card">
        <h1>{{ title }}</h1>
        <h4>{{ artist }}</h4>
        <div class="audio-player"></div>
        <button v-on:click.stop="togglePlay">
            Preview music
        </button>
    </div>
</template>

<script lang="ts">
export default {
    name: 'BeatmapCard',
    data() {
        return {
            audio: new Audio(this.previewUrl),
        };
    },
    methods: {
        togglePlay: function (): void {
            if (this.audio.paused) {
                this.audio.currentTime = 0;
                this.audio.play();
            } else {
                this.audio.pause();
            }
        },
    },
    props: {
        beatmapId: Number,
        version: String,
        setId: Number,
        title: String,
        artist: String,
        previewUrl: String,
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

.beatmap-card {
    border-radius: 20px;
    border: 2px ridge black;
}
</style>
