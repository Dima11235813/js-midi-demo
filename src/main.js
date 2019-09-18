import { midiNoteToTextNoteDict_sharp } from './utility/midiNoteToTextMapper'
import Tone from 'tone'
// import map from 'p5'
// import { MidiClipRecorder } from './utility/midiRecorder';
// import { ToneOptionsFactory } from './utility/toneOptionsFactory';


const log = true

const logToConsole = (message) => {
    if (log) {
        console.log(message)
    }
}

export const main = () => {
    navigator.requestMIDIAccess()
        .then(function (access) {
            for (var input of access.inputs.values()) {
                input.onmidimessage = getMIDIMessage
            }
        }).catch(function (err) {
            console.warn(err)
        });
}

const execContext = (_this) => {
}

function getMIDIMessage(midiMessage) {

    // recordSound()
    makeSound(midiMessage)
    logToConsole(midiMessage)

}


// let toneOptonsFactory = new ToneOptionsFactory()
// console.log(toneOptonsFactory.getSynthOptions())
var synthA = new Tone.PolySynth(12).toMaster()
// toneVolume.chain(synthA, Tone.Master);


const masterVolumeType = 176

function makeSound(midiMessage) {
    let soundToMake = convertSound(midiMessage)
    let value = midiMessage.data[0]
    let velocity = midiMessage.data[2]
    let midiNumber = midiMessage.data[1]
    // console.log(synthA.volume.value)

    if (value === 144) {

        synthA.triggerAttack(soundToMake.sound, undefined, soundToMake.velocity);
    } else if (masterVolumeType && midiNumber === 7) {
        // console.log(`Current volumne is ${synthA.volume.value}`)
        // let volumeToSet = velocity *2 //too distorted
        synthA.volume.value = velocity
        // console.log(`Updated volumne is ${synthA.volume.value}`)
        // console.log(`
        //     Set volumne to
        //     Type ${midiMessage.data[0]}
        //     Value ${midiMessage.data[1]}
        //     Velocity ${midiMessage.data[2]}
        //     ${velocity}
        //     `)
    }
    else {
        synthA.triggerRelease(soundToMake.sound);
    }



}
const convertSound = (midiMessage) => ({
    sound: midiNoteToTextNoteDict_sharp[midiMessage.data[1]],
    velocity: Number.parseFloat(midiMessage.data[2] / 126).toFixed(0) / 100
})


//https://tonejs.github.io/Midi/