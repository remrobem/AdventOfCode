let password = (p_range) => {
    let range = p_range.split('-');
    let validPasswordCount = 0;

    for (let number = Number(range[0]); number <= Number(range[1]); number++) {
        validPasswordCount = isValidPassword(number) ? validPasswordCount++ : validPasswordCount;
    };

    console.log('Valid Passwords: ', validPasswordCount);
    // It is a six-digit number.
    // The value is within the range given in your puzzle input.
    // Two adjacent digits are the same (like 22 in 122345).
    // Going from left to right, the digits never decrease; they only ever increase or stay the same (like 111123 or 135679).
    function isValidPassword(number) {
        let numberArray = number.split('');
        let hasDuplicateDigit = false;
        let hasDigitIncrease = true;

        // check for duplicate
        numberArray.filter((digit, index) => {
            if (index > 0) {
                if (digit == numberArray[index - 1]) {
                    hasDuplicateDigit = true;
                }
                if (digit < numberArray[index - 1]) {
                    hasDigitIncrease = false;
                }
            }
        })
        return hasDuplicateDigit && hasDigitIncrease && digit.length == 6;
    }

}

console.log(password('245318 - 765747'))