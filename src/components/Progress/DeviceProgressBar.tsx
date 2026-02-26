import { FC } from 'react';
import {
    ProgressBarContainer,
    TopText,
    CenterText,
    RightText,
    ProgressBar,
    Filler,
    BottomText,
    Threshold as ThresholdDiv
} from './deviceProgressBarStyles';
import { ThemeProvider } from '@emotion/react';
import { formatBytes } from './deviceProgressBarUtil';
import customTheme from 'src/styles/theme';

export interface DeviceProgressBarThreshold {
    /**
     * The unique id of the threshold.
     */
    id: string;
    /**
     * The percentage at which the threshold exists.
     * This should be a string percentage (e.g. 10%) to accurately
     * generate the width of the progress (via css).
     */
    percentage: string;
    /**
     * The color of the threshold. This defaults to `lakefrontColors.red` if left undefined.
     */
    color?: string;
}

export interface DeviceProgressProps {
    /**
     * This is to set the used space of the device. The type should be a number.
     */
    used: number;
    /**
     * This is to set the available space of the device. The type should be a number.
     */
    available: number;
    /**
     * This is to set the total space of the device. The type should be a number.
     */
    total: number;
    /**
     * This is to set the capacity for the device progress bar.
     * This should be a string percentage (e.g. 10%) to accurately
     * generate the width of the progress (via css).
     */
    capacity: string;
    /**
     * This is the text to display after the capacity. By default, this value is empty.
     */
    capacitySubText?: string;
    /**
     * This is the location, respective to the progress bar, in which to display the capacity text.
     * The default is "inside" the progress bar.
     */
    capacityLocation?: 'below' | 'inside';
    /**
     * This is to set the background color of the  progress bar.
     */
    backgroundColor?: string;
    /**
     * These are the classes to apply to the component.
     */
    className?: string;
    /**
     * These are optional thresholds to set on the progress bar.
     */
    thresholds?: DeviceProgressBarThreshold[];
}


/**
 * Device Progress Component
 *
 * The Device Progress Component displays the used space, available space and the total space of the device in the
 * form of a bar. It also displays the percentage of the device that is full.
 *
 */
const DeviceProgressBar: FC<DeviceProgressProps> = ({
                                                        used,
                                                        available,
                                                        total,
                                                        capacity,
                                                        backgroundColor = customTheme?.colors.saturatedTeal,
                                                        capacitySubText = '',
                                                        capacityLocation = 'inside',
                                                        className,
                                                        thresholds = []
                                                    }) => {
    const formattedUsed = formatBytes(used);
    const formattedAvailable = formatBytes(available);
    const formattedTotal = formatBytes(total);

    const usedResult = `${formattedUsed.value} ${formattedUsed.size}`;
    const availableResult = `${formattedAvailable.value} ${formattedAvailable.size}`;
    const totalResult = `${formattedTotal.value} ${formattedTotal.size}`;

    const subTextWithSpace = capacitySubText ? ` ${capacitySubText}` : '';
    const capacityText = `${capacity}${subTextWithSpace}`;

    return (
            <ProgressBarContainer className={className}>
                <>
                    <TopText className='progress-bar-top-text'>
                        <span>Used: {usedResult}</span>
                        <CenterText>Available: {availableResult}</CenterText>
                        <RightText>Total: {totalResult}</RightText>
                    </TopText>
                    <ProgressBar className='progress-bar'>
                        {thresholds.map(({ id, percentage, color }) => (
                            <ThresholdDiv
                                key={id}
                                id={`threshold-${id}`}
                                className='progress-bar-threshold'
                                percentage={percentage}
                                color={color}
                            />
                        ))}
                        <Filler width={capacity} backgroundColor={backgroundColor} className='progress-bar-fill'>
                            {capacityLocation === 'inside' && <span>{capacityText}</span>}
                        </Filler>
                    </ProgressBar>
                    {capacityLocation === 'below' && (
                        <BottomText className='progress-bar-bottom-text'>
                            <span>{capacityText}</span>
                        </BottomText>
                    )}
                </>
            </ProgressBarContainer>
    );
};

export default DeviceProgressBar;
