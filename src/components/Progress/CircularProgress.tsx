import { FC, ReactNode, useRef, useEffect } from 'react';
import { useTheme, Theme } from '@emotion/react';
import { arc as d3arc, pie as d3pie } from 'd3-shape';
import { select } from 'd3-selection';
import { CircularProgressStyle, CenterTextStyle } from './circularProgressStyles';
import ThemeErrorFallback from 'src/components/shared/ThemeErrorFallback';

export interface CircularProgressProps {
    /**
     * This is to set the width of the pie chart.
     */
    width: number;
    /**
     * This is to set the text that would appear inside the pie chart.
     */
    text?: ReactNode;
    /**
     * The data that is passed to the Circular Progress Component to render different arcs for each value provided.
     */
    data: {
        label: string;
        value: number;
        tooltip?: boolean;
        key?: string;
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
     * The classes to pass to the circular progress.
     */
    className?: string;
}

interface PieData {
    label: string;
    value: number;
    tooltip?: boolean;
    key?: string;
}

/**
 * Circular Progress Component
 *
 * The Circular Progress component is used to render the arcs depending on the value provided for each label.
 */
const CircularProgress: FC<CircularProgressProps> = ({ width, text, data, theme: colorScheme, className }) => {
    const emotionTheme = useTheme();

    var width = Math.abs(width);
    const svgRef = useRef<SVGSVGElement>(null);
    const htmlRef = useRef<HTMLDivElement>(null);
    const radius = width / 2;
    const circleRadius = radius - 5;

    const drawCircularProgress = () => {
        if (!svgRef.current) {
            return;
        }

        const svg = select(svgRef.current);
        const html = select(htmlRef.current);

        // for tooltips later
        const div: any = html
            .select('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        const g = svg.select('g');
        const radius = width / 2;

        const arc = d3arc().outerRadius(radius).innerRadius(radius - 10).padAngle(0);
        const pie = d3pie<PieData>()
            .sort(null)
            .value((record) => record.value);
        const paths: any = g.selectAll('path').data(pie(data));
        paths
            .enter()
            .append('path')
            .merge(paths)
            // draw the arcs
            .attr('d', arc)
            .attr('fill', (d: any, i: any) => {
                const key = data[i].key || data[i].label;
                return colorScheme[key] ? colorScheme[key].bgColor : 'transparent';
            })
            // have a mouse tooltip effect
            .on('mouseover', function (event: PointerEvent, d: any) {
                if (d.data.tooltip === undefined || d.data.tooltip === true) {
                    div.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    div.html(`${d.data.label}: ${d.value}`)
                        .style('left', `${event.pageX}px`)
                        .style('top', `${event.pageY - 28}px`);
                }
            })
            .on('mouseout', function (d: any) {
                div.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        paths.exit().remove();
    };

    useEffect(() => {
        drawCircularProgress();
    });

    if (!emotionTheme) return <ThemeErrorFallback componentName="CircularProgress" />;

    return (
        <CircularProgressStyle width={width} ref={htmlRef} className={className}>
            <svg width={width} height={width} ref={svgRef}>
                <circle cx={radius} cy={radius} r={circleRadius} fill="transparent" stroke={emotionTheme.borderColors.primary} />
                <g transform={`translate(${width / 2} ,  ${width / 2})`} />
            </svg>
            <CenterTextStyle>{text}</CenterTextStyle>
            <div />
        </CircularProgressStyle>
    );
};

export default CircularProgress;
