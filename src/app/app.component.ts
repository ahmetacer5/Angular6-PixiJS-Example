import { Component, OnInit } from '@angular/core';

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
    const self = this;
    this.stage.interactive = true;

    const frameLocations = {
      stand_front: [0, 56],
      surprised_front: [192, 120]
    };

    const rect = new PIXI.Rectangle(frameLocations.stand_front[0], frameLocations.stand_front[1], 32, 48);

    const texture = PIXI.loader.resources['herosprite'].texture;
    texture.frame = rect;

    this.sprite = new PIXI.Sprite(texture);


    // this.sprite.scale.set(2, 2);


    const suprised_animation = setInterval(() => {
      if (rect.x === frameLocations.stand_front[0] && rect.y === frameLocations.stand_front[1]) {
        rect.x = frameLocations.surprised_front[0];
        rect.y = frameLocations.surprised_front[1];
      } else {
        rect.x = frameLocations.stand_front[0];
        rect.y = frameLocations.stand_front[1];
      }
      self.sprite.texture.frame = rect;
    }, 200);

    this.stage.addChild(this.sprite);
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
