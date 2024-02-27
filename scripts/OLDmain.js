    /*
        TODO

        - bug: expand options >> pad ctrls >> close options >> open options
        - bug: with reverb active >> lowering the min volume leaves the reverb tail
		- bug: (CSS) width of options box should be same width as main
		- find a place where to tell about the keypad settings
        - visualation would be cool
        - improve h1:hover
        - add verb slider?
        - add compressor?
        - if selected kit is kitLive then div.#clap span textContent = RIMSHOT

    */
window.onload = function() {

    let kit808 = {name:"808", id:['res_kick','res_snare','res_hihat', 'res_tom1', 'res_sideStick', 'res_hihatOpen', 'res_tom2','res_clap','res_cymbal'], sounds:['kit808\\808_kik.wav','kit808\\808_sn.wav','kit808\\808_hh.wav', 'kit808\\808_tom1.wav', 'kit808\\808_sidestick.wav', 'kit808\\808_hhopen.wav', 'kit808\\808_tom2.wav','kit808\\808_clap.wav', 'kit808\\808_crash.wav']};  
    let kit909 = {name:"909", id:['res_kick','res_snare','res_hihat', 'res_tom1', 'res_sideStick', 'res_hihatOpen', 'res_tom2','res_clap','res_cymbal'], sounds:['kit909\\909_kik.wav','kit909\\909_sn.wav','kit909\\909_hh.wav', 'kit909\\909_tom1.wav', 'kit909\\909_sidestick.wav', 'kit909\\909_hhopen.wav', 'kit909\\909_tom2.wav','kit909\\909_clap.wav', 'kit909\\909_crash.wav']};
    let kitLinn = {name:"Linn", id:['res_kick','res_snare','res_hihat', 'res_tom1', 'res_sideStick', 'res_hihatOpen', 'res_tom2','res_clap','res_cymbal'], sounds:['kitLinn\\Linn_kik.wav','kitLinn\\Linn_sn.wav','kitLinn\\Linn_hh.wav', 'kitLinn\\Linn_tom1.wav', 'kitLinn\\Linn_sidestick.wav', 'kitLinn\\Linn_hhopen.wav', 'kitLinn\\Linn_tom2.wav','kitLinn\\Linn_clap.wav', 'kitLinn\\Linn_crash.wav']};
    let kitCR78 = {name:"CR78", id:['res_kick','res_snare','res_hihat', 'res_tom1', 'res_sideStick', 'res_hihatOpen', 'res_tom2','res_clap','res_cymbal'], sounds:['kitCR78\\CR78_kik.wav','kitCR78\\CR78_sn.wav','kitCR78\\CR78_hh.wav', 'kitCR78\\CR78_tom1.wav', 'kitCR78\\CR78_sidestick.wav', 'kitCR78\\CR78_hhopen.wav', 'kitCR78\\CR78_tom2.wav','kitCR78\\CR78_clave.wav', 'kitCR78\\CR78_crash.wav']};
    let kitLive = {name:"Live", id:['res_kick','res_snare','res_hihat', 'res_tom1', 'res_sideStick', 'res_hihatOpen', 'res_tom2','res_clap','res_cymbal'], sounds:['kitLive\\Live_kik.wav','kitLive\\Live_sn.wav','kitLive\\Live_hh.wav', 'kitLive\\Live_tom1.wav', 'kitLive\\Live_sidestick.wav', 'kitLive\\Live_hhopen.wav', 'kitLive\\Live_tom2.wav','kitLive\\Live_rimshot.wav', 'kitLive\\Live_crash.wav']};

    let currentKit = kit808;

    let color = '#00ffff';
    const release = ['false','false','false','false','false','true','true','false','true'];

    // audio sources
    const audioEl_Kick = document.querySelector('#source_kick');
    const audioEl_Snare = document.querySelector('#source_snare');
    const audioEl_HiHat = document.querySelector('#source_hihat');
    const audioEl_Tom1 = document.querySelector('#source_tom1');    
    const audioEl_SideStick = document.querySelector('#source_sideStick');    
    const audioEl_HiHatOpen = document.querySelector('#source_hihatOpen');
    const audioEl_Tom2 = document.querySelector('#source_tom2');
    const audioEl_Clap = document.querySelector('#source_clap');
    const audioEl_Cymbal = document.querySelector('#source_cymbal');

    // pads
    const padKick = document.querySelector('#kick');
    const padSnare = document.querySelector('#snare');
    const padHiHat = document.querySelector('#hihat');
    const padTom1 = document.querySelector('#tom1');    
    const padSideStick = document.querySelector('#sideStick');
    const padHiHatOpen = document.querySelector('#hihatOpen');
    const padTom2 = document.querySelector('#tom2');
    const padClap = document.querySelector('#clap');
    const padCymbal = document.querySelector('#cymbal');    

    // controls
    const volumeMainSlider = document.querySelector('.mainVolume');

    // Create an AudioContext (cross browser)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    // load the audio source into audio graph
    const audioSourceKick = audioCtx.createMediaElementSource(audioEl_Kick);
    const audioSourceSnare = audioCtx.createMediaElementSource(audioEl_Snare);
    const audioSourceHiHat = audioCtx.createMediaElementSource(audioEl_HiHat);
    const audioSourceTom1 = audioCtx.createMediaElementSource(audioEl_Tom1);
    const audioSourceSideStick = audioCtx.createMediaElementSource(audioEl_SideStick);    
    const audioSourceHiHatOpen = audioCtx.createMediaElementSource(audioEl_HiHatOpen);
    const audioSourceTom2 = audioCtx.createMediaElementSource(audioEl_Tom2);
    const audioSourceClap = audioCtx.createMediaElementSource(audioEl_Clap);
    const audioSourceCymbal = audioCtx.createMediaElementSource(audioEl_Cymbal);

    let audioSources = [audioSourceSnare, audioSourceHiHat, audioSourceTom1, audioSourceSideStick, audioSourceHiHatOpen, audioSourceTom2, audioSourceClap, audioSourceCymbal];

    // gain
    const gainMainNode = audioCtx.createGain();
    const gainKickNode = audioCtx.createGain();
    const gainSnareNode = audioCtx.createGain();
    const gainHiHatNode = audioCtx.createGain();
    const gainTom1Node = audioCtx.createGain();
    const gainSideStickNode = audioCtx.createGain();
    const gainHiHatOpenNode = audioCtx.createGain();
    const gainTom2Node = audioCtx.createGain();
    const gainClapNode = audioCtx.createGain();
    const gainCymbalNode = audioCtx.createGain();

    let padGainNodes = [gainKickNode, gainSnareNode, gainHiHatNode, gainTom1Node, gainSideStickNode, gainHiHatOpenNode, gainTom2Node, gainClapNode, gainCymbalNode];
    
     volumeMainSlider.addEventListener('input', function() {
        gainMainNode.gain.value = this.value;
    });    

    const volPadSliders = document.querySelectorAll('.padVol');
    for (let i=0; i<volPadSliders.length; i++) {
        volPadSliders[i].addEventListener('input', function() {
            padGainNodes[i].gain.value = this.value;
        });
    }
    
    // panning
    const pannerOptions = { pan: 0 };
    const panKickNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panSnareNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panHiHatNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panTom1Node = new StereoPannerNode(audioCtx, pannerOptions);
    const panSideStickNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panHiHatOpenNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panTom2Node = new StereoPannerNode(audioCtx, pannerOptions);
    const panClapNode = new StereoPannerNode(audioCtx, pannerOptions);
    const panCymbalNode = new StereoPannerNode(audioCtx, pannerOptions);

    let padPanNodes = [panKickNode, panSnareNode, panHiHatNode, panTom1Node, panSideStickNode, panHiHatOpenNode, panTom2Node, panClapNode, panCymbalNode];

    const panPadSliders = document.querySelectorAll('.padPan');
    for (let i=0; i<panPadSliders.length; i++) {
        panPadSliders[i].addEventListener('input', function() {
            padPanNodes[i].pan.value = this.value;
        });
    }


   //audioSourceSnare.connect(filter.input);
   //audioSourceSnare.connect(compressor);

    // connect

    audioSourceKick.connect(panKickNode).connect(gainKickNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceSnare.connect(panSnareNode).connect(gainSnareNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceHiHat.connect(panHiHatNode).connect(gainHiHatNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceTom1.connect(panTom1Node).connect(gainTom1Node).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceSideStick.connect(panSideStickNode).connect(gainSideStickNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceHiHatOpen.connect(panHiHatOpenNode).connect(gainHiHatOpenNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceTom2.connect(panTom2Node).connect(gainTom2Node).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceClap.connect(panClapNode).connect(gainClapNode).connect(gainMainNode).connect(audioCtx.destination);
    audioSourceCymbal.connect(panCymbalNode).connect(gainCymbalNode).connect(gainMainNode).connect(audioCtx.destination);

    const notifier = document.querySelector('.notifier');

    // load kits
    function loadDrumkit(res = 'kit808') {

        //let kit = null;
        
        if (res === 'kit808') {
            currentKit = kit808;
        }
        else if (res === 'kit909') {
            currentKit = kit909;
        }
        else if (res === 'kitLinn') {
            currentKit = kitLinn;
        }
        else if (res === 'kitCR78') {
            currentKit = kitCR78;
        }
        else {
            currentKit = kitLive;
        }

        const audioEl = document.querySelectorAll('audio');
        
        for (let i=0; i<currentKit.sounds.length; i++) {
            let path = "res\\" + currentKit.sounds[i];
            audioEl[i].src = path;
        }

        instrumentNames(); 
    }

    // play and stop
    function play(obj, el) {
    
        obj.play();
        el.style.borderColor = color;
    }

    function stop(obj, el, release) {
    
        if (release === 'false') {
            obj.pause();
            obj.currentTime = 0;
        }

        el.style.borderColor = 'black';
    }


    // mouse down
    padKick.addEventListener('mousedown', function() {
        play(audioEl_Kick, this); 
    });

    padSnare.addEventListener('mousedown', function() {
        play(audioEl_Snare, this);
    });

    padHiHat.addEventListener('mousedown', function() {
        play(audioEl_HiHat, this);
    }); 

    padTom1.addEventListener('mousedown', function() {
        play(audioEl_Tom1, this);
    });

    padSideStick.addEventListener('mousedown', function() {
        play(audioEl_SideStick, this);
    });

    padHiHatOpen.addEventListener('mousedown', function() {
        play(audioEl_HiHatOpen, this);
    });

    padTom2.addEventListener('mousedown', function() {
        play(audioEl_Tom2, this);
    });
    
    padClap.addEventListener('mousedown', function() {
        play(audioEl_Clap, this);
    });
    
    padCymbal.addEventListener('mousedown', function() {
        play(audioEl_Cymbal, this);
    });    
    
    // mouse up
    padKick.addEventListener('mouseup', function() {
        stop(audioEl_Kick, this, release[0]);
    });

    padSnare.addEventListener('mouseup', function() {
        stop(audioEl_Snare, this, release[1]);
    });

    padHiHat.addEventListener('mouseup', function() {
        stop(audioEl_HiHat, this, release[2]);
    }); 
    
    padTom1.addEventListener('mouseup', function() {
        stop(audioEl_Tom1, this, release[3]);
    });
    
    padSideStick.addEventListener('mouseup', function() {
        stop(audioEl_SideStick, this, release[4]);
    });

    padHiHatOpen.addEventListener('mouseup', function() {
        stop(audioEl_HiHatOpen, this, release[5]);
    });

    padTom2.addEventListener('mouseup', function() {
        stop(audioEl_Tom2, this, release[6]);
    });
    
    padClap.addEventListener('mouseup', function() {
        stop(audioEl_Clap, this, release[7]);
    });
    
    padCymbal.addEventListener('mouseup', function() {
        stop(audioEl_Cymbal, this, release[8]);
    });

    // numpad key down
    window.onkeydown = function(e) {

        if (e.keyCode === 103) { // 7
            play(audioEl_Kick, padKick); 
        } 
        if (e.keyCode === 104) { // 8
            play(audioEl_Snare, padSnare);
        } 
        if (e.keyCode === 105) { // 9
            play(audioEl_HiHat, padHiHat);
        }
        if (e.keyCode === 100) { // 4
            play(audioEl_Tom1, padTom1);
        }
        if (e.keyCode === 101) { // 5
            play(audioEl_SideStick, padSideStick);
        }  
        if (e.keyCode === 102) { // 6
            play(audioEl_HiHatOpen, padHiHatOpen);
        }          
        if (e.keyCode === 97) { // 1
            play(audioEl_Tom2, padTom2);
        }  
        if (e.keyCode === 98) { // 2
            play(audioEl_Clap, padClap);
        }  
        if (e.keyCode === 99) { // 3
            play(audioEl_Cymbal, padCymbal);
        }        
    }

    // numpad key up
    window.onkeyup = function(e) {

        if (e.keyCode === 103) {
            stop(audioEl_Kick, padKick, release[0]); 
        } 
        if (e.keyCode === 104) {
            stop(audioEl_Snare, padSnare, release[1]);   
        } 
        if (e.keyCode === 105) {
            stop(audioEl_HiHat, padHiHat, release[2]);
        }
        if (e.keyCode === 100) { // 4
            stop(audioEl_Tom1, padTom1, release[3]);
        }  
        if (e.keyCode === 101) { // 5
            stop(audioEl_SideStick, padSideStick, release[4]);
        }
        if (e.keyCode === 102) {
            stop(audioEl_HiHatOpen, padHiHatOpen, release[5]);
        }        
        if (e.keyCode === 97) { // 1
            stop(audioEl_Tom2, padTom2, release[6]);
        }
        if (e.keyCode === 98) { // 2
            stop(audioEl_Clap, padClap, release[7]);
        }  
        if (e.keyCode === 99) { // 3
            stop(audioEl_Cymbal, padCymbal, release[8]);
        }                  
    }


    /* Util - Toggle Show/Hide */

    function toggleShowHide(el, toReturn) {

        let res = '';
        let index = el.classList.length - 1;

        if (el.classList.item(index) === 'hide') {    
            el.classList.remove('hide');
            el.classList.add('show');
            res = 'hide';
        }
        else {
            el.classList.remove('show');
            el.classList.add('hide');
            res = 'show';
        }
        
        if (toReturn) {
            return res;
        }
    }

    /* Util - Button State */

    function setSelectedState(el, selected) {

        if (selected) {
            el.setAttribute('data-state', 'selected');    
        }
        else {
            el.setAttribute('data-state', '');
        }
    }

    /* Util - Update Colors */

    function updateColors() {

        // pad ctrl button
        if (btnPadCtrls.getAttribute('data-state') === 'selected') {
            btnPadCtrls.style.backgroundColor = color;
            btnPadCtrls.style.border = 'solid 4px ' + color;
        }

        // reverb button
        if (btnReverb.getAttribute('data-state') === 'selected') {
            btnReverb.style.backgroundColor = color;
            btnReverb.style.border = 'solid 4px ' + color;
        }        

        // kit select buttons
        for (let i=0; i<kitSelector.length; i++) {

            if (kitSelector[i].getAttribute('data-state') === 'selected') {
                kitSelector[i].style.border = 'solid 4px ' + color;
                kitSelector[i].style.backgroundColor = color;
            }
            else {
                kitSelector[i].style.border = 'solid 4px slategrey';
                kitSelector[i].style.backgroundColor = '#ffffff';
            }
        }

        // color select buttons
        for (let i=0; i<colorSelector.length; i++) {

            if (colorSelector[i].getAttribute('data-state') === 'selected') {
                colorSelector[i].style.border = 'solid 4px ' + color;
            }
            else {
                colorSelector[i].style.border = 'solid 4px slategrey';
            }
        }

        // pad/instrument names button
        if (btnNames.getAttribute('data-state') === 'selected') {
            btnNames.style.backgroundColor = color;
            btnNames.style.border = 'solid 4px ' + color;
        }
        
        // visuals button
        if (btnVisual.getAttribute('data-state') === 'selected') {
            btnVisual.style.backgroundColor = color;
            btnVisual.style.border = 'solid 4px ' + color;
        }
       
        // release buttons
        for (let i=0; i<release.length; i++) {

            if (release[i] === 'true') {
                releaseBtns[i].style.border = 'solid 4px ' + color;
                releaseBtns[i].style.backgroundColor = color;
            }
            else {
                releaseBtns[i].style.border = 'solid 4px slategrey';
                releaseBtns[i].style.backgroundColor = '#ffffff';
            }
        }        
    }
    
    /* Util - Messages */
    
    function messenger(text) {
       
        notifier.textContent = text;
        notifier.classList.add('show');
        setTimeout(function() { notifier.classList.remove('show'); }, 3000);
    }

    /* Options - Options toggle */

    const optionsToggle = document.querySelector('h1');
    const sectionOptions = document.querySelector('.sectionOptions');

    optionsToggle.addEventListener('click', function() {

        sectionOptions.removeAttribute('style');

        if (sectionOptions.classList.contains('show')) {
            sectionOptions.classList.remove('show');
        }
        else {
            sectionOptions.classList.add('show');
        }
    });

    /* Options - Pad controls */

    const btnPadCtrls = document.querySelector('#btnPadCtrls');
    
    btnPadCtrls.addEventListener('click', function() {

        const padControls = document.querySelectorAll('li.padControlRow');

        if (toggleShowHide(padControls[0], true) === 'hide') {    
            for (let i=0; i<padControls.length; i++) {
                padControls[i].style.display = 'block';
            }
            setSelectedState(this, true);
            sectionOptions.style.top = '568px';
        }
        else {
            for (let i=0; i<padControls.length; i++) {
                padControls[i].style.display = 'none';
            }
            setSelectedState(this, false);
            this.style.backgroundColor = '#ffffff';
            this.style.border = 'solid 4px slategrey';
            sectionOptions.style.top = '420px';
        }

        updateColors();
    });

    /* Options - Reverb */

    const btnReverb = document.querySelector('#btnReverb');

    btnReverb.addEventListener('click', function() {

        if (this.getAttribute('data-state') === 'selected') {

            for (let i=0; i< audioSources.length; i++) {
                audioSources[i].disconnect(filter.input);       
            }

            setSelectedState(this, false);
            this.style.backgroundColor = '#ffffff';
            this.style.border = 'solid 4px slategrey';
        }
        else {

            for (let i=0; i< audioSources.length; i++) {
                audioSources[i].connect(filter.input);       
            }            

            setSelectedState(this, true);
        }
        
        updateColors();
    });

    const verbAmount = document.querySelector('.verbAmount');
    verbAmount.addEventListener('input', function() {
        //verb.decayTime = this.value;
        updateVerb(this.value);
    }); 

/*************************************** 
const btnComp = document.querySelector('.comp');
btnComp.addEventListener('click', function() {
    let compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-24, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime);
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    compressor.connect(audioCtx.destination);
});
*************************************** */


    /* Options - Drumkits */

    const kitSelector = document.querySelectorAll('ul.kitSelector li');
  
    for (let i=0; i<kitSelector.length; i++) {
        
        kitSelector[i].addEventListener('click', function(e) {
            
            e.preventDefault();

            loadDrumkit(e.target.getAttribute('data-value'));

            for (let j=0; j<kitSelector.length; j++) {
                setSelectedState(kitSelector[j], false);
            }

            setSelectedState(e.target, true);
            updateColors();
            messenger('... Loading ' + e.target.textContent);
        });
    }

    /* Options - Names */  

    const btnNames = document.querySelector('#btnNames');

    function instrumentNames() {

        // if selected kit is kitLive then div.#clap span textContent = RIMSHOT
        if (currentKit.name === 'CR78') {
            padClap.firstChild.textContent = 'CLAVE';
        }
        else if (currentKit.name === 'Live') {    
            padClap.firstChild.textContent = 'RIM-SHOT';    
        }
        else {
            padClap.firstChild.textContent = 'CLAP';
        }
    }

    btnNames.addEventListener('click', function() {

        const names = document.querySelectorAll('.pad span');

        if (toggleShowHide(names[0], true) === 'hide') {

            instrumentNames();    

            for (let i=0; i<names.length; i++) {
                names[i].style.display = 'inline-block';
            }
            setSelectedState(this, true);
        }
        else {
            for (let i=0; i<names.length; i++) {
                names[i].style.display = 'none';
            }
            this.style.backgroundColor = '#ffffff';
            this.style.border = 'solid 4px slategrey';
            setSelectedState(this, false);
        }

        updateColors();
    });

    /* Options - Colors */

    const colorSelector = document.querySelectorAll('ul.colors li');

    for (let i=0; i<colorSelector.length; i++) {

        colorSelector[i].addEventListener('click', function(e) {

            for (let j=0; j<colorSelector.length; j++) {
                setSelectedState(colorSelector[j], false);
            }

            color = e.target.getAttribute('data-value');
            e.target.setAttribute('data-state', 'selected');
            setSelectedState(e.target, true);

            updateColors();
        });
    }

    /* Release */

    const releaseBtns = document.querySelectorAll('.release');

    for (let i=0; i<releaseBtns.length; i++) {

        releaseBtns[i].addEventListener('click', function() {

            if (release[i] === 'false') {
                release[i] = 'true';
            }
            else {
                release[i] = 'false';
            }

            setSelectedState(this, true);
            updateColors();
        });
    }

    /* run at start up */

	
    function init() {
		

        messenger("<<< CLICK 'DRUM MACHINE' FOR OPTIONS");
        updateColors();
    }    

    //init();
/*
	const splashbtn = document.querySelector('#splashbtn');
	
	splashbtn.addEventListener('click', function() {
		
		audioCtx.state = "resume";
		init();
	});
*/
document.querySelector('#splashbtn').addEventListener('click', function() {
  audioCtx.resume().then(() => {
    init();
  });
});	


    /************************************ */
/*
    //var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var voiceSelect = document.getElementById("voice");
    var source;
    var stream;
    
    // grab the mute button to use below
    
    //var mute = document.querySelector('.mute');
    
    //set up the different audio nodes we will use for the app
    
    var analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;
    
    var distortion = audioCtx.createWaveShaper();
    var gainNode = audioCtx.createGain();
    var biquadFilter = audioCtx.createBiquadFilter();
    var convolver = audioCtx.createConvolver();
 */   
    // distortion curve for the waveshaper, thanks to Kevin Ennis
    // http://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
 /*   
    function makeDistortionCurve(amount) {
      var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    };
 */   
    // grab audio track via XHR for convolver node
/*    
    var soundSource, concertHallBuffer;
*/    
  /*  
    ajaxRequest = new XMLHttpRequest();
    
    ajaxRequest.open('GET', 'https://mdn.github.io/voice-change-o-matic/audio/concert-crowd.ogg', true);
    
    ajaxRequest.responseType = 'arraybuffer';
    
    
    ajaxRequest.onload = function() {
      var audioData = ajaxRequest.response;
    
      audioCtx.decodeAudioData(audioData, function(buffer) {
          concertHallBuffer = buffer;
          soundSource = audioCtx.createBufferSource();
          soundSource.buffer = concertHallBuffer;
        }, function(e){"Error with decoding audio data" + e.err});
    
      //soundSource.connect(audioCtx.destination);
      //soundSource.loop = true;
      //soundSource.start();
    }
    
    ajaxRequest.send();
 */   
    // set up canvas context for visualizer
  /*  
    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");
    
    var intendedWidth = document.querySelector('.wrapper').clientWidth;
    
    canvas.setAttribute('width',intendedWidth);
    
    var visualSelect = "frequencybars"; //document.getElementById("visual");
    
    var drawVisual;
  */  
    //main block for doing the audio recording
 /*   
    if (navigator.getUserMedia) {
       console.log('getUserMedia supported.');
       navigator.getUserMedia (
          // constraints - only audio needed for this app
          {
             audio: true
          },
    
          // Success callback
          function(stream) {
             source = audioCtx.createMediaStreamSource(stream);
             source.connect(analyser);
             analyser.connect(distortion);
             distortion.connect(biquadFilter);
             biquadFilter.connect(convolver);
             convolver.connect(gainNode);
             gainNode.connect(audioCtx.destination);
    
               visualize();
             voiceChange();
    
          },
    
          // Error callback
          function(err) {
             console.log('The following gUM error occured: ' + err);
          }
       );
    } else {
       console.log('getUserMedia not supported on your browser!');
    }
*/

    //visualize();
/*    
    function visualize() {
      WIDTH = canvas.width;
      HEIGHT = canvas.height;
    
    
      var visualSetting = visualSelect.value;
 
    
      if(visualSetting == "sinewave") {
        analyser.fftSize = 1024;
        var bufferLength = analyser.fftSize;
 
        var dataArray = new Float32Array(bufferLength);
    
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    
        function draw() {
    
          drawVisual = requestAnimationFrame(draw);
    
          analyser.getFloatTimeDomainData(dataArray);
    
          canvasCtx.fillStyle = 'rgb(200, 200, 200)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    
          canvasCtx.beginPath();
    
          var sliceWidth = WIDTH * 1.0 / bufferLength;
          var x = 0;
    
          for(var i = 0; i < bufferLength; i++) {
       
            var v = dataArray[i] * 200.0;
            var y = HEIGHT/2 + v;
    
            if(i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
    
            x += sliceWidth;
          }
    
          canvasCtx.lineTo(canvas.width, canvas.height/2);
          canvasCtx.stroke();
        };
    
        draw();
    
      } else if(visualSetting == "frequencybars") {
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Float32Array(bufferLength);
    
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    
        function draw() {
          drawVisual = requestAnimationFrame(draw);
    
          analyser.getFloatFrequencyData(dataArray);
    
          canvasCtx.fillStyle = 'rgb(0, 0, 0)';
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
          var barWidth = (WIDTH / bufferLength) * 2.5;
          var barHeight;
          var x = 0;
    
          for(var i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] + 140)*2;
            
            canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
    
            x += barWidth + 1;
          }
        };
    
        draw();
    
      } else if(visualSetting == "off") {
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        canvasCtx.fillStyle = "red";
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      }
    
    }
*/    
  /*  
    function voiceChange() {
      distortion.curve = new Float32Array(analyser.fftSize);
      distortion.oversample = '4x';
      biquadFilter.gain.value = 0;
      convolver.buffer = undefined;
    
      var voiceSetting = voiceSelect.value;
      console.log(voiceSetting);
    
      if(voiceSetting == "distortion") {
        distortion.curve = makeDistortionCurve(400);
      } else if(voiceSetting == "convolver") {
        convolver.buffer = concertHallBuffer;
      } else if(voiceSetting == "biquad") {
        biquadFilter.type = "lowshelf";
        biquadFilter.frequency.value = 1000;
        biquadFilter.gain.value = 25;
      } else if(voiceSetting == "off") {
        console.log("Voice settings turned off");
      }
    }
*/
    
    // event listeners to change visualize and voice settings
 /*   
    visualSelect.onchange = function() {
      window.cancelAnimationFrame(drawVisual);
      visualize();
    }

*/

//visualize();

/*********************************************************** */
}



