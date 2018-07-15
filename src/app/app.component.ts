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


        for (let i = 0 ; i < 1 ; i++) {
            self.characters.push(new Character(PIXI, 'hero' + i, 5));
        }

        document.getElementById('playGraoundWrapper').addEventListener('click', function (event) {
            const clickX = event.clientX - playGraoundWrapper.offsetLeft;
            const clickY = event.clientY - playGraoundWrapper.offsetTop;
            for (let i = 0 ; i < self.characters.length ; i++) {
                setTimeout(function () {
                    self.characters[i].setLocation(clickX, clickY);
                }, (i * 500));
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
