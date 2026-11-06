import { formatBytes } from '../deviceProgressBarUtil';
import { mockDeviceData } from './mockDevices.data';

describe('formatBytes', () => {
    describe('general test', () => {
        it('checks the used space', () => {
            var used = formatBytes(mockDeviceData.space_used);
            expect(used.value).toBe('1.07');
            expect(used.size).toBe('TB');
        });
        it('checks the available space', () => {
            var available = formatBytes(mockDeviceData.space_available);
            expect(available.value).toBe('184.84');
            expect(available.size).toBe('GB');
        });
        it('checks the total space', () => {
            var total = formatBytes(mockDeviceData.space_total);
            expect(total.value).toBe('1.25');
            expect(total.size).toBe('TB');
        });
        it('checks when 0 is passed', () => {
            var available = formatBytes(0);
            expect(available.value).toBe(0);
            expect(available.size).toBe('B');
        });
        it('checks when undefined is passed', () => {
            var available = formatBytes(undefined);
            expect(available.value).toBe(0);
            expect(available.size).toBe('B');
        });
        it('checks decimal is less than 0', () => {
            expect(formatBytes(mockDeviceData.space_used, -1)).toEqual({ value: '1', size: 'TB' });
        });
    });
});
