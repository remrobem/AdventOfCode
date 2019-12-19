let password = (p_range) => {

    let range = p_range.split('-');
    let validPasswordCount = 0;

    for (let number = Number(range[0]); number <= Number(range[1]); number++) {
        validPasswordCount = isValidPassword(number) ? validPasswordCount + 1 : validPasswordCount;
    };

    return validPasswordCount;

    // It is a six-digit number.
    // The value is within the range given in your puzzle input.
    // Two adjacent digits are the same (like 22 in 122345).
    // Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
    // part 2:
    // the two adjacent matching digits are not part of a larger group of matching digits

    // 111111 meets these criteria (double 11, never decreases).
    // 223450 does not meet these criteria (decreasing pair of digits 50).
    // 123789 does not meet these criteria (no double).
    // part 2:
    // 112233 meets these criteria because the digits never decrease and all repeated digits are exactly two digits long.
    // 123444 no longer meets the criteria (the repeated 44 is part of a larger group of 444).
    // 111122 meets the criteria (even though 1 is repeated more than twice, it still contains a double 22).

    function isValidPassword(number) {
        let numberArray = number.toString().split('');
        let hasDuplicateDigit = false;
        let hasDigitIncrease = true;
        let hasNoRepeatingGroups = true;

        // check for duplicate that is not a repeating group
        numberArray.filter((digit, index) => {
            if (index > 0) {
                // if have a duplicate, then no need to check for other duplicate
                if (!hasDuplicateDigit) {
                    if (digit == numberArray[index - 1]) {
                        hasDuplicateDigit = true;
                        // if a repeating group, not a duplicate
                        if (index + 1 < numberArray.length && digit == numberArray[index + 1]) {
                            hasDuplicateDigit = false;
                            hasNoRepeatingGroups = false
                        } else {
                            if (index - 2 >= 0 && digit == numberArray[index - 2]) {
                                hasDuplicateDigit = false;
                                hasNoRepeatingGroups = false
                            }
                        }
                    }
                }
                // number must be equal or greater than prior number
                if (digit < numberArray[index - 1]) {
                    hasDigitIncrease = false;
                }
            }
        })

        // console.log('Number: ', numberArray);
        // console.log('Duplicate: ', hasDuplicateDigit);
        // console.log('Digit Increase: ', hasDigitIncrease);
        // console.log('NoRepeating: ', hasNoRepeatingGroups);
        return hasDuplicateDigit  && hasDigitIncrease  && (hasNoRepeatingGroups  || (!hasNoRepeatingGroups  && hasDuplicateDigit));
    }

}

// console.log('Valid Passwords: ', password('333331 - 333334'));
// console.log('Valid Passwords: ', password('111121 - 111124')); // 1
// console.log('Valid Passwords: ', password('123443 - 123445')); // 1
// console.log('Valid Passwords: ', password('223332 - 223334')); // 2
console.log('Valid Passwords: ', password('245318 - 765747'));
