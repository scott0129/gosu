class MusicManager {
    /*
       This function will help manage the behavior of clicks in the menu. First click should play a preview
       of a song, while the second click should call gameStartCallback with the selected song.
     */
    private previewUrls: string[];
    private currentlySelected: string;
    private gameStartCallback: Function;
    private audioElement: HTMLAudioElement;

    constructor(previewUrls: string[], gameStartCallback: Function) {
        this.previewUrls = previewUrls;
        this.gameStartCallback = gameStartCallback;
        this.audioElement = new Audio();
        this.audioElement.addEventListener(
            'canplaythrough',
            event => console.log(event) // This should be play()
        );
    }

    select(songUrl: string): void {
        if (songUrl === this.currentlySelected) {
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
}

export default MusicManager;
