import copy from '../copy';

const originalClipboard = { ...global.navigator.clipboard };

afterEach(() => {
  global.navigator.clipboard = originalClipboard;
});

describe('copy', () => {
  it('copies the provided text to the clipboard', () => {
    const writeText = jest.fn();

    global.navigator.clipboard = {
      writeText
    };

    copy('text');

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith('text');
  });

  it('returns true on successful copy', () => {
    global.navigator.clipboard = {
      writeText: () => null
    };

    copy('text');

    expect(copy('text')).toBe(true);
  });

  it('returns false on failed copy', () => {
    global.navigator.clipboard = {
      writeText: () => {
        throw new Error('error');
      }
    };

    copy('text');

    expect(copy('text')).toBe(false);
  });
});
