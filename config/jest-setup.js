import '@testing-library/jest-dom';
import { matchers } from '@emotion/jest';

// Add the custom matchers provided by '@emotion/jest'
expect.extend(matchers);

global.ResizeObserver = class ResizeObserver {
  observe() {
    return null;
  }

  disconnect() {
  }
};

// Add TextEncoder and TextDecoder for React Router 7 compatibility
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}
