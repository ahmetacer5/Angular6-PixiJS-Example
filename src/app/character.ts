export class Character {
    sprite: any;
    onWalk = false;
    walk_step_index = 0;
    walk_direction = 'right';

    frameLocations = {
        stand_front: [0, 56],
        surprised_front: [192, 120],
        walk_right: [
            [192, 56],
            [224, 56],
            [256, 56],
            [288, 56]
        ],
        walk_left: [
            [40, 0],
            [76, 0],
            [112, 0],
            [148, 0]
        ],
        walk_up: [
            [40, 112],
            [76, 112],
            [112, 112],
            [148, 112]
        ],
        walk_down: [
            [40, 56],
            [76, 56],
            [112, 56],
            [148, 56]
        ]

    };

    rect: any;

    constructor(PIXI, name, speed) {
        const self = this;

        self.rect = new PIXI.Rectangle(self.frameLocations.stand_front[0], self.frameLocations.stand_front[1], 32, 48);

        const texture = PIXI.loader.resources['herosprite'].texture;
        texture.frame = self.rect;

        self.sprite = new PIXI.Sprite(texture);



        let direction = '';

        const bound = self.sprite.getBounds();
        self.sprite.pivot.set(bound.width / 2, bound.height / 2);
        self.sprite.vmax = 1;
        self.sprite.x += bound.width / 2;
        self.sprite.y += bound.height / 2;



        const walk = setInterval(() => {
            const dx = self.sprite.x - self.sprite.clickX;
            const dy = self.sprite.y - self.sprite.clickY;
            if (Math.sqrt(dx * dx + dy * dy) > 5) {
                if (self.sprite.clickX > self.sprite.x) {
                    self.walk_direction = 'right';
                    self.sprite.x += self.sprite.vmax;
                }
                if (self.sprite.clickX < self.sprite.x) {
                    self.walk_direction = 'left';
                    self.sprite.x -= self.sprite.vmax;
                }

                if (self.sprite.clickY > self.sprite.y) {
                    self.walk_direction = 'down';
                    self.sprite.y += self.sprite.vmax;
                }
                if (self.sprite.clickY < self.sprite.y) {
                    self.walk_direction = 'up';
                    self.sprite.y -= self.sprite.vmax;
                }

                // if (rect.x === self.frameLocations.stand_front[0] && rect.y === self.frameLocations.stand_front[1]) {
                //     rect.x = self.frameLocations.surprised_front[0];
                //     rect.y = self.frameLocations.surprised_front[1];
                // } else {
                //     rect.x = self.frameLocations.stand_front[0];
                //     rect.y = self.frameLocations.stand_front[1];
                // }

                self.onWalk = true;

                if (self.walk_direction !== direction) {
                    self.setCharacterDirection();
                    direction = self.walk_direction;
                }

            } else {
                self.onWalk = false;
            }
        }, speed);


        const character_animation = setInterval(() => {
            self.setCharacterDirection();
        }, 100);
    }


    setCharacterDirection() {
        const self = this;
        if (self.onWalk) {
            if (self.walk_direction === 'right') {
                self.rect.x = self.frameLocations.walk_right[self.walk_step_index][0];
                self.rect.y = self.frameLocations.walk_right[self.walk_step_index][1];
            } else if (self.walk_direction === 'left') {
                self.rect.x = self.frameLocations.walk_left[self.walk_step_index][0];
                self.rect.y = self.frameLocations.walk_left[self.walk_step_index][1];
            } else if (self.walk_direction === 'up') {
                self.rect.x = self.frameLocations.walk_up[self.walk_step_index][0];
                self.rect.y = self.frameLocations.walk_up[self.walk_step_index][1];
            } else if (self.walk_direction === 'down') {
                self.rect.x = self.frameLocations.walk_down[self.walk_step_index][0];
                self.rect.y = self.frameLocations.walk_down[self.walk_step_index][1];
            }


            self.walk_step_index++;
            if (self.walk_step_index > 3) {
                self.walk_step_index = 0;
            }


        } else {
            if (self.rect.x === self.frameLocations.stand_front[0] && self.rect.y === self.frameLocations.stand_front[1]) {
                self.rect.x = self.frameLocations.surprised_front[0];
                self.rect.y = self.frameLocations.surprised_front[1];
            } else {
                self.rect.x = self.frameLocations.stand_front[0];
                self.rect.y = self.frameLocations.stand_front[1];
            }
        }

        self.sprite.texture.frame = self.rect;
    }

    setLocation(x, y) {
        this.sprite.clickX = x;
        this.sprite.clickY = y;
    }

}
