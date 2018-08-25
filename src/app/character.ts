export class Character {
  sprite: any;

  constructor(PIXI, name, speed) {
    const self = this;
    const frameLocations = {
      stand_front: [0, 56],
      surprised_front: [192, 120],
      walk_right: [[192, 56], [224, 56], [256, 56], [288, 56]],
      walk_left: [[40, 0], [76, 0], [112, 0], [148, 0]],
      walk_up: [[40, 112], [76, 112], [112, 112], [148, 112]],
      walk_down: [[40, 56], [76, 56], [112, 56], [148, 56]]
    };

    const rect = new PIXI.Rectangle(
      frameLocations.stand_front[0],
      frameLocations.stand_front[1],
      32,
      48
    );

    const texture = PIXI.loader.resources["herosprite"].texture;
    texture.frame = rect;

    self.sprite = new PIXI.Sprite(texture);

    // this.sprite.scale.set(2, 2);

    self.sprite.vmax = speed;

    let walk_step_index = 0;
    let onWalk = false;
    let walk_direction = "right";
    const walk = setInterval(() => {
      const dx = self.sprite.x - self.sprite.clickX;
      const dy = self.sprite.y - self.sprite.clickY;
      if (Math.sqrt(dx * dx + dy * dy) > 5) {
        if (self.sprite.clickX > self.sprite.x) {
          self.sprite.rotation = 0;
          self.sprite.x += self.sprite.vmax;
          walk_direction = "right";
        }
        if (self.sprite.clickX < self.sprite.x) {
          self.sprite.rotation = 0;
          self.sprite.x -= self.sprite.vmax;
          walk_direction = "left";
        }

        if (self.sprite.clickY > self.sprite.y) {
          self.sprite.rotation = 0;
          self.sprite.y += self.sprite.vmax;
          walk_direction = "down";
        }
        if (self.sprite.clickY < self.sprite.y) {
          self.sprite.rotation = 0;
          self.sprite.y -= self.sprite.vmax;
          walk_direction = "up";
        }

        if (
          self.sprite.clickY < self.sprite.y &&
          self.sprite.clickX < self.sprite.x
        ) {
          self.sprite.rotation = 0.5;
          walk_direction = "left";
        }

        if (
          self.sprite.clickY > self.sprite.y &&
          self.sprite.clickX > self.sprite.x
        ) {
          self.sprite.rotation = 0.5;
          walk_direction = "right";
        }

        if (
          self.sprite.clickY < self.sprite.y &&
          self.sprite.clickX > self.sprite.x
        ) {
          self.sprite.rotation = -0.5;
          walk_direction = "right";
        }

        if (
          self.sprite.clickY > self.sprite.y &&
          self.sprite.clickX < self.sprite.x
        ) {
          self.sprite.rotation = -0.5;
          walk_direction = "left";
        }

        onWalk = true;
        const bound = self.sprite.getBounds();
        self.sprite.pivot.set(bound.width / 2, bound.height / 2);
      } else {
        onWalk = false;
      }
    }, 10);

    const character_animation = setInterval(function() {
      if (onWalk) {
        if (walk_direction === "right") {
          rect.x = frameLocations.walk_right[walk_step_index][0];
          rect.y = frameLocations.walk_right[walk_step_index][1];
        } else if (walk_direction === "left") {
          rect.x = frameLocations.walk_left[walk_step_index][0];
          rect.y = frameLocations.walk_left[walk_step_index][1];
        } else if (walk_direction === "up") {
          rect.x = frameLocations.walk_up[walk_step_index][0];
          rect.y = frameLocations.walk_up[walk_step_index][1];
        } else if (walk_direction === "down") {
          rect.x = frameLocations.walk_down[walk_step_index][0];
          rect.y = frameLocations.walk_down[walk_step_index][1];
        }

        walk_step_index++;
        if (walk_step_index > 3) {
          walk_step_index = 0;
        }

        self.sprite.texture.frame = rect;
      }
    }, 10);
  }

  setLocation(x, y) {
    this.sprite.clickX = x;
    this.sprite.clickY = y;
  }

  public getLocation() {
    return this.sprite;
  }
}
