import Tone from 'tone'
import map from 'p5'

import { midiNoteToTextNoteDict_sharp, midiNoteToTextNoteDict_b } from './utility/midiNoteToTextMapper'
export const main = () => {
    function midiAccessInit() {
        function context() {
            console.log('Started')
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
            console.log(JSON.stringify(access))
            for (var input of access.inputs.values()) {
                input.onmidimessage = getMIDIMessage
            }
            // Get lists of available MIDI controllers
            const inputs = access.inputs.values();
            const outputs = access.outputs.values();

            access.onstatechange = function (e) {
                // Print information about the (dis)connected MIDI controller
                console.log(e.port.name, e.port.manufacturer, e.port.state);
            };
        }).catch(function (err) {
            console.warn(err)
        });
}

function getMIDIMessage(midiMessage) {
    makeSound(midiMessage)
    console.log(midiMessage)

}

//Synths are capable of a wide range of sounds depending on their settings
var synthA = new Tone.Synth({
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
let now 
//mouse events
function makeSound(midiMessage) {
    let soundToMake = convertSound(midiMessage)
    let type = midiMessage.data[0]
    if (type === 144) {
        // console.log(soundToMake)
        now = Tone.now()
        synthA.triggerAttack(soundToMake.sound, "0" ,soundToMake.velocity);
    } else {

        synthA.triggerRelease();
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
    // newVelocity = map(velocity, 0, 127, 0, 1);
    let sound = midiNoteToTextNoteDict_sharp[midiNumber]

    let newVelocity = (velocity / 127)
    newVelocity = Number.parseFloat(velocity).toFixed(2) / 100
    console.log(`
    
    Velocity ${newVelocity}
    Sound ${sound}
    Now ${now}
    `)
    return { sound, velocity: newVelocity }
}

//https://tonejs.github.io/Midi/