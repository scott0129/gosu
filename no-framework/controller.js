class Game {
    constructor(audio) {
        this.gameElements = [];

        this.$game = document.createElement('div');
        this.$game.classList.add('game');

        this.audio = audio;

        this.mouseX = 0;
        this.mouseY = 0;
    }

    update(deltaMs) {
        for (let i = 0; i < this.gameElements.length; i++) {
            this.gameElements[i].update(deltaMs);
        }
    }

    addCircle(x, y) {
        let newCircle = new BeatCircle(x, y, this.audio);
        newCircle.mount(this.$game);
        this.gameElements.push(newCircle);
    }

    mount($root) {
        $root.appendChild(this.$game);
    }
}

class BeatCircle {
    translate(a, b) {
        return 'translate(' + a + ', ' + b + ')';
    }

    constructor(x, y, audio) {
        this.audio = audio;
        this.MAX_WIDTH = 500;

        this.ticking = false;

        this.x = x;
        this.y = y;
        this.radius = 100; 

        this.$clickableArea = document.createElement('div');
        this.$clickableArea.classList.add('clickable_area');
        this.$clickableArea.style.width = this.radius + 'px';
        this.$clickableArea.style.height = this.radius + 'px';

        this.$timingCircle = document.createElement('div');
        this.$timingCircle.classList.add('timing_circle');

        this.startTime = Date.now();
        this.duration = 2000;
        this.setTimingRadius(this.MAX_WIDTH);

        this.$el = document.createElement('div');
        this.$el.appendChild(this.$timingCircle);
        this.$el.appendChild(this.$clickableArea);

        this.$el.style.transform = this.translate(x + 'px', y + 'px');

        this.$beatCircle = document.createElement('div');
        this.$beatCircle.appendChild(this.$el);

        this.$clickableArea.addEventListener('mousedown', () => this.onClick() );
    }

    onClick() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.currentTime = 0
        }
        this.audio.play();
    }

    update(deltaMs) {
        let progress = (Date.now() - this.startTime) / this.duration;
        if (progress >= 1) {
            // If progress is 1 then it ended its lifecycle
            return
        }

        let timingRadius = this.MAX_WIDTH * (1 - progress);
        this.setTimingRadius(this.radius + timingRadius);
    }

    setTimingRadius(numPixels) {
        let radius = Math.floor(numPixels);
        this.$timingCircle.style.width = radius + 'px';
        this.$timingCircle.style.height = radius + 'px';
        this.$timingCircle.style.margin = -radius/2 + 'px 0 0 ' + -radius/2 + 'px';
    }

    mount(node) {
        node.appendChild(this.$el);
    }
}


window.onload = () => {
    $container = document.getElementById('container');
    game.mount($container);
};

let audio = document.getElementById('hitsound'); 
let game = new Game(audio);
game.addCircle(200, 200);
window.setTimeout( () => { game.addCircle(500, 500); } , 1000);
window.setInterval( () =>{ game.update(); }, 20);
