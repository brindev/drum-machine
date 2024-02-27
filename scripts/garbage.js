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
   
    var soundSource, concertHallBuffer;

  
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