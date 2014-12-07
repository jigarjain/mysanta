function plusOne(val) {
    return parseInt(val) + 1;
}

function renderRadioCheck(val1, val2) {
    if (val1 === val2) {
        return 'checked';
    }

    return '';
}

module.exports = {
    'plusOne' : plusOne,
    'renderRadioCheck': renderRadioCheck
};