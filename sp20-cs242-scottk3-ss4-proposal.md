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

## Schedule & Grading
### Week 1: Proof of concepts
#### Goal: Try three different implementation methods to see which would best suit the goals of the project.

#### Functional Requirements 
Each of the three implementations should have the following:

- (+2) 2 On-screen circles
- (+2) A two larger, concentric circles that slowly closes in
- (+1) A sound when the circles are clicked

The three implementation methods:
- Implementaion using Html DOM elements
- Implementation using Pixi.js, a 2d rendering engine
- Implementation using Phaser, a 2d game engine

#### Testing Requirements
- (+6) Unit tests for non-UI functions for all 3 implementations (2 pts each)
- (+4) A manual testing plan / snapshot tests for UI functions of the ONE implementation 
selected to be used for the rest of the project.

### Week 2: Menu and Music Browser
#### Goal: Connect to online API and create some menu to be able to browse through online library of songs.

#### Functional Requirements 
- (+4) Menu displays multiple songs and is scrollable
- (+4) Songs are fetched from an online server/API service, not on the local computer. 
- (+5) Clicking on a song plays the music, but remains in the menu
- (+2) Clicking once more opens up the Week 1 portion, with a very simple layout.
#### Testing Requirements 
- (+3) API testing with proper mocking
    - (-1) If .env file is public
- (+7) Manual testing plan / snapshot tests for UI functions
    - (+3) points for menu testing
    - (+4) points for menu -> game transition tests

### Week 3: Accuracy
#### Goal: Parse .osz files to create playable corresponding levels

#### Functional Requirements 
- (+5) Load and play music from the .osz file
- (+5) Load circle-clicking beatmap from the .osz file
- (+5) Show something resembling feedback (if the clicks are early/late, etc)
#### Testing Requirements 
- (+4) Tests for file parser, creating a corresponding and accurate object representation.
- (+6) Manual testing plan 
    - (+2) detailed information about the environment
    - (+2) testing menu browsing
    - (+2) test of the actual gameplay 
