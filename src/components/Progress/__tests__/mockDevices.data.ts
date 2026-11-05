export interface BlockDevice {
    capacity: string;
    space_available: number;
    space_total: number;
    space_used: number;
    device: string;
}

export const mockDeviceData: BlockDevice = {
    space_total: 1374389534720,
    space_used: 1175916642304,
    space_available: 198472892416,
    capacity: '86%',
    device: 'device1'
};
