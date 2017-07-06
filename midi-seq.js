'use strict';

const playButton = document.querySelector('button');

WebMidi.enable((err) => {
    if (err) {
    console.log("WebMidi could not be enabled.", err);
    } else {
        const output =  WebMidi.getOutputByName('USB Midi Cable MIDI 1');
        playButton.addEventListener('click', (e) =>{
            sequenceHandling(output, start);
        });
    }
});

const playOneNote = function(output) {
    const options = {
        time: 50
    }
    output.playNote('C3', 1);
    output.stopNote('C3', 1, options)
}

const sequenceHandling = function(output) {
    const playLoop = setInterval(playOneNote, 1000/8, output);
}
