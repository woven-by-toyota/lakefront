export const formatBytes = (bytes: number | undefined, decimals = 2) => {
    if (bytes === 0 || bytes === undefined) return { value: 0, size: 'B' };

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    let i = Math.floor(Math.log(bytes) / Math.log(k));

    let value = (bytes / k ** i).toFixed(dm);
    let size = sizes[i];

    if (value === k.toFixed(dm)) {
        i = i + 1;

        value = (bytes / k ** i).toFixed(dm);
        size = sizes[i];
    }

    return { value: value, size: size };
};
