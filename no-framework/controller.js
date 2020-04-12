class Game {
    constructor() {
        let gameElements = [];

        this.$game = document.createElement('div');
        this.$game.classList.add('game');

        this.b1 = new BeatCircle(100, 200);
        this.b1.mount(this.$game);

        this.mouseX = 0;
        this.mouseY = 0;
    }

    update(deltaMs) {
        this.b1.update(deltaMs);
    }

    mount($root) {
        $root.appendChild(this.$game);

        window.addEventListener('keydown', (e) => this.onKeyDown(e) );
        $root.addEventListener('mousemove', (e) => this.onMouseMove(e) );
    }

    onKeyDown(event) {
        if (event.code === "KeyZ" || event.code === "KeyX") {
            console.log("rightKey!");
            event.preventDefault();
            console.log(document.elementFromPoint(this.mouseX, this.mouseY));
            document.elementFromPoint(this.mouseX, this.mouseY).click();
        }
    }

    onMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

}

class BeatCircle {
    translate(a, b) {
        return 'translate(' + a + ', ' + b + ')';
    }

    constructor(x, y) {
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
        this.duration = 5000;
        this.setTimingRadius(this.MAX_WIDTH);

        this.$el = document.createElement('div');
        this.$el.appendChild(this.$timingCircle);
        this.$el.appendChild(this.$clickableArea);

        this.$el.style.transform = this.translate(150 + 'px', '250px');

        this.$beatCircle = document.createElement('div');
        this.$beatCircle.appendChild(this.$el);

        this.$clickableArea.addEventListener('mousedown', this.onClick);
    }

    onClick() {
        console.log("hi! i'm ", this);
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

let game = new Game();
window.setInterval( () =>{ game.update(); }, 20);
