import { Component, OnInit } from '@angular/core';
import { Character } from './character';
import { WindowRef } from './WindowRef';

declare var PIXI: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    window: any;
    renderer: any;
    stage = new PIXI.Container();
    app = new PIXI.Application();
    title = 'app';
    sprite: any;
    initialPoint: any;
    finalPoint: any;
    characters = new Array<Character>();
    ratio: number;
    axe: any;

    // Swipe
    touchstartX = 0;
    touchstartY = 0;
    touchendX = 0;
    touchendY = 0;
    swiped: any;
    w: number;
    h: number;

    constructor(private winRef: WindowRef) {
        this.renderer = PIXI.autoDetectRenderer({
            width: 640,
            height: 480,
            resolution: null,
            backgroundColor: 0x1099bb
        });
    }

    ngOnInit() {
        console.log('Native window obj', this.winRef.nativeWindow);
        this.ratio = 640 / 480;
        const self = this;
        const that = this;
        document
            .getElementById('playGraoundWrapper')
            .appendChild(this.renderer.view);

        PIXI.loader.add('axesprite', 'assets/img/axe.png');
        PIXI.loader.add('herosprite', 'assets/img/trev-ovr.png').load(() => {
            self.setup();
        });
        const gesuredZone = document.getElementById('playGraoundWrapper');
        gesuredZone.addEventListener(
            'touchstart',
            function (event) {
                that.touchstartX = event.changedTouches[0].screenX;
                that.touchstartY = event.changedTouches[0].screenY;
            },
            false
        );

        gesuredZone.addEventListener(
            'touchend',
            function (event) {
                that.touchendX = event.changedTouches[0].screenX;
                that.touchendY = event.changedTouches[0].screenY;
                that.handleGesure();
            },
            false
        );
        this.winRef.nativeWindow.onresize = function (event) {
            self.resize();
        };
    }

    resize() {
        if (window.innerWidth / window.innerHeight >= this.ratio) {
            this.w = window.innerHeight * this.ratio;
            this.h = window.innerHeight;
        } else {
            this.w = window.innerWidth;
            this.h = window.innerWidth / this.ratio;
        }
        this.renderer.view.style.width = this.w + 'px';
        this.renderer.view.style.height = this.h + 'px';
    }

    setup() {
        const playGraoundWrapper = document.getElementById('playGraoundWrapper');
        const self = this;
        const that = this;
        this.stage.interactive = true;

        const sound = PIXI.sound.add('axesound', 'assets/sound/axe.mp3');
        const axeTexture = PIXI.loader.resources['axesprite'].texture;
        self.axe = new PIXI.Sprite(axeTexture);
        self.axe.x = 100;
        self.axe.y = 100;
        self.axe.anchor.set(0.5); // Ortala
        self.axe.width = 20;
        self.axe.height = 60;

        for (let i = 0 ; i < 1 ; i++) {
            self.characters.push(new Character(PIXI, 'hero' + i, 2));
        }

        // Desktop Browser Click
        document
            .getElementById('playGraoundWrapper')
            .addEventListener('click', function (event) {
                const clickX = event.clientX - playGraoundWrapper.offsetLeft;
                const clickY = event.clientY - playGraoundWrapper.offsetTop;
                self.setCordinates(self.characters, clickX, clickY);
            });

        for (let i = 0 ; i < self.characters.length ; i++) {
            this.stage.addChild(self.characters[i].sprite);
        }

        this.animationLoop();
    }

    handleGesure() {
        const stripeLocation = this.characters[0].getLocation();
        this.swiped = 'swiped:';
        if (this.touchendX < this.touchstartX) {
            console.log('left');
            this.throwAxe(stripeLocation, 'left');
        }
        if (this.touchendX > this.touchstartX) {
            console.log('right');
            this.throwAxe(stripeLocation, 'right');
        }
        if (this.touchendY < this.touchstartY) {
            this.throwAxe(stripeLocation, 'up');
            console.log('up');
        }
        if (this.touchendY > this.touchstartY) {
            this.throwAxe(stripeLocation, 'down');
            console.log('down');
        }

        // Mobile Click
        if (this.touchendY === this.touchstartY) {
            this.setCordinates(this.characters, this.touchendX, this.touchendY);
        }
    }

    // Set Cordinate for character
    setCordinates(characters, clickX, clickY) {
        for (let i = 0 ; i < characters.length ; i++) {
            setTimeout(function () {
                characters[i].setLocation(clickX, clickY);
            }, i * 100);
        }
    }

    throwAxe(stripe: any, position: string) {
        console.log('HEY!');
        this.axe.x = stripe.clickX;
        this.axe.y = stripe.clickY;
        switch (position) {
            case 'left':
                this.axe.rotation = -5;
                break;
            case 'right':
                this.axeSound();
                console.log(stripe.clickX);
                break;
            case 'up':
                break;
            case 'down':
                break;
            default:
                break;
        }

        this.stage.addChild(this.axe);
        const xVelocity = 10;
        const yVelocity = 3;
        // Otomatik requestAnimationFrame i cagiriyor
        this.app.ticker.add(delta => {
            this.axe.x += xVelocity;
            this.axe.rotation += 0.4; // delta is 1 if running at 100% performance
        });
    }

    axeSound() {
        const calculateSound = function () {
            const options = {
                start: 5,
                end: 10
            };
            return options;
        };

        PIXI.sound.play('axesound', calculateSound);
    }

    animationLoop() {
        const self = this;
        requestAnimationFrame(() => {
            self.animationLoop();
        });

        this.renderer.render(this.stage);
    }
}
