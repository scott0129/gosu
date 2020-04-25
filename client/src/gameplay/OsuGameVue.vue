<template>
    <div id="game-area"></div>
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
        this.loadData();
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
        loadData() {
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

<style scope>
canvas {
    padding: 0;
    margin: auto;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

#game-area {
    width: 100%; 
    height: 100%;
    text-align: center;
    vertical-align: center;
}
</style>
