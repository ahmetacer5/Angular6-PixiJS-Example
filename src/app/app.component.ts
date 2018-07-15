import { Component, OnInit } from '@angular/core';
import { Character } from './character';

declare var PIXI: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    renderer: any;
    stage = new PIXI.Container();
    title = 'app';
    sprite: any;
    characters = new Array<Character>();

    constructor() {
        this.renderer = PIXI.autoDetectRenderer({
            width: 800,
            height: 600,
            resolution: 1,
            backgroundColor: 0x1099bb
        });
    }

    ngOnInit() {
        const self = this;
        document.getElementById('playGraoundWrapper').appendChild(this.renderer.view);

        PIXI.loader
            .add('herosprite', 'assets/img/trev-ovr.png')
            .load(() => {
                self.setup();
            });

    }

    setup() {
        const playGraoundWrapper = document.getElementById('playGraoundWrapper');

        const self = this;
        this.stage.interactive = true;

<<<<<<< HEAD
        // const frameLocations = {
        //     stand_front: [0, 56],
        //     surprised_front: [192, 120],
        //     walk_right: [
        //         [192, 56],
        //         [224, 56],
        //         [256, 56],
        //         [288, 56]
        //     ],
        //     walk_left: [
        //         [40, 0],
        //         [76, 0],
        //         [112, 0],
        //         [148, 0]
        //     ],
        //     walk_up: [
        //         [40, 112],
        //         [76, 112],
        //         [112, 112],
        //         [148, 112]
        //     ],
        //     walk_down: [
        //         [40, 56],
        //         [76, 56],
        //         [112, 56],
        //         [148, 56]
        //     ]
        //
        // };
        //
        // const rect = new PIXI.Rectangle(frameLocations.stand_front[0], frameLocations.stand_front[1], 32, 48);
        //
        // const texture = PIXI.loader.resources['herosprite'].texture;
        // texture.frame = rect;
        //
        // this.sprite = new PIXI.Sprite(texture);
        //
        //
        // // this.sprite.scale.set(2, 2);
        //
        // self.sprite.vmax = 1;
        //
        // let walk_step_index = 0;
        // let onWalk = false;
        // let walk_direction = 'right';
        // const walk = setInterval(() => {
        //     const dx = self.sprite.x - self.sprite.clickX;
        //     const dy = self.sprite.y - self.sprite.clickY;
        //     if (Math.sqrt(dx * dx + dy * dy) > 5) {
        //
        //         if (self.sprite.clickX > self.sprite.x) {
        //             self.sprite.x += self.sprite.vmax;
        //             walk_direction = 'right';
        //         }
        //         if (self.sprite.clickX < self.sprite.x) {
        //             self.sprite.x -= self.sprite.vmax;
        //             walk_direction = 'left';
        //         }
        //
        //         if (self.sprite.clickY > self.sprite.y) {
        //             self.sprite.y += self.sprite.vmax;
        //             walk_direction = 'down';
        //         }
        //         if (self.sprite.clickY < self.sprite.y) {
        //             self.sprite.y -= self.sprite.vmax;
        //             walk_direction = 'up';
        //         }
        //
        //         onWalk = true;
        //         // if (rect.x === frameLocations.stand_front[0] && rect.y === frameLocations.stand_front[1]) {
        //         //     rect.x = frameLocations.surprised_front[0];
        //         //     rect.y = frameLocations.surprised_front[1];
        //         // } else {
        //         //     rect.x = frameLocations.stand_front[0];
        //         //     rect.y = frameLocations.stand_front[1];
        //         // }
        //
        //         const bound = self.sprite.getBounds();
        //         self.sprite.pivot.set(bound.width / 2, bound.height / 2);
        //
        //     } else {
        //         onWalk = false;
        //     }
        // }, 10);
        //
        //
        // const character_animation = setInterval(function () {
        //
        //     if (onWalk) {
        //         if (walk_direction === 'right') {
        //             rect.x = frameLocations.walk_right[walk_step_index][0];
        //             rect.y = frameLocations.walk_right[walk_step_index][1];
        //         } else if (walk_direction === 'left') {
        //             rect.x = frameLocations.walk_left[walk_step_index][0];
        //             rect.y = frameLocations.walk_left[walk_step_index][1];
        //         } else if (walk_direction === 'up') {
        //             rect.x = frameLocations.walk_up[walk_step_index][0];
        //             rect.y = frameLocations.walk_up[walk_step_index][1];
        //         } else if (walk_direction === 'down') {
        //             rect.x = frameLocations.walk_down[walk_step_index][0];
        //             rect.y = frameLocations.walk_down[walk_step_index][1];
        //         }
        //
        //
        //         walk_step_index++;
        //         if (walk_step_index > 3) {
        //             walk_step_index = 0;
        //         }
        //
        //         self.sprite.texture.frame = rect;
        //     }
        //
        // }, 10);

        //

        for (let i = 0 ; i < 2 ; i++) {
            self.characters.push(new Character(PIXI, 'hero' + i, 2));
=======

        for (let i = 0 ; i < 1 ; i++) {
            self.characters.push(new Character(PIXI, 'hero' + i, 5));
>>>>>>> eeaed51146f8091aa3d2cc2373323a4c41eccd99
        }

        document.getElementById('playGraoundWrapper').addEventListener('click', function (event) {
            const clickX = event.clientX - playGraoundWrapper.offsetLeft;
            const clickY = event.clientY - playGraoundWrapper.offsetTop;
<<<<<<< HEAD
            // self.sprite.clickX = clickX;
            // self.sprite.clickY = clickY;
            // console.log({clickX, clickY});

            for (let i = 0 ; i < self.characters.length ; i++) {
                setTimeout(function () {
                    self.characters[i].setLocation(clickX, clickY);
                }, (i * 100));
=======
            for (let i = 0 ; i < self.characters.length ; i++) {
                setTimeout(function () {
                    self.characters[i].setLocation(clickX, clickY);
                }, (i * 500));
>>>>>>> eeaed51146f8091aa3d2cc2373323a4c41eccd99
            }
        });


        // document.getElementById('playGraoundWrapper').addEventListener('mousemove', function (event) {
        //     const clickX = event.clientX - playGraoundWrapper.offsetLeft;
        //     const clickY = event.clientY - playGraoundWrapper.offsetTop;
        //     console.log({clickX, clickY});
        // });


        for (let i = 0 ; i < self.characters.length ; i++) {
            this.stage.addChild(self.characters[i].sprite);
        }

        this.animationLoop();
    }


    animationLoop() {
        const self = this;
        requestAnimationFrame(() => {
            self.animationLoop();
        });

        this.renderer.render(this.stage);
    }

}
