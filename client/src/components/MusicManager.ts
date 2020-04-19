import BeatmapMetadata from './BeatmapMetadata';

class MusicManager {
    /*
       This function will help manage the behavior of clicks in the menu. First click should play a preview
       of a song, while the second click should call gameStartCallback with the selected song.
     */
    private beatmaps: BeatmapMetadata[];
    private gameStartCallback: Function;
    private currentlySelected: string;
    private audioElement: HTMLAudioElement;

    constructor(beatmaps: BeatmapMetadata[], gameStartCallback: Function) {
        this.beatmaps = beatmaps;
        this.gameStartCallback = gameStartCallback;
        this.currentlySelected = '';
        this.audioElement = new Audio();
        this.audioElement.addEventListener(
            'canplaythrough',
            event => this.audioElement.play() // This should be play()
        );
    }

    getSelectCallback(): Function {
        return this.select.bind(this);
    }

    select(songId: string): void {
        const songUrl = this.getBeatmapFromId(songId).preview_url;
        if (songUrl === this.currentlySelected) {
            this.audioElement.pause();
            this.gameStartCallback(songUrl);
            return;
        } else {
            this.currentlySelected = songUrl;
            this.audioElement.pause();
            this.audioElement.setAttribute('src', songUrl);
            this.audioElement.load();
        }
    }

    /** Return the url of the currently playing song **/
    getSelected() {
        return this.currentlySelected;
    }

    private getBeatmapFromId(beatmapId: number): string {
        return this.beatmaps.find(beatmap => beatmap.beatmap_id == beatmapId);
    }
}

export default MusicManager;
