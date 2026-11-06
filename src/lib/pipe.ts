type Func = (...args: any[]) => Func | any;

/**
 * Performs left-to-right function composition allow us to run
 * multiple operations on a single set of data.
 */
const pipe =
    (...fns: Func[]) =>
    (x: any) =>
        fns.reduce((y, f) => f(y), x);

export default pipe;
