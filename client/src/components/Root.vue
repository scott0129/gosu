<template>
    <div class="container">
        <div :is="currentComponent"></div>
        <div>
            <button @click="startGame()">Click to start!</button>
        </div>
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
        return {
            currentComponent: MusicDirectory,
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
