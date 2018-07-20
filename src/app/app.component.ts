import { Component, OnInit } from "@angular/core";
import { Character } from "./character";
import { WindowRef } from "./WindowRef";

declare var PIXI: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  window: any;
  renderer: any;
  stage = new PIXI.Container();
  title = "app";
  sprite: any;
  initialPoint: any;
  finalPoint: any;
  characters = new Array<Character>();
  ratio: number;

  //Swipe
  touchstartX = 0;
  touchstartY = 0;
  touchendX = 0;
  touchendY = 0;
  swiped: any;
  w: number;
  h: number;

  constructor(private winRef: WindowRef) {
    this.renderer = PIXI.autoDetectRenderer({
      width: 1920,
      height: 1080,
      resolution: null,
      backgroundColor: 0x1099bb
    });
  }

  ngOnInit() {
    console.log("Native window obj", this.winRef.nativeWindow);
    this.ratio = 1920 / 1080;
    const self = this;
    const that = this;
    document
      .getElementById("playGraoundWrapper")
      .appendChild(this.renderer.view);

    PIXI.loader.add("herosprite", "assets/img/trev-ovr.png").load(() => {
      self.setup();
    });

    const gesuredZone = document.getElementById("playGraoundWrapper");
    gesuredZone.addEventListener(
      "touchstart",
      function(event) {
        that.touchstartX = event.changedTouches[0].screenX;
        that.touchstartY = event.changedTouches[0].screenY;
      },
      false
    );

    gesuredZone.addEventListener(
      "touchend",
      function(event) {
        that.touchendX = event.changedTouches[0].screenX;
        that.touchendY = event.changedTouches[0].screenY;
        handleGesure();
      },
      false
    );

    function handleGesure() {
      that.swiped = "swiped:";
      if (that.touchendX < that.touchstartX) {
        console.log("left");
      }
      if (that.touchendX > that.touchstartX) {
        console.log("right");
      }
      if (that.touchendY < that.touchstartY) {
        console.log("down");
      }
      if (that.touchendY > that.touchstartY) {
        console.log("up");
      }

      //Mobile Click
      if (that.touchendY === that.touchstartY) {
        self.setCordinates(self.characters, that.touchendX, that.touchendY);
      }
    }
    this.winRef.nativeWindow.onresize = function(event) {
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
    this.renderer.view.style.width = this.w + "px";
    this.renderer.view.style.height = this.h + "px";
  }

  setup() {
    const playGraoundWrapper = document.getElementById("playGraoundWrapper");
    const self = this;
    this.stage.interactive = true;

    for (let i = 0; i < 2; i++) {
      self.characters.push(new Character(PIXI, "hero" + i, 2));
    }

    //Desktop Browser Click
    document
      .getElementById("playGraoundWrapper")
      .addEventListener("click", function(event) {
        const clickX = event.clientX - playGraoundWrapper.offsetLeft;
        const clickY = event.clientY - playGraoundWrapper.offsetTop;
        self.setCordinates(self.characters, clickX, clickY);
        // self.sprite.clickX = clickX;
        // self.sprite.clickY = clickY;
        // console.log({clickX, clickY});
      });

    // document.getElementById('playGraoundWrapper').addEventListener('mousemove', function (event) {
    //     const clickX = event.clientX - playGraoundWrapper.offsetLeft;
    //     const clickY = event.clientY - playGraoundWrapper.offsetTop;
    //     console.log({clickX, clickY});
    // });

    for (let i = 0; i < self.characters.length; i++) {
      this.stage.addChild(self.characters[i].sprite);
    }

    this.animationLoop();
  }

  setCordinates(characters, clickX, clickY) {
    for (let i = 0; i < characters.length; i++) {
      setTimeout(function() {
        characters[i].setLocation(clickX, clickY);
      }, i * 100);
    }
  }

  animationLoop() {
    const self = this;
    requestAnimationFrame(() => {
      self.animationLoop();
    });

    this.renderer.render(this.stage);
  }
}
