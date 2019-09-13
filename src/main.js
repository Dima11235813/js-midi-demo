import { midiNoteToTextNoteDict_sharp, midiNoteToTextNoteDict_b } from './utility/midiNoteToTextMapper'
import Tone from 'tone'
import map from 'p5'

const log = true

const logToConsole = (message) => {
    if(log){
        console.log(message)
    }
}

export const main = () => {
    function midiAccessInit() {
        function context() {
            logToConsole('Started')
            execContext(this)
        }
        context()
    }
    midiAccessInit()
}

const execContext = (_this) => {
    _this = {}
    navigator.requestMIDIAccess()
        .then(function (access) {
            logToConsole(JSON.stringify(access))
            for (var input of access.inputs.values()) {
                input.onmidimessage = getMIDIMessage
            }
            // Get lists of available MIDI controllers
            const inputs = access.inputs.values();
            const outputs = access.outputs.values();

            access.onstatechange = function (e) {
                // Print information about the (dis)connected MIDI controller
                logToConsole(e.port.name, e.port.manufacturer, e.port.state)
            };
        }).catch(function (err) {
            console.warn(err)
        });
}

function getMIDIMessage(midiMessage) {
    makeSound(midiMessage)
    logToConsole(midiMessage)

}

//Synths are capable of a wide range of sounds depending on their settings
var synthA = new Tone.PolySynth ({
    // oscillator: {
    //     type: 'fmsquare',
    //     modulationType: 'sawtooth',
    //     modulationIndex: 3,
    //     harmonicity: 3.4
    // },
    // envelope: {
    //     attack: 0.001,
    //     decay: 0.1,
    //     sustain: 0.1,
    //     release: 0.1
    // }
}).toMaster()

// var synthB = new Tone.Synth({
//     oscillator: {
//         type: 'triangle8'
//     },
//     envelope: {
//         attack: 2,
//         decay: 1,
//         sustain: 0.4,
//         release: 4
//     }
// }).toMaster()
//mouse events
let notesToPlay = []
function makeSound(midiMessage) {
    let soundToMake = convertSound(midiMessage)
    let type = midiMessage.data[0]
    if (type === 144) {
        // logToConsole(soundToMake)
        notesToPlay.push(soundToMake.sound)
        synthA.triggerAttack(notesToPlay, undefined, soundToMake.velocity);
    } else {
        notesToPlay = notesToPlay.filter(note => note !== soundToMake.sound)
        synthA.triggerRelease(soundToMake.sound);
    }
    // synthA.triggerAttack(soundToMake)
    // setTimeout(() => {
    //     synthA.triggerRelease()
    // }, 1000);
}
const convertSound = (midiMessage) => {
    let velocity = midiMessage.data[2]
    let midiNumber = midiMessage.data[1]
    // debugger
    // let newVelocity = map(velocity, 0, 127, 0, 1);
    let sound = midiNoteToTextNoteDict_sharp[midiNumber]
    
    let newVelocity = velocity / 127
    // logToConsole(newVelocity)
    logToConsole(`Divided ${newVelocity}`)

    newVelocity = Number.parseFloat(velocity)
    logToConsole(`Parsed ${newVelocity}`)
    newVelocity = newVelocity.toFixed(0)
    newVelocity = newVelocity / 100
    logToConsole(`Parsed ${newVelocity}`)
    logToConsole(`
    Original Velocity ${velocity}
    Velocity ${newVelocity}
    Sound ${sound}
    `)
    return { sound, velocity: newVelocity }
}

//https://tonejs.github.io/Midi/