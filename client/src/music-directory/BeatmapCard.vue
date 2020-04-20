<template>
    <div v-bind:class="{ selected: beingPreviewed }" class="beatmap-card">
        <h1 class="beatmap-title">{{ title }}</h1>
        <h4 class="beatmap-artist">{{ artist }}</h4>
        <div class="audio-player"></div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'BeatmapCard',
    props: {
        beatmapId: Number,
        version: String,
        setId: Number,
        title: String,
        artist: String,
        previewUrl: String,
        beingPreviewed: Boolean,
    },
};
</script>

<style scoped>
.container {
    width: 600px;
    margin: 50px auto;
    text-align: center;
}

.selected {
    transition: background 0.5s ease;
    background: #ccc;
}

.beatmap-card {
    border-radius: 20px;
    border: 2px ridge black;
    transition: transform 0.1s ease-in;
    margin: 10px;
}

.beatmap-card:hover {
    transition: transform 0.1s ease-out;
    transform: scale(1.1);
}
</style>
