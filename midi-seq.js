'use strict';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const loopLength = document.querySelector('.loop-length');
const noteContainer = document.querySelector('.note-container');
let interval;
let play = false;
let index = 0;
let tempo = 500;

WebMidi.enable((err) => {
    if (err) {
    console.log("WebMidi could not be enabled.", err);
    } else {
        const output =  WebMidi.getOutputByName('USB Midi Cable MIDI 1');

        loopLength.addEventListener('click', (e) =>{
            noteContainer.innerHTML = '';
            playButton.disabled = false;
            loopLength.disabled = true;
            setUpLoopSteps(loopLength.value);
        });

        playButton.addEventListener('click', (e) => {
            const song_notes = document.querySelectorAll('.note');
            playButton.disabled = true;
            stopButton.disabled = false;
            play = true;
            playLoop(output, song_notes);
        });
        stopButton.addEventListener('click', (e) => {
            play = false;
            playButton.disabled = false;
            stopButton.disabled = true;
            loopLength.disabled = false;
        });
    }
});

const getTempo = function(tempo) {
    const tempoValue = document.querySelector('.tempo');
    return (60000 / tempoValue.value) / 4;
}

const clearNotes = function() {
    noteContainer.innerHtml = '';
}

const setUpLoopSteps = function(length) {
    const notes = ['', 'C2', 'C2#', 'D2', 'D2#', 'E2', 'F2', 'F2#', 'G2', 'G2#', 'A2', 'A2#', 'B2',
                   'C3', 'C3#', 'D3', 'D3#', 'E3', 'F3', 'F3#', 'G3', 'G3#', 'A3', 'A3#', 'B3',
                   'C4', 'C4#', 'D4', 'D4#', 'E4', 'F4', 'F4#', 'G4', 'G4#', 'A4', 'A4#', 'B4'];
    for (let i = 0; i < length; i++) {
        const note = document.createElement('select');
        note.setAttribute('class', 'note ' + i);
        noteContainer.appendChild(note);
        notes.forEach((e) => {
            let n = document.createElement('option');
            n.setAttribute('value', e);
            n.innerText = e;
            note.appendChild(n);
        });
    }
}

const playOneNote = function(output, notes) {
    const options = {
        time: 1000
    }
    if (notes[index % notes.length].value !== '') {
        output.playNote(notes[index % notes.length].value, 1);
        output.stopNote(notes[index % notes.length].value, 1, options);
    }
    index++;
}

const playLoop = function(output, notes){
    clearInterval(interval);
    playOneNote(output, notes);
    if (play) {
        interval = setInterval(playLoop, getTempo(), output, notes);
    }
}
