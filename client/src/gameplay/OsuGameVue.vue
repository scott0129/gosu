<template>
    <div id="game-area">
        <button v-on:click.stop="loadData($event)" type="file" id="input">
            Load File!
        </button>
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
            virtualZip: new JSZip(),
            beatmapInfo: window.beatmapInfo,
        };
    },
    mounted() {
    },
    destroyed() {
        this.game.destroyGame();
    },
    methods: {
        startGame(osuObject) {
            console.log("starting game!");
            window.beatmap = osuObject;
            if (this.game) {
                this.game.destroyGame();
            }
            this.game = new OsuGame('game-area');
        },
        parseOsu(stream) {
            return new Promise( (resolutionFunc, rejectionFunc) => {
                OsuParser.parseStream(stream, function (err, beatmap) {
                    if (err) {
                        resolutionFunc(err)
                    } else {
                        resolutionFunc(beatmap);
                    }
                });
            });
        },
        extractOsuFilename(info: BeatmapMetadata) {
            return `${info.artist} - ${info.title} (${info.creator}) [${info.version}].osu`
        }
        fetchOsz(url: string) {
            return new Promise( (resolutionFunc, rejectionFunc) => {
                JSZipUtils.getBinaryContent(
                    url,
                    (err, data) => {
                        if (err) {
                            console.error("Error in fetching beatmap:", err);
                            rejectionFunc(err);
                        } else {
                            resolutionFunc(data);
                        }
                    }
                )
            });
        },
        loadData(event) {
            const oszUrl = `/b/${this.beatmapInfo.set_id}`
            const filename = this.extractOsuFilename(this.beatmapInfo);
            const rawFile = this.virtualZip.file(filename);
            if (rawFile == null) {
                // If we don't have the file already, load it
                this.fetchOsz(oszUrl)
                    .then( (data) => { 
                        console.log("Fetched .osz file from server!"); 
                        return this.virtualZip.loadAsync(data) 
                    })
                    .then( (zip) => {
                        console.log("Loaded .osz into virtual filesystem!");
                        const filename = this.extractOsuFilename(this.beatmapInfo);
                        const rawFile = zip.file(filename);
                        return this.parseOsu(rawFile.nodeStream());
                    })
                    .then( (osuObject) => this.startGame(osuObject) )
            } else {
                // If we don't have the file already, load it
                this.parseOsu(rawFile.nodeStream())
                    .then( (osuObject) => this.startGame(osuObject) )
            }
        },
    },
};
</script>

<style scoped>
* {
margin: 0;
padding: 0;
}
.container {
    width: 600px;
    text-align: center;
}
canvas {
    /* width: 100%; */
    /* height: 100%; */
    /* object-fit: contain; */
}
</style>
