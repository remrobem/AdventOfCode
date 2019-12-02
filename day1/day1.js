"use strict";
// Fuel required to launch a given module is based on its mass. 
// Specifically, to find the fuel required for a module:
//  take its mass, divide by three, round down, and subtract 2.

// For example:

// For a mass of 12, divide by 3 and round down to get 4, then subtract 2 to get 2.
// For a mass of 14, dividing by 3 and rounding down still yields 4, so the fuel required is also 2.
// For a mass of 1969, the fuel required is 654.
// For a mass of 100756, the fuel required is 33583.
// The Fuel Counter-Upper needs to know the total fuel requirement. 
// To find it, individually calculate the fuel needed for the mass of each module (your puzzle input), then add together all the fuel values.

// What is the sum of the fuel requirements for all of the modules on your spacecraft?
// answer: 3297896

// --- Part Two ---
// During the second Go / No Go poll, the Elf in charge of the Rocket Equation Double-Checker stops the launch sequence. 
// Apparently, you forgot to include additional fuel for the fuel you just added.

// Fuel itself requires fuel just like a module - take its mass, divide by three, round down, and subtract 2. 
// However, that fuel also requires fuel, and that fuel requires fuel, and so on. Any mass that would require negative fuel should instead be treated as if it requires zero fuel; the remaining mass, if any, is instead handled by wishing really hard, which has no mass and is outside the scope of this calculation.

// So, for each module mass, calculate its fuel and add it to the total. 
// Then, treat the fuel amount you just calculated as the input mass and repeat the process, continuing until a fuel requirement is zero or negative. For example:

// A module of mass 14 requires 2 fuel. 
// This fuel requires no further fuel (2 divided by 3 and rounded down is 0, which would call for a negative fuel), 
// so the total fuel required is still just 2.

// At first, a module of mass 1969 requires 654 fuel. 
// Then, this fuel requires 216 more fuel (654 / 3 - 2). 
// 216 then requires 70 more fuel, which requires 21 fuel, which requires 5 fuel, which requires no further fuel. 
// So, the total fuel required for a module of mass 1969 is 654 + 216 + 70 + 21 + 5 = 966.

// The fuel required by a module of mass 100756 and its fuel is: 
// 33583 + 11192 + 3728 + 1240 + 411 + 135 + 43 + 12 + 2 = 50346.

// What is the sum of the fuel requirements for all of the modules on your spacecraft 
// when also taking into account the mass of the added fuel? 
// (Calculate the fuel requirements for each module separately, then add them all up at the end.)
// answer: 4943969

// const MODULES_MASS = [
// 1969, 100756
// ];

const MODULES_MASS = [
    144475,
    145308,
    100615,
    56900,
    128773,
    65519,
    74165,
    99081,
    141047,
    149128,
    148282,
    109528,
    55909,
    70885,
    115049,
    149631,
    52276,
    101944,
    113005,
    102876,
    64365,
    71178,
    122767,
    86272,
    139199,
    78631,
    71958,
    81288,
    70401,
    77582,
    118275,
    115648,
    91350,
    121735,
    130339,
    55146,
    137351,
    101940,
    112657,
    133288,
    81503,
    136812,
    67015,
    142573,
    125537,
    99231,
    61693,
    85719,
    80659,
    148431,
    101176,
    77853,
    108201,
    138945,
    81804,
    55795,
    141837,
    113490,
    57932,
    81023,
    76756,
    79023,
    73527,
    75874,
    63332,
    62055,
    76124,
    54254,
    68482,
    141113,
    84335,
    58747,
    84723,
    137564,
    132605,
    94970,
    50312,
    89127,
    143858,
    124587,
    52272,
    138039,
    53782,
    93085,
    83456,
    94432,
    121481,
    93700,
    114222,
    117849,
    147460,
    110324,
    75337,
    130464,
    88805,
    109489,
    71109,
    95625,
    115832,
    123252
];

// 
let getFuelForFuel = (fuel) => {

    let fuelForFuel = 0;

    let additionalFuel = (fuel) => {
        const addFuel = (Math.floor(fuel / 3) - 2);
        if (addFuel <= 0) {
            return;
        };
        fuelForFuel += addFuel;
        additionalFuel(addFuel);
    };

    additionalFuel(fuel);
    return fuelForFuel;
}

let fuelRequirements = MODULES_MASS.reduce((fuel, mass) => {
    const fuelForMass = (Math.floor(mass / 3) - 2);
    const fuelForFuel = getFuelForFuel(fuelForMass);
    return fuel + fuelForFuel + fuelForMass;
}, 0);

console.log(fuelRequirements);