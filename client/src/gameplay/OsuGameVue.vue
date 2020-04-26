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
        startGame() {
            console.log('starting game!');
            if (this.game) {
                this.game.destroyGame();
            }
            this.game = new OsuGame('game-area');
        },
        parseOsu(stream) {
            return new Promise((resolveFunc, rejectFunc) => {
                OsuParser.parseStream(stream, function (err, beatmap) {
                    if (err) {
                        rejectFunc(err);
                    } else {
                        resolveFunc(beatmap);
                    }
                });
            });
        },
        extractOsuFilename(info: BeatmapMetadata) {
            const filename = `${info.artist} - ${info.title} (${info.creator}) [${info.version}].osu`;
            return filename.replace(/\*/g, ''); // Remove any 'illegal' characters
        },
        fetchOsz(url: string) {
            return new Promise((resolutionFunc, rejectionFunc) => {
                JSZipUtils.getBinaryContent(url, (err, data) => {
                    if (err) {
                        console.error('Error in fetching beatmap:', err);
                        rejectionFunc(err);
                    } else {
                        resolutionFunc(data);
                    }
                });
            });
        },
        async loadOsz() {
            const filename = this.extractOsuFilename(this.beatmapInfo);
            const rawFile = this.virtualZip.file(filename);
            const osuObject = await this.parseOsu(rawFile.nodeStream());
            window.beatmap = osuObject;
        },
        async loadMusic() {
            // Search for file end in mp3, case insensitive
            const mp3Files = this.virtualZip.file(/.\.mp3$/gi);
            if (mp3Files.length > 1) {
                console.error('There was more than one .mp3 file! Picking the first for now, but ' +
                                'this is a pretty critical assumption.');
            }
            await mp3Files[0].async("ArrayBuffer").then(function (data) {
                window.musicStream = data;
            });
        },
        async loadData() {
            if (!this.virtualZip.file('audio.mp3')) {
                // If we don't have the .osz files loaded, fetch them
                const oszUrl = `/b/${this.beatmapInfo.set_id}`;
                const loadAsyncPromise = await this.fetchOsz(oszUrl).then(
                    data => {
                        console.log('Fetched .osz file from server!');
                        return this.virtualZip.loadAsync(data);
                    }
                );
            }
            // If we have the .osz file, parse it
            Promise.all([this.loadOsz(), this.loadMusic()]).then(() =>
                this.startGame()
            );
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
