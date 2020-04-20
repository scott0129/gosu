import BeatmapMetadata from './BeatmapMetadata';

class MusicManager {
    /*
       This function will help manage the behavior of clicks in the menu. First click should play a preview
       of a song, while the second click should call gameStartCallback with the selected song.
     */
    private beatmaps: BeatmapMetadata[];
    private gameStartCallback: Function;
    private currentlySelected: number;
    private audioElement: HTMLAudioElement;

    constructor(beatmaps: BeatmapMetadata[], gameStartCallback: Function) {
        this.beatmaps = beatmaps;
        this.gameStartCallback = gameStartCallback;
        this.currentlySelected = -1;
        this.audioElement = new Audio();
        this.audioElement.addEventListener(
            'canplaythrough',
            event => this.audioElement.play() // This should be play()
        );
    }

    select(songId: number): void {
        const selectedMap = this.getBeatmapFromId(songId);
        if (songId === this.currentlySelected) {
            this.audioElement.pause();
            this.gameStartCallback(selectedMap);
            return;
        } else {
            this.currentlySelected = songId;
            this.audioElement.pause();
            this.audioElement.setAttribute('src', selectedMap.preview_url);
            this.audioElement.load();
        }
    }

    /** Return the url of the currently playing song **/
    getSelected(): number {
        return this.currentlySelected;
    }

    private getBeatmapFromId(beatmapId: number): BeatmapMetadata {
        const candidate = this.beatmaps.find(beatmap => beatmap.beatmap_id == beatmapId);
        if (candidate == undefined) {
            throw Error(`Beatmap with id: ${beatmapId} could not be found by MusicManager`);
        }
        return candidate;
    }
}

export default MusicManager;
