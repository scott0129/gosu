<template>
    <div id="game-area"></div>
</template>

<script lang="ts">
import OsuGame from '../app/OsuGame';
export default {
    name: 'OsuGameVue',
    data() {
        return {
            game: null,
        };
    },
    mounted() {
        this.game = new OsuGame('game-area');
    },
    destroyed() {
        this.game.destroy();
    },
    methods: {},
};
</script>

<style scoped>
.container {
    width: 600px;
    margin: 50px auto;
    text-align: center;
}
</style>
