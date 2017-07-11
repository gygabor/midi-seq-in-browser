'use strict';

const playButton = document.querySelector('.play-button');
const stopButton = document.querySelector('.stop-button');
const loopLength = document.querySelector('.loop-length');
const noteContainer = document.querySelector('.note-container');
const accentContainer = document.querySelector('.accent-container')
let interval;
let play = false;
let index = 0;
let tempo = 500;

WebMidi.enable((err) => {
    if (err) {
    console.log("WebMidi could not be enabled.", err);
    } else {
        const output =  WebMidi.getOutputByName('USB Midi Cable MIDI 1');

        setUpLoopSteps(loopLength.value);
        setUpAccents(loopLength.value);
        loopLength.addEventListener('click', (e) =>{
            noteContainer.innerHTML = '';
            accentContainer.innerHTML = '';
            setUpLoopSteps(loopLength.value);
            setUpAccents(loopLength.value);
        });

        playButton.addEventListener('click', (e) => {
            const song_notes = document.querySelectorAll('.note');
            const accents = document.querySelectorAll('.accent');
            playButton.disabled = true;
            stopButton.disabled = false;
            loopLength.disabled = true;
            play = true;
            playLoop(output, song_notes, accents);
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
        if (i % 4 === 0) {
            note.className += ' beat';
        }
        noteContainer.appendChild(note);
        notes.forEach((e) => {
            let n = document.createElement('option');
            n.setAttribute('value', e);
            n.innerText = e;
            note.appendChild(n);
        });
    }
}

const setUpAccents = function(length) {
    for (let i = 0; i < length; i++) {
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox')
        checkbox.setAttribute('class', 'accent ' + i);
        accentContainer.appendChild(checkbox);
    }
}

const playOneNote = function(output, notes, accents) {
    const options = {
        time: 1000
    }
    let velocity = {
        velocity: 0.5
    }
    if (accents[index % notes.length].checked === true) {
        velocity.velocity = 1;
    }
    if (notes[index % notes.length].value !== '') {
        output.playNote(notes[index % notes.length].value, 1, velocity);
        output.stopNote(notes[index % notes.length].value, 1, options);
    }
    index++;
}

const playLoop = function(output, notes, accents){
    clearInterval(interval);
    playOneNote(output, notes, accents);
    if (play) {
        interval = setInterval(playLoop, getTempo(), output, notes, accents);
    }
}
