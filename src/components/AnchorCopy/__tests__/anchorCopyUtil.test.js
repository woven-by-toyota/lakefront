import { generateScrollToUrl } from '../anchorCopyUtil';

describe('generateScrollToUrl', () => {
    it('returns the correct url with hash', () => {
        const result = generateScrollToUrl('here');

        // Verify location ends with hash and the encoded title
        expect(result.split('#')[1]).toBe('here');
    });
});
