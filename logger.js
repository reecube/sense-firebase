module.exports = function () {
    return {
        debug: function (message, ...optionalParams) {
            const time = (new Date()).getTime();
            console.log(`${time}: \`${__filename}\`: ${message}`, ...optionalParams);
        },
    };
};
