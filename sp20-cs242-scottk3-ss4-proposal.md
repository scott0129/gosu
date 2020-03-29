# Web Osu
An online web version of the popular desktop rhythm game, Osu!


## Motivation
One of my favorite games is a rhythm game called Osu! However, it's a desktop game and I've
always felt that it would make a lot of sense for there to be a web version.

In a sense, there IS a web version, but it's unfortunately a [bit lackluster](https://www.osu-web.com/)


## Technologies, Tools, Style guides
Since this will be a web game, the typical web stack (Parcel, TypeScript, Prettify)  
GSAP (GreenSock Animation Platform) for fast and fluid animation/movement  
Filesystem storage on the server for downloading/caching the songs  
Styling: Prettier with the following configuration:
```
{
  "bracketSpacing": false,
  "trailingComma": "es5",
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true
}
```

## High-level functionalities
### Menu
 - Some menu where one can start the game or change the options
### Music Browser
 - A scrollable screen to find/click through different songs in the Osu! online library
### Core Game
 - Parse .osz files to play levels rather than hardcoding them in myself 
 - Click the circles, obtain some sort of score 
### Playability
 - Game maintains 60fps even with modestly complex songs
 - Audio and visuals line up in timing
### Enjoyability (Stretch goals?)
 - Visually appealing
 - Allow customization of visuals
## Sketch?
Most of the design inspiration will come from the original OSU game. The menu for the game looks something like this:

![osu menu](https://user-images.githubusercontent.com/30797591/43987228-e971dde8-9d47-11e8-944d-0bc0aacd23e2.jpg)



And the gameplay looks like this:
![osu gameplay](https://i.ppy.sh/6533010aef9b1b2834079d011a3219d1db3f0c38/68747470733a2f2f6f73752e7070792e73682f73732f3130373132343034)

## Schedule
### Week 1: Proof of concept
 - Implement the essential game (click some circles with timer accuracy) with UI elements using 3 different methods:
    1. Using Html DOM elements
    2. Using Pixi.js, a 2d rendering engine
    3. Using Phaser, a 2d game engine
 - With some insight gained, choose one of the three options that seems to make the most sense.
### Week 2: Menu and Music Browser
 - Connect to online API and create some menu to be able to browse through online library of songs
 - Parse .osz files to create playable corresponding levels
### Week 3: Accuracy
 - Have scoring/rhythm/accuracy/sounds comparable to the original desktop game
### Week 4?: Polish
 - Look good

