// --- Day 7: Amplification Circuit ---
// Based on the navigational maps, you're going to need to send more power to your ship's thrusters to reach Santa in time. To do this, you'll need to configure a series of amplifiers already installed on the ship.

// There are five amplifiers connected in series; each one receives an input signal and produces an output signal. They are connected such that the first amplifier's output leads to the second amplifier's input, the second amplifier's output leads to the third amplifier's input, and so on. The first amplifier's input value is 0, and the last amplifier's output leads to your ship's thrusters.

//     O-------O  O-------O  O-------O  O-------O  O-------O
// 0 ->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-> (to thrusters)
//     O-------O  O-------O  O-------O  O-------O  O-------O
// The Elves have sent you some Amplifier Controller Software (your puzzle input), a program that should run on your existing Intcode computer. Each amplifier will need to run a copy of the program.

// When a copy of the program starts running on an amplifier, it will first use an input instruction to ask the amplifier for its current phase setting (an integer from 0 to 4). Each phase setting is used exactly once, but the Elves can't remember which amplifier needs which phase setting.

// The program will then call another input instruction to get the amplifier's input signal, compute the correct output signal, and supply it back to the amplifier with an output instruction. (If the amplifier has not yet received an input signal, it waits until one arrives.)

// Your job is to find the largest output signal that can be sent to the thrusters by trying every possible combination of phase settings on the amplifiers. Make sure that memory is not shared or reused between copies of the program.

// For example, suppose you want to try the phase setting sequence 3,1,2,4,0, which would mean setting amplifier A to phase setting 3, amplifier B to setting 1, C to 2, D to 4, and E to 0. Then, you could determine the output signal that gets sent from amplifier E to the thrusters with the following steps:

// Start the copy of the amplifier controller software that will run on amplifier A. At its first input instruction, provide it the amplifier's phase setting, 3. At its second input instruction, provide it the input signal, 0. After some calculations, it will use an output instruction to indicate the amplifier's output signal.
// Start the software for amplifier B. Provide it the phase setting (1) and then whatever output signal was produced from amplifier A. It will then produce a new output signal destined for amplifier C.
// Start the software for amplifier C, provide the phase setting (2) and the value from amplifier B, then collect its output signal.
// Run amplifier D's software, provide the phase setting (4) and input value, and collect its output signal.
// Run amplifier E's software, provide the phase setting (0) and input value, and collect its output signal.
// The final output signal from amplifier E would be sent to the thrusters. However, this phase setting sequence may not have been the best one; another sequence might have sent a higher signal to the thrusters.

// Here are some example programs:

// Max thruster signal 43210 (from phase setting sequence 4,3,2,1,0):

// 3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0
// Max thruster signal 54321 (from phase setting sequence 0,1,2,3,4):

// 3,23,3,24,1002,24,10,24,1002,23,-1,23,
// 101,5,23,23,1,24,23,23,4,23,99,0,0
// Max thruster signal 65210 (from phase setting sequence 1,0,4,3,2):

// 3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
// 1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0
// Try every combination of phase settings on the amplifiers. What is the highest signal that can be sent to the thrusters?

// Your puzzle answer was 43812. for entry 0,2,1,4,3

const testDiagnostics = (p_instructions, p_phaseSetting = 1, p_priorAmp = 0) => {

    let phaseSetting = p_phaseSetting;
    let priorAmp = p_priorAmp;

    const instructions = [...p_instructions];

    for (let index = 0; index < instructions.length;) {
        index = getInstructionDetails(instructions, index, phaseSetting, priorAmp);
        phaseSetting = null;
    };

    return outputSignal;
};

const getInstructionDetails = (instructions, index, p_phaseSetting, p_priorAmp) => {
    let phaseSetting = p_phaseSetting;
    let priorAmp = p_priorAmp;

    let parameter1Mode = parameter2Mode = parameter3Mode = 0;

    // get current operation code from instruction
    switch (instructions[index].toString().length) {
        case 1:
            opcode = instructions[index];
            break;
        // 99 is only 2-digit operation
        case 2:
            opcode = Number(instructions[index].toString().slice(0));
            break;
        case 3:
            opcode = Number(instructions[index].toString().slice(1));
            parameter1Mode = Number(instructions[index].toString().slice(0, 1));
            break;
        case 4:
            opcode = Number(instructions[index].toString().slice(2));
            parameter1Mode = Number(instructions[index].toString().slice(1, 2));
            parameter2Mode = Number(instructions[index].toString().slice(0, 1));
            break;
        default:
            console.log('invalid op code - length error: ', instructions[index])
            throw new Error('invalid Op Code - length error');
            break;
    }

    // set operands based on location(0) or immediate(1) mode
    switch (parameter1Mode) {
        case 0:
            operand1 = instructions[instructions[index + 1]]
            break;
        case 1:
            operand1 = instructions[index + 1]
            break;
        default:
            console.log('invalid parameter 1: ', instructions[index])
            throw new Error('invalid parameter 1');
            break;
    }

    switch (parameter2Mode) {
        case 0:
            operand2 = instructions[instructions[index + 2]]
            break;
        case 1:
            operand2 = instructions[index + 2]
            break;
        default:
            console.log('invalid parameter 2: ', instructions[index])
            throw new Error('invalid parameter 2');
            break;
    };

    // execute the operation code
    switch (opcode) {
        // addition
        case 1:
            instructions[instructions[index + 3]] = operand1 + operand2;
            index += 4;
            break;
        // multiplication
        case 2:
            instructions[instructions[index + 3]] = operand1 * operand2;
            index += 4;
            break;
        // set p_phaseSetting value - should be provided as 1st instruction in the program
        case 3:
            instructions[instructions[index + 1]] = phaseSetting != null ? phaseSetting : priorAmp;
            // console.log(`Phase Setting: ${phaseSetting} Prior Amp: ${priorAmp} Instruction: ${instructions[instructions[index + 1]]}`)
            index += 2;
            break;
        // display a value
        case 4:
            // console.log('Operation 4: ', instructions[instructions[index + 1]]);
            outputSignal = instructions[instructions[index + 1]];
            index += 2;
            break;
        // jump-if-true
        case 5:
            index = operand1 != 0 ? operand2 : index + 3;
            break;
        // jump-if-false
        case 6:
            index = operand1 == 0 ? operand2 : index + 3;
            break;
        // less than
        case 7:
            instructions[instructions[index + 3]] = operand1 < operand2 ? 1 : 0;
            index += 4;
            break;
        // equal to
        case 8:
            instructions[instructions[index + 3]] = operand1 == operand2 ? 1 : 0;
            index += 4;
            break;
        // stop program
        case 99:
            index = instructions.length;
            break;
        //    
        default:
            console.log('invalid operation code - value error: ', instructions[index])
            throw new Error('invalid parameter 2 - value error');
            break;
    }

    return index;
};


// let outputSignal = 0;

let commands = [3,8,1001,8,10,8,105,1,0,0,21,30,55,80,101,118,199,280,361,442,99999,3,9,101,4,9,9,4,9,99,3,9,101,4,9,9,1002,9,4,9,101,4,9,9,1002,9,5,9,1001,9,2,9,4,9,99,3,9,101,5,9,9,1002,9,2,9,101,3,9,9,102,4,9,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,101,5,9,9,102,3,9,9,101,3,9,9,4,9,99,3,9,1001,9,2,9,102,4,9,9,1001,9,3,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,99];
let maxThrust = 0;

let thrust = 0;
let priorAmp = 0;
let maxSequence = [];
let seqArr = [];

for (let l1 = 0; l1 < 5; l1++) {
    for (let l2 = 0; l2 < 5; l2++) {
        for (let l3 = 0; l3 < 5; l3++) {
            for (let l4 = 0; l4 < 5; l4++) {
                for (let l5 = 0; l5 < 5; l5++) {
                    seqArr = [l1, l2, l3, l4, l5];
                    // only process when all array entries are unique
                    testArr = new Set([...seqArr]);
                    if (testArr.size == 5) {
                        thrust = seqArr.reduce((sum, phase) => {
                            return testDiagnostics(commands, phase, sum);
                        }, 0)
                        if (thrust > maxThrust) {
                            maxThrust = thrust;
                            maxSequence = seqArr;
                        }
                    }
                }
            }
        }
    }
}

console.log(`MaxThrust: ${maxSequence} = ${maxThrust}`)
// console.log(testDiagnostics(commands, 5));