/* 
  
reverb impulse response from:
https://github.com/cwilso/web-audio-samples/tree/master/samples/audio/impulse-responses

*/

let audioCtx;
let audioSources = [];
let padGainNodes = [];
let padPanNodes = [];
let reverbMainNode, compMainNode;
let reverbActive = false;
let compressorActive = false;
const audioSourcesEl = document.querySelectorAll(".audio-source");

// pads release toggle - stop the sample prematurely
const release = [false, false, false, false, false, true, true, false, true];

// drum kits
const kits = [
  {
    name: "808",
    id: [
      "res_kick",
      "res_snare",
      "res_hihat",
      "res_tom1",
      "res_sideStick",
      "res_hihatOpen",
      "res_tom2",
      "res_clap",
      "res_cymbal",
    ],
    sounds: [
      "kit808\\808_kik.wav",
      "kit808\\808_sn.wav",
      "kit808\\808_hh.wav",
      "kit808\\808_tom1.wav",
      "kit808\\808_sidestick.wav",
      "kit808\\808_hhopen.wav",
      "kit808\\808_tom2.wav",
      "kit808\\808_clap.wav",
      "kit808\\808_crash.wav",
    ],
  },
  {
    name: "909",
    id: [
      "res_kick",
      "res_snare",
      "res_hihat",
      "res_tom1",
      "res_sideStick",
      "res_hihatOpen",
      "res_tom2",
      "res_clap",
      "res_cymbal",
    ],
    sounds: [
      "kit909\\909_kik.wav",
      "kit909\\909_sn.wav",
      "kit909\\909_hh.wav",
      "kit909\\909_tom1.wav",
      "kit909\\909_sidestick.wav",
      "kit909\\909_hhopen.wav",
      "kit909\\909_tom2.wav",
      "kit909\\909_clap.wav",
      "kit909\\909_crash.wav",
    ],
  },
  {
    name: "Linn",
    id: [
      "res_kick",
      "res_snare",
      "res_hihat",
      "res_tom1",
      "res_sideStick",
      "res_hihatOpen",
      "res_tom2",
      "res_clap",
      "res_cymbal",
    ],
    sounds: [
      "kitLinn\\Linn_kik.wav",
      "kitLinn\\Linn_sn.wav",
      "kitLinn\\Linn_hh.wav",
      "kitLinn\\Linn_tom1.wav",
      "kitLinn\\Linn_sidestick.wav",
      "kitLinn\\Linn_hhopen.wav",
      "kitLinn\\Linn_tom2.wav",
      "kitLinn\\Linn_clap.wav",
      "kitLinn\\Linn_crash.wav",
    ],
  },
  {
    name: "CR78",
    id: [
      "res_kick",
      "res_snare",
      "res_hihat",
      "res_tom1",
      "res_sideStick",
      "res_hihatOpen",
      "res_tom2",
      "res_clap",
      "res_cymbal",
    ],
    sounds: [
      "kitCR78\\CR78_kik.wav",
      "kitCR78\\CR78_sn.wav",
      "kitCR78\\CR78_hh.wav",
      "kitCR78\\CR78_tom1.wav",
      "kitCR78\\CR78_sidestick.wav",
      "kitCR78\\CR78_hhopen.wav",
      "kitCR78\\CR78_tom2.wav",
      "kitCR78\\CR78_clave.wav",
      "kitCR78\\CR78_crash.wav",
    ],
  },
  {
    name: "Live",
    id: [
      "res_kick",
      "res_snare",
      "res_hihat",
      "res_tom1",
      "res_sideStick",
      "res_hihatOpen",
      "res_tom2",
      "res_clap",
      "res_cymbal",
    ],
    sounds: [
      "kitLive\\Live_kik.wav",
      "kitLive\\Live_sn.wav",
      "kitLive\\Live_hh.wav",
      "kitLive\\Live_tom1.wav",
      "kitLive\\Live_sidestick.wav",
      "kitLive\\Live_hhopen.wav",
      "kitLive\\Live_tom2.wav",
      "kitLive\\Live_rimshot.wav",
      "kitLive\\Live_crash.wav",
    ],
  },
];

// defaults
let currentKit = kits[0];
let color = "#00ffff";

// for no auto play browser policy
document.querySelector("#splashbtn").addEventListener("click", function () {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx.crossOrigin = "anonymous";
  init();
  document.querySelector(".splash-container").classList.add("hide");
});

async function createReverb() {
  let convolver = audioCtx.createConvolver();
  let response = await fetch("res\\reverb\\medium-room2.wav");
  let arraybuffer = await response.arrayBuffer();
  convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);
  reverbMainNode = convolver;
}

// run at start
function init() {
  // gather audio elements
  audioSourcesEl.forEach((el, i) => {
    audioSources[i] = audioCtx.createMediaElementSource(el);
  });

  // main gain, compressor and reverb nodes
  createReverb();
  gainMainNode = audioCtx.createGain();
  compMainNode = new DynamicsCompressorNode(audioCtx, {
    threshold: -50,
    knee: 40,
    ratio: 12,
    attack: 0,
    release: 0.25,
  });

  // pad nodes
  for (let i = 0; i < 9; i++) {
    padGainNodes[i] = audioCtx.createGain();
    padPanNodes[i] = new StereoPannerNode(audioCtx, { pan: 0 });
    audioSources[i]
      .connect(padGainNodes[i])
      .connect(padPanNodes[i])
      .connect(gainMainNode)
      .connect(audioCtx.destination);
  }

  messenger("<<< CLICK 'DRUM MACHINE' FOR OPTIONS");
  updateColors();
  setTimeout(initKitAnimation, 1000);
}

// pads
const pads = document.querySelectorAll(".pad");

// control inputs
const volumeMainSlider = document.querySelector(".mainVolume");

volumeMainSlider.addEventListener("input", function () {
  gainMainNode.gain.value = this.value;
});

const volPadSliders = document.querySelectorAll(".padVol");
volPadSliders.forEach((el, i) => {
  el.addEventListener("input", function () {
    padGainNodes[i].gain.value = this.value;
  });
});

const panPadSliders = document.querySelectorAll(".padPan");
panPadSliders.forEach((el, i) => {
  panPadSliders[i].addEventListener("input", function () {
    padPanNodes[i].pan.value = this.value;
  });
});

const notifier = document.querySelector(".notifier");

// load kits
function loadDrumkit(res = "808") {
  currentKit = kits.filter((kit) => {
    return kit.name === res;
  });

  currentKit = currentKit[0];

  currentKit.sounds.forEach((sound, i) => {
    audioSources[i].mediaElement.src = `res\\${sound}`;
  });

  instrumentNames();
}

/* play and stop */

function play(sound, el) {
  sound.play();
  el.style.borderColor = color;
}

function stop(sound, el, release) {
  if (release) {
    sound.pause();
    sound.currentTime = 0;
  }

  el.style.borderColor = "black";
}

/* pads mousedown, mouseup events */

pads.forEach((el, i) => {
  el.addEventListener("mousedown", function () {
    play(audioSourcesEl[i], this);
    //play(audioSources[i], this);
  });
  el.addEventListener("mouseup", function () {
    stop(audioSourcesEl[i], this, release[i]);
  });
});

/* numpad key down and up events */

// key codes for numpad: 7, 8, 9, 4, 5, 6, 1, 2, 3
const keyCodes = [103, 104, 105, 100, 101, 102, 97, 98, 99];

function handelKeys(key, direction) {
  const index = keyCodes.indexOf(key);

  if (direction) {
    play(audioSourcesEl[index], pads[index]);
  } else {
    stop(audioSourcesEl[index], pads[index], release[index]);
  }
}

// numpad key down
window.onkeydown = function (e) {
  handelKeys(e.keyCode, 1);
};

// numpad key up
window.onkeyup = function (e) {
  handelKeys(e.keyCode, 0);
};

/* Util - Toggle Show/Hide */

function toggleShowHide(el, toReturn) {
  let res = "";
  let index = el.classList.length - 1;

  if (el.classList.item(index) === "hide") {
    el.classList.remove("hide");
    el.classList.add("show");
    res = "hide";
  } else {
    el.classList.remove("show");
    el.classList.add("hide");
    res = "show";
  }

  if (toReturn) {
    return res;
  }
}

/* Util - Button State */

function setSelectedState(el, selected) {
  if (selected) {
    el.setAttribute("data-state", "selected");
  } else {
    el.setAttribute("data-state", "");
  }
}

/* Util - Update Colors */

function updateColors() {
  // pad ctrl, comp, reverb and names
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn) => {
    if (btn.getAttribute("data-state") === "selected") {
      btn.style.backgroundColor = color;
      btn.style.border = "solid 4px " + color;
    } else {
      btn.style.backgroundColor = "var(--btnBGColor)";
      btn.style.border = "solid 4px var(--btnBorderColor)";
    }
  });

  // kit select
  kitSelector.forEach((kit) => {
    if (kit.getAttribute("data-state") === "selected") {
      kit.style.border = "solid 4px " + color;
      kit.style.backgroundColor = color;
    } else {
      kit.style.border = "solid 4px var(--btnBorderColor)";
      kit.style.backgroundColor = "var(--btnBGColor)";
    }
  });

  // color select
  colorSelector.forEach((cs) => {
    if (cs.getAttribute("data-state") === "selected") {
      cs.style.border = "solid 4px " + color;
    } else {
      cs.style.border = "solid 4px var(--btnBorderColor)";
    }
  });

  // release buttons
  release.forEach((rel, i) => {
    if (rel) {
      releaseBtns[i].style.border = "solid 4px " + color;
      releaseBtns[i].style.backgroundColor = color;
    } else {
      releaseBtns[i].style.border = "solid 4px var(--btnBorderColor)";
      releaseBtns[i].style.backgroundColor = "var(--btnBGColor)";
    }
  });

  // logo hover
  optionsToggle.style.setProperty("--highlightColor", color);
}

/* Util - Messages */

function messenger(text) {
  notifier.textContent = text;
  notifier.classList.add("show");
  setTimeout(function () {
    notifier.classList.remove("show");
  }, 3000);
}

/* Options - Options toggle */

const optionsToggle = document.getElementById("logo");
const sectionOptions = document.querySelector(".sectionOptions");

// manage toggling of options panel and pad controls
function managePanels() {
  // if options hidden open it
  if (!sectionOptions.classList.contains("show")) {
    if (sectionOptions.classList.contains("pads-extended")) {
      sectionOptions.style.top = "562px";
    } else if (!sectionOptions.classList.contains("pads-extended")) {
      sectionOptions.style.top = "413px";
    }

    sectionOptions.classList.add("show");
  } else {
    // options is visable
    if (sectionOptions.classList.contains("pads-extended")) {
      sectionOptions.style.top = "100px";
    } else if (!sectionOptions.classList.contains("pads-extended")) {
      sectionOptions.style.top = "100px";
    }

    sectionOptions.classList.remove("show");
  }
}

optionsToggle.addEventListener("click", managePanels);

/* Options - Pad controls */

const btnPadCtrls = document.querySelector("#btnPadCtrls");

btnPadCtrls.addEventListener("click", function () {
  const padControls = document.querySelectorAll("li.padControlRow");

  if (toggleShowHide(padControls[0], true) === "hide") {
    for (let i = 0; i < padControls.length; i++) {
      padControls[i].style.display = "block";
    }
    setSelectedState(this, true);
    sectionOptions.style.top = "562px";
  } else {
    for (let i = 0; i < padControls.length; i++) {
      padControls[i].style.display = "none";
    }
    setSelectedState(this, false);
    this.style.backgroundColor = "#ffffff";
    this.style.border = "solid 4px slategrey";
    sectionOptions.style.top = "413px";
  }
  sectionOptions.classList.toggle("pads-extended");
  updateColors();
});

/* Options - Global Reverb */

const btnReverb = document.querySelector("#btnReverb");
btnReverb.addEventListener("click", function () {
  reverbActive = !reverbActive;

  if (this.getAttribute("data-state") === "selected") {
    reverbMainNode.disconnect();

    // reconnect without reverb node
    for (let i = 0; i < audioSources.length; i++) {
      //audioSources[i]
      // .connect(padGainNodes[i])
      // .connect(padPanNodes[i])
      // .connect(gainMainNode)
      // .connect(audioCtx.destination);

      if (compressorActive) {
        padPanNodes[i].connect(compMainNode);
        compMainNode.connect(gainMainNode);
      } else {
        padPanNodes[i].connect(gainMainNode);
      }
    }

    gainMainNode.connect(audioCtx.destination);

    // update ui
    setSelectedState(this, false);
    this.style.backgroundColor = "#ffffff";
    this.style.border = "solid 4px slategrey";
  } else {
    //connect reverb node

    if (compressorActive) {
      compMainNode.connect(reverbMainNode);
    } else {
      for (let i = 0; i < audioSources.length; i++) {
        audioSources[i]
          .connect(padGainNodes[i])
          .connect(padPanNodes[i])
          .connect(reverbMainNode);
      }
    }
    reverbMainNode.connect(gainMainNode);
    gainMainNode.connect(audioCtx.destination);

    setSelectedState(this, true);
  }

  updateColors();
});

/* Options - Global Comp */

const btnComp = document.querySelector("#btnComp");

btnComp.addEventListener("click", function () {
  compressorActive = !compressorActive;

  if (this.getAttribute("data-state") === "selected") {
    compMainNode.disconnect();

    // reconnect without compressor node
    for (let i = 0; i < audioSources.length; i++) {
      if (reverbActive) {
        padPanNodes[i].connect(reverbMainNode);
        reverbMainNode.connect(gainMainNode);
      } else {
        padPanNodes[i].connect(gainMainNode);
      }
    }

    gainMainNode.connect(audioCtx.destination);

    // update ui
    setSelectedState(this, false);
    this.style.backgroundColor = "#ffffff";
    this.style.border = "solid 4px slategrey";
  } else {
    //connect compressor node

    for (let i = 0; i < audioSources.length; i++) {
      audioSources[i].connect(padGainNodes[i]);
      padGainNodes[i].connect(padPanNodes[i]);
      padPanNodes[i].connect(compMainNode);

      if (reverbActive) {
        compMainNode.connect(reverbMainNode);
        reverbMainNode.connect(gainMainNode);
      } else {
        compMainNode.connect(gainMainNode);
      }

      gainMainNode.connect(audioCtx.destination);
    }

    setSelectedState(this, true);
  }

  updateColors();
});

/* Options - Drumkits */

const kitSelector = document.querySelectorAll("ul.kitSelector li");

kitSelector.forEach((kit) => {
  kit.addEventListener("click", function (e) {
    const kitName = e.target.getAttribute("data-value");

    if (currentKit.name === kitName) return;

    loadDrumkit(kitName);

    for (let j = 0; j < kitSelector.length; j++) {
      setSelectedState(kitSelector[j], false);
    }

    setSelectedState(e.target, true);
    updateColors();
    initKitAnimation();
    messenger("... Loading " + e.target.textContent);
  });
});

/* pads animation - called on app and kit loading */

let aniIntervalID;
let aniCount;
let aniRndIndexNums = [];

function padKitAnimation() {
  // re-set previous pad
  if (aniCount > 0) {
    pads[aniRndIndexNums[aniCount - 1]].style.border = `solid 6px var(--black)`;
  }

  // stop and clear ani routine
  if (aniCount > 8) {
    clearInterval(aniIntervalID);
    aniIntervalID = null;
    aniRndIndexNums = [];
  } else {
    // animate
    pads[aniRndIndexNums[aniCount]].style.border = `solid 6px ${color}`;
    aniCount++;
  }
}

function initKitAnimation() {
  aniCount = 0;
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // shuffle pad indicies
  for (let i = 0; i < 9; i++) {
    const n = Math.floor(Math.random() * nums.length);
    aniRndIndexNums.push(nums[n]);
    nums.splice(n, 1);
  }

  if (!aniIntervalID) {
    aniIntervalID = setInterval(padKitAnimation, 200);
  }
}

/* Options - Names */

const btnNames = document.querySelector("#btnNames");

function instrumentNames() {
  if (currentKit.name === "CR78") {
    pads[7].firstChild.textContent = "CLAVE";
  } else if (currentKit.name === "Live") {
    pads[7].firstChild.textContent = "RIM-SHOT";
  } else {
    pads[7].firstChild.textContent = "CLAP";
  }
}

btnNames.addEventListener("click", function () {
  const names = document.querySelectorAll(".pad span");

  if (toggleShowHide(names[0], true) === "hide") {
    instrumentNames();

    for (let i = 0; i < names.length; i++) {
      names[i].style.display = "inline-block";
    }
    setSelectedState(this, true);
  } else {
    for (let i = 0; i < names.length; i++) {
      names[i].style.display = "none";
    }
    this.style.backgroundColor = "#ffffff";
    this.style.border = "solid 4px slategrey";
    setSelectedState(this, false);
  }

  updateColors();
});

/* Options - theme */

const btnTheme = document.getElementById("btnTheme");

btnTheme.addEventListener("click", function () {
  const rootEl = document.documentElement;
  const theme = rootEl.dataset.theme;
  const newTheme = theme === "light" ? "dark" : "light";
  rootEl.dataset.theme = newTheme;
  btnTheme.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
});

/* Options - Colors */

const colorSelector = document.querySelectorAll("ul.colors li");
colorSelector.forEach((colorSel) => {
  colorSel.addEventListener("click", function (e) {
    for (let j = 0; j < colorSelector.length; j++) {
      setSelectedState(colorSelector[j], false);
    }

    color = e.target.getAttribute("data-value");
    e.target.setAttribute("data-state", "selected");
    setSelectedState(e.target, true);

    updateColors();
  });
});

/* Release */

const releaseBtns = document.querySelectorAll(".release");

releaseBtns.forEach((rBtn, i) => {
  rBtn.addEventListener("click", function () {
    release[i] = !release[i];
    setSelectedState(this, true);
    updateColors();
  });
});
