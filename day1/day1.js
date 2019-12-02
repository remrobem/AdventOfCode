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

let getFuelForFuel = (fuel) => {

    let fuelForFuel = 0;

    let additionalFuel = (fuel) => {
        let addFuel = (Math.floor(fuel / 3) - 2);
        if (addFuel <= 0) {
            return;
        };
        fuelForFuel += addFuel;
        additionalFuel(addFuel);
    }
    
    additionalFuel(fuel);

    return fuelForFuel;

}

let fuel_requirements = MODULES_MASS.reduce((fuel, mass) => {
    let fuelForMass = (Math.floor(mass / 3) - 2);
    let addFuel = getFuelForFuel(fuelForMass);
    return fuel + addFuel + fuelForMass;
}, 0);

console.log(fuel_requirements);