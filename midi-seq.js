'use strict';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');

WebMidi.enable((err) => {
    if (err) {
    console.log("WebMidi could not be enabled.", err);
    } else {
        const output =  WebMidi.getOutputByName('USB Midi Cable MIDI 1');
        let playLoop;

        playButton.addEventListener('click', (e) => {
            playButton.disabled = true;
            stopButton.disabled = false;
            playLoop = setInterval(playOneNote, 1000/8, output);
        });
        stopButton.addEventListener('click', (e) => {
            playButton.disabled = false;
            stopButton.disabled = true;
            clearInterval(playLoop);
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
