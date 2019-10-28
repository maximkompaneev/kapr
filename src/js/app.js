import { TimelineMax, CSSPlugin } from 'gsap/all';

const plugins = [CSSPlugin];

// math helpers
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fishAnimations() {
  const eyeHoverElement = document.querySelector('.fish');
  const finBottom = document.querySelector('#aVfGUDkRS');
  const finCentral = document.querySelector('#b2nIh3xrrw');
  const firstScale = document.querySelector('#c1e9NrGP9f');
  const secondScale = document.querySelector('#a5HK4c3zzJ');
  const thirdScale = document.querySelector('#b19qpnJpYe');
  const fourthScale = document.querySelector('#g1Wk79UCga');
  const eye = document.querySelector('#aJ1GsMSi');
  const tail = document.querySelector('#j4aZopyk7');
  const finBottomRight = document.querySelector('#a6pHhzMYCp');
  const gills = document.querySelector('#f5zAeqRE2y');

  // create timeline for eye in paused state
  const eyeTl = new TimelineMax({ paused: true });
  eyeTl.to(eye, 0.4, {
    x: -15,
    y: 12,
    rotation: -60,
    yoyoEase: true,
  });

  //  fin bottom (stroke)
  TweenMax.to(finBottom, 1, {
    x: 1,
    y: 1,
    rotation: -5,
    yoyoEase: true,
    repeat: -1,
    repeatDelay: 1,
  });

  //  fin central
  TweenMax.to(finCentral, 1, {
    x: 1,
    y: 1,
    rotation: -5,
    yoyoEase: true,
    repeat: -1,
    delay: 0.1,
  });

  //  first of scales
  TweenMax.to(firstScale, 1.8, {
    x: 1,
    y: -2,
    opacity: 0,
    repeatDelay: 0.8,
    delay: -1,
    repeat: -1,
  });

  //  second of scales
  TweenMax.to(secondScale, 1.8, {
    x: 1,
    y: 3,
    opacity: 0,
    repeatDelay: 0.8,
    delay: -2,
    repeat: -1,
  });

  //  third of scales
  TweenMax.to(thirdScale, 1.8, {
    x: 1,
    y: 3,
    opacity: 0,
    repeatDelay: 0.8,
    delay: -3,
    repeat: -1,
  });

  //  fourth of scales
  TweenMax.to(fourthScale, 1.8, {
    x: 1,
    y: -3,
    opacity: 0,
    repeatDelay: 0.8,
    delay: -4,
    repeat: -1,
  });

  // tail
  TweenMax.fromTo(
    tail,
    1,
    {
      x: -0.5,
      y: -2,
      rotation: -1,
      yoyoEase: true,
      repeatDelay: 0.8,
      delay: -1,
      repeat: -1,
    },
    {
      x: 0.5,
      y: 2,
      rotation: 1,
      yoyoEase: true,
      repeatDelay: 0.8,
      delay: -1,
      repeat: -1,
    },
  );

  // finBottomRight
  TweenMax.fromTo(
    finBottomRight,
    1,
    {
      y: -1,
      x: -0.5,
      rotation: -2,
      yoyoEase: true,
      delay: -1,
      repeat: -1,
    },
    {
      y: 0,
      x: 0.5,
      rotation: 3,
      yoyoEase: true,
      delay: -1,
      repeat: -1,
    },
  );

  // breathe thingy
  TweenMax.to(gills, 1.8, {
    scaleX: 1.3,
    yoyoEase: true,
    repeatDelay: 1,
    delay: -1,
    repeat: -1,
  });

  function eyeMouseEnter() {
    eyeTl.play();
  }

  function eyeMouseOut() {
    eyeTl.reverse();
  }
  eyeHoverElement.addEventListener('mouseenter', eyeMouseEnter);
  eyeHoverElement.addEventListener('mouseout', eyeMouseOut);
}
function fishEyeMovement() {
  const eyeInner = document.querySelector('.eye');
  let w = window.innerWidth;
  let h = window.innerHeight;
  document.body.onmousemove = (e) => {
    const x = e.pageX;
    const y = e.pageY;
    const angle = Math.atan2(y - h / 2, x - w / 2) * (180 / Math.PI);
    const rotate = angle;

    TweenMax.to(eyeInner, 0.3, {
      rotation: angle,
      x: 10,
      y: 5,
    });
  };
  document.body.onresize = () => {
    w = window.innerWidth;
    h = window.innerHeight;
  };
}

function fishMovement() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const fish = document.querySelector('.fish');
  const fishHeight = fish.clientHeight;

  let yPosRand = randomIntFromInterval(-h / 2 + fishHeight, h / 2 - fishHeight);
  function doTween() {
    TweenMax.fromTo(
      fish,
      6,
      {
        y: yPosRand,
        x: w / 2 + 200,
        ease: Power0.easeNone,
      },
      {
        y: yPosRand,
        x: -w / 2 - 200,
        ease: Power0.easeNone,
        onComplete() {
          yPosRand = randomIntFromInterval(-h / 2 + fishHeight, h / 2 - fishHeight);
          doTween();
        },
      },
    );
  }
  doTween();
}

window.onload = () => {
  fishAnimations();
  fishEyeMovement();
  fishMovement();
};
