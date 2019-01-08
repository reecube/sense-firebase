const output = {
    colors: {
        black: [0, 0, 0],
        red: [255, 0, 0],
        green: [0, 255, 0],
        blue: [0, 0, 255],
    },
};

const defaultValue = function (value, defValue) {
    return value ? value : defValue;
};

output.cross = function (foreground, background) {
    const X = defaultValue(foreground, output.colors.red);
    const O = defaultValue(background, output.colors.black);

    return [
        X, O, O, O, O, O, O, X,
        O, X, O, O, O, O, X, O,
        O, O, X, O, O, X, O, O,
        O, O, O, X, X, O, O, O,
        O, O, O, X, X, O, O, O,
        O, O, X, O, O, X, O, O,
        O, X, O, O, O, O, X, O,
        X, O, O, O, O, O, O, X,
    ];
};

output.square = function (foreground, background) {
    const X = defaultValue(foreground, output.colors.green);
    const O = defaultValue(background, output.colors.black);

    return [
        X, X, X, X, X, X, X, X,
        X, O, O, O, O, O, O, X,
        X, O, O, O, O, O, O, X,
        X, O, O, O, O, O, O, X,
        X, O, O, O, O, O, O, X,
        X, O, O, O, O, O, O, X,
        X, O, O, O, O, O, O, X,
        X, X, X, X, X, X, X, X,
    ];
};

module.exports = output;
