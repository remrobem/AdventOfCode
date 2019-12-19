// --- Part Two ---
// It's no good - in this configuration, the amplifiers can't generate a large enough output signal 
// to produce the thrust you'll need. The Elves quickly talk you through rewiring the amplifiers into a feedback loop:

//       O-------O  O-------O  O-------O  O-------O  O-------O
// 0 -+->| Amp A |->| Amp B |->| Amp C |->| Amp D |->| Amp E |-.
//    |  O-------O  O-------O  O-------O  O-------O  O-------O |
//    |                                                        |
//    '--------------------------------------------------------+
//                                                             |
//                                                             v
//                                                      (to thrusters)
// Most of the amplifiers are connected as they were before; amplifier A's output is connected to amplifier B's input, and so on. 
// However, the output from amplifier E is now connected into amplifier A's input. 
// This creates the feedback loop: the signal will be sent through the amplifiers many times.

// In feedback loop mode, the amplifiers need totally different phase settings: integers from 5 to 9, again each used exactly once. 
// These settings will cause the Amplifier Controller Software to repeatedly take input and produce output many times before halting. 
// Provide each amplifier its phase setting at its first input instruction; all further input/output instructions are for signals.

// Don't restart the Amplifier Controller Software on any amplifier during this process. 
// Each one should continue receiving and sending signals until it halts.

// All signals sent or received in this process will be between pairs of amplifiers except the very first signal 
// and the very last signal. To start the process, a 0 signal is sent to amplifier A's input exactly once.

// Eventually, the software on the amplifiers will halt after they have processed the final loop. 
// When this happens, the last output signal from amplifier E is sent to the thrusters. Your job is to find the largest output signal that can be sent to the thrusters using the new phase settings and feedback loop arrangement.

// Here are some example programs:

// Max thruster signal 139629729 (from phase setting sequence 9,8,7,6,5):

// 3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
// 27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5
// Max thruster signal 18216 (from phase setting sequence 9,7,8,5,6):

// 3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
// -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
// 53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10
// 
// Try every combination of the new phase settings on the amplifier feedback loop. 
// What is the highest signal that can be sent to the thrusters?

const testDiagnostics = (p_instructions, p_phaseSetting = 1, p_priorAmp = 0, p_intProgramIndex = 0) => {

    let phaseSetting = p_phaseSetting;
    let priorAmp = p_priorAmp;
    let intProgramIndex = p_intProgramIndex;

    const instructions = [...p_instructions];

    for (let index = 0; index < instructions.length;) {
        index = getInstructionDetails(instructions, index, phaseSetting, priorAmp, intProgramIndex);
        phaseSetting = null;
    };

    return outputSignal;
};

const getInstructionDetails = (instructions, index, p_phaseSetting, p_priorAmp, p_intProgramIndex) => {
    let phaseSetting = p_phaseSetting;
    let priorAmp = p_priorAmp;
    let intProgramIndex = p_intProgramIndex;


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
            console.log(`output signal: ${outputSignal}`)
            intPrograms[intProgramIndex] = instructions;
            index += 2;
            index = instructions.length;

            // index = instructions.length;
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
// let commands = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10];
let commands = [3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5];
let maxThrust = 0;

let thrust = 0;
let priorAmp = 0;
let maxSequence = [];
let seqArr = [];
let sum = 0;

// array of initial programs
let intPrograms = [...new Array(5)].map(()=> commands);

for (let l1 = 5; l1 < 10; l1++) {
    for (let l2 = 5; l2 < 10; l2++) {
        for (let l3 = 5; l3 < 10; l3++) {
            for (let l4 = 5; l4 < 10; l4++) {
                for (let l5 = 5; l5 < 10; l5++) {
                    seqArr = [l1, l2, l3, l4, l5];
                    // only process when all array entries are unique
                    testArr = new Set([...seqArr]);
                    if (testArr.size == 5) {
                        // run diagnostics for each signal, summing the thrust returned
                        thrust = seqArr.reduce((sum, phase, index) => {
                            return testDiagnostics(intPrograms[index], phase, sum, index);
                        }, 0)
                        // thrust = seqArr.reduce((sum, phase, index) => {
                        //     return testDiagnostics(intPrograms[index], phase, sum, index);
                        // }, thrust);
                        // thrust = seqArr.reduce((sum, phase, index) => {
                        //     return testDiagnostics(intPrograms[index], phase, sum, index);
                        // }, thrust);
                        // thrust = seqArr.reduce((sum, phase, index) => {
                        //     return testDiagnostics(intPrograms[index], phase, sum, index);
                        // }, thrust);
                        // thrust = seqArr.reduce((sum, phase, index) => {
                        //     return testDiagnostics(intPrograms[index], phase, sum, index);
                        // }, thrust)
                       
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


// seqArr = [9,8,7,6,5];
// // only process when all array entries are unique
// testArr = new Set([...seqArr]);
// if (testArr.size == 5) {
//     // run diagnostics for each signal, summing the thrust returned
//     thrust = seqArr.reduce((sum, phase) => {
//         return testDiagnostics(commands, phase, sum);
//     }, 0)
// console.log(thrust);
//     thrust = seqArr.reduce((sum, phase) => {
//         return testDiagnostics(commands, null, sum);
//     }, thrust);
//     console.log(thrust);

//     thrust = seqArr.reduce((sum, phase) => {
//         return testDiagnostics(commands, null, sum);
//     }, thrust);
//     console.log(thrust);

//     thrust = seqArr.reduce((sum, phase) => {
//         return testDiagnostics(commands, null, sum);
//     }, thrust);
//     console.log(thrust);

//     thrust = seqArr.reduce((sum, phase) => {
//         return testDiagnostics(commands, null, sum);
//     }, thrust);
//     console.log(thrust);


    
//     if (thrust > maxThrust) {
//         maxThrust = thrust;
//         maxSequence = seqArr;
//     }
// }


    console.log(`MaxThrust: ${maxSequence} = ${maxThrust}`)
// console.log(testDiagnostics(commands, 5));