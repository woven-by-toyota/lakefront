// codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
const throttled = (delay, fn) => {
    let lastCall = 0;
    return (...args) => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    };
};

export default throttled;
