<template>
    <div id="game-area">
        <button v-on:click.stop="loadData($event)" type="file" id="input">Load File!</button>
    </div>
</template>

<script lang="ts">
import OsuGame from './OsuGame';
import OsuParser from 'osu-parser';
import JSZip from 'jszip';
import JSZipUtils from 'jszip-utils';

export default {
    name: 'OsuGameVue',
    data() {
        return {
            game: null,
            zipFs: new JSZip(),
        };
    },
    mounted() {
        this.game = new OsuGame('game-area');
    },
    destroyed() {
        this.game.destroyGame();
    },
    methods: {
        onImport(something) {
            console.log(something);
        },
        onError(error) {
            console.error(error);
        },
        loadData(event) {
            const fetchUrl = `/b/${window.beatmap.set_id}` 
            console.log(fetchUrl);
            const self = this;
            JSZipUtils.getBinaryContent(
                fetchUrl,
                function (err, data) {
                    if (err) {
                        console.error("Error in fetching beatmap:", err);
                    }
                    console.log('got binary data!');
                    console.log(data);
                    var zip = new JSZip();

                    zip.loadAsync(data)
                        .then(zipFs => {
                            zip.forEach(function (relativePath, zipEntry) {
                                console.log(zipEntry.name);
                            });
                        });
                }
            )
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
