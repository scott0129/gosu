


window.onload = () => {
    $container = document.getElementById('container');
    game.mount($container);
};

let audio = document.getElementById('hitsound'); 
let game = new Game(audio);
game.addCircle(200, 200);
window.setTimeout( () => { game.addCircle(500, 500); } , 1000);
window.setInterval( () =>{ game.update(); }, 20);
