
// <![CDATA[

var loader = PIXI.loader;
(function() {
  var treeURL = "images/christmas_tree_height_620.jpg";
  var jsonURL = "images/christmas_demo_2015_spritesheet.json";
  loader
    .add("tree", treeURL)
    .add("streamJSON", jsonURL);
  loader.once("complete", main);
  loader.load();
})();

function forEachPairInObj(obj, func) {
  for (var prop in obj) {
     if (obj.hasOwnProperty(prop)) {
        func(prop, obj[prop]);
     }
  }
}

// The possible results include min and max.
function randomIntBetween(min, max) {
  return Math.floor(Math.random() *
    (max - min + 1) + min);
}

// This function is based on code from
// http://stackoverflow.com/questions/30492259/
function weightedRandom(max, bellFactor) {
  var weightedRandomNum = 0;
  for (var i = 0; i < bellFactor; i++) {
    weightedRandomNum +=
      Math.random() * (max / bellFactor);
  }
  return weightedRandomNum;
}

var getViewportDimensions;
(function() {
  var dimensions = {};
  var iOS;
  getViewportDimensions = function() {
    // window.innerWidth was unreliable on iOS,
    // thus:
    iOS =
      /iPad|iPhone|iPod/.test(navigator.platform);
    if (iOS) {
      if (window.orientation % 180 === 0) {
        // If portrait mode:
        dimensions.width = screen.width;
        dimensions.height = window.innerHeight;
      } else {
        // If landscape mode:
        dimensions.width = screen.height;
        dimensions.height = window.innerHeight;
      }
    } else {
      dimensions.width = window.innerWidth;
      dimensions.height = window.innerHeight;
    }
    return dimensions;
  };
})();

var renderer = PIXI.autoDetectRenderer(
  getViewportDimensions().width,
  getViewportDimensions().height
);
renderer.autoResize = true;
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var pixiTicker = PIXI.ticker.shared;
pixiTicker.autoStart = false;
pixiTicker.stop();

var layoutFuncs = [];

function callEach(funcs) {
  funcs.forEach(function(func){
    func();
  });
}

var adjustLayout;
var resizing = false;
(function() {
  var resizeTimer;
  var currentHeight;
  var canvasHeightTarget;
  adjustLayout = function() {
    resizing = true;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      resizing = false;
    }, 250);
    currentHeight =
      getViewportDimensions().height;
    if (currentHeight >= 150) {
      canvasHeightTarget = currentHeight;
    } else {
      canvasHeightTarget = 150;
    }
    renderer.resize(
      getViewportDimensions().width,
      canvasHeightTarget
    );
    callEach(layoutFuncs);
    renderer.render(stage);
    scroll(0, 0);
  };
})();

["load", "resize", "orientationchange"].forEach(
  function(evt) {
    window.addEventListener(
      evt, adjustLayout
    );
  }
);

var credits = document.querySelector("#credits");
var canvas = document.querySelector("canvas");

function main(loader, resources) {

var treeContainer = new PIXI.Container();
stage.addChild(treeContainer);

var ropePoints = [];
var ropePointsOriginal = [];
var wavyTree;
var ropeSegmentLength;
(function() {
  var treeTexture =
    resources.tree.texture;
  var segmentCount = 20;
  ropeSegmentLength =
    treeTexture.height / segmentCount;
  for (var i = 0; i < segmentCount; i++) {
    ropePoints.push(
      new PIXI.Point(i * ropeSegmentLength, 0)
    );
    ropePointsOriginal.push(
      ropePoints[ropePoints.length - 1].clone()
    );
  }
  wavyTree = new PIXI.mesh.Rope(
    treeTexture, ropePoints
  );
  treeContainer.addChild(wavyTree);
  renderer.render(stage);
})();

(function() {
  var scale;
  layoutFuncs.push(function() {
    scale =
      renderer.height / 700;
    wavyTree.scale.set(scale);

    for (
      var i = 0;
      i < ropePoints.length;
      i++) {
      ropePoints[i].x =
        ropePointsOriginal[i].x;
      ropePoints[i].y =
        ropePointsOriginal[i].y;
    }

    wavyTree.position.x =
      renderer.width / 2 -
      wavyTree.width / 2;
    wavyTree.position.y =
      wavyTree.height / 2 +
      scale * 40;
  });
})();

var streamSprites = [];
(function() {
  var streamJSON = loader.resources.streamJSON;
  var streamTextures = streamJSON.textures;
  var pushSprite = function(fileName, texture) {
    streamSprites.push([
      fileName,
      new PIXI.Sprite(texture)
    ]);
  };
  forEachPairInObj(streamTextures, pushSprite);
})();

var streamItemCount = 50;

var streamContainer = new PIXI.particles.ParticleContainer(
  streamItemCount,
  {
    scale: false,
    position: true,
    rotation: false,
    uvs: false,
    alpha: false
  }
);
stage.addChild(streamContainer);

function setStreamItemProps(item) {
  item.speed = randomIntBetween(15, 80) / 10;
  item.delay = randomIntBetween(0, 360);
  item.setX(0 - item.sprite.width / 2 - 10);
  var ySpace = renderer.height;
  item.setY(weightedRandom(ySpace, 3));
  return item;
}

var streamItems = [];
(function() {
  for (var i = 0; i < streamItemCount; i++) {
    var randomIndex =
      randomIntBetween(0, streamSprites.length - 1);
    var randomSprite =
      streamSprites[randomIndex][1];
    randomSprite.anchor.set(0.5, 0.5);
    var streamItem = {
      sprite: randomSprite
    };
    streamItem.setX = function(x) {
      this.x = this.sprite.position.x = x;
    };
    streamItem.setY = function(y) {
      this.y = this.sprite.position.y = y;
    };
    streamItems.push(streamItem);
    streamContainer.addChild(randomSprite);
  }
  streamItems.forEach(function(item) {
    setStreamItemProps(item);
  });
})();

adjustLayout();

(function() {
  var ropePointsCount = ropePoints.length;
  var ropePoint;
  var streamItemsLength = streamItems.length;
  var currentItem;
  function animate(timestamp) {
    if (!resizing) {
      for (
        var i = 0; i < ropePointsCount; i++
      ) {
        ropePoint = ropePoints[i];
        var progress = i / 6 + timestamp / 167;
        ropePoint.x =
          i * ropeSegmentLength +
          Math.cos(progress) * 25;
        ropePoint.y =
         Math.sin(progress) * 25;
      }
    }

    for (
      var i2 = 0;
      i2 < streamItemsLength;
      i2++
    ) {
      currentItem = streamItems[i2];
      var isOffscreen = currentItem.x >
        renderer.width +
        currentItem.sprite.width / 2 + 10;
      if (isOffscreen) {
        setStreamItemProps(currentItem);
      } else {
        if (currentItem.delay > 0) {
          currentItem.delay -= 1;
          currentItem.setX(currentItem.x);
        } else {
          currentItem.setX(
            currentItem.x + currentItem.speed
          );
        }
        currentItem.setY(currentItem.y);
      }
    }

    renderer.render(stage);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

} // end of main func.

// ]]>
    