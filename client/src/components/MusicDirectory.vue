<template>
    <div class="container">
        <h1>{{ message }}</h1>
        <a href="/login">Connect to Osu</a>
        <div class="audio-player">
            <button v-on:click="playSound">play!</button>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'MusicDirectory',
    data() {
        return {
            message:
                'This is an introduction page without anything! maybe a button?',
            paused: true,
            audio: new Audio('https://b.ppy.sh/preview/675615.mp3'),
        };
    },
    methods: {
        playSound: function (): void {
            console.log(this);
            this.audio.play();
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
