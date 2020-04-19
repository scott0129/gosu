<template>
    <div class="beatmap-card">
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
