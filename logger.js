module.exports = function () {
    const logMessage = function (message) {
        const time = (new Date()).getTime();

        return `${time}: \`${__filename}\`: ${message}`;
    };

    return {
        error: function (message, ...optionalParams) {
            console.error(logMessage(message), ...optionalParams);
        },
        debug: function (message, ...optionalParams) {
            console.log(logMessage(message), ...optionalParams);
        },
    };
};
