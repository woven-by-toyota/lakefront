import { ProgressStyle, ProgressSpan } from './progressBarStyles';

export interface ProgressBarProps {
    /** 
     * This is to set the total of the progress bar. 
     */
    total: number;
    /** 
     * This is to set the width of the progress bar. 
     */
    width: number;
    /**
     * The data that is passed to the Progress Bar Component to render the bar width of each label depending on the value.
     */
    data: {
        label: string;
        value: number;
    }[];
    /**
     * This is to render the background color for each label that is being passed.
     */
    theme: {
        [key: string]: {
            bgColor: string;
            fgColor: string;
        };
    };
    /**
     * The classes to pass to the progress bar.
     */
    className?: string;
}

/**
 * Progress Bar Component
 * 
 * The Progress Bar Component is used to render the bar. The bar displays each section in a given color and the width
 * of each section is calculated according to the value provide.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ data, theme, total, width, className }) => {

    let leftPosition = 0;

    return (
        <ProgressStyle width={width} className={className}>
            {data.map(({ label, value }) => {
                if (label === 'pending' || value === 0) {
                    return null;
                }

                // compute the width of the bar, and increment the left position
                const barWidth = total > 0 ? (value / total) * width : 0;
                leftPosition += barWidth;
                const color = theme[label] ? theme[label].bgColor : '#e1e1e8';

                return (
                    <ProgressSpan
                        key={label}
                        title={`${label}: ${value}`}
                        left={leftPosition - barWidth}
                        backgroundColor={color}
                        width={barWidth}
                    />
                );
            })}
        </ProgressStyle>
    );
};

export default ProgressBar;
