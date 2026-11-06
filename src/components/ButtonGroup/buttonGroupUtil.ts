import type { CSSProperties } from 'react';
import type { ButtonConfig } from 'src/components/ButtonGroup/ButtonGroup';
import { HOVER_OFFSET } from 'src/components/ButtonGroup/buttonGroupStyles';

const isFirstButton = (idx: number) => idx === 0;
const isMiddleButton = (idx: number, length: number) => idx > 0 && idx < length - 1;
const isLastButton = (idx: number, length: number) => idx === length - 1;
const isSelected = (id: string, selectedId: string) => id === selectedId;

export const addSelectedStyles = (buttonConfigs: ButtonConfig[], selectedId: string) =>
    buttonConfigs.reduce(
        (acc, curr, idx) => {
            const selectedStyles: CSSProperties = {
                marginLeft: HOVER_OFFSET
            };

            if (isFirstButton(idx) && !isSelected(curr.id, selectedId)) {
                selectedStyles.borderRadius = '4px 0 0 4px';
                selectedStyles.borderRight = 'none';
            }

            if (isMiddleButton(idx, buttonConfigs.length) && !isSelected(curr.id, selectedId)) {
                selectedStyles.borderRadius = 0;
                selectedStyles.borderRight = 'none';
                selectedStyles.borderLeft = 'none';
            }

            if (isLastButton(idx, buttonConfigs.length) && !isSelected(curr.id, selectedId)) {
                selectedStyles.borderRadius = '0 4px 4px 0';
                selectedStyles.borderLeft = 'none';
            }

            acc.push({
                ...curr,
                selectedStyles
            });

            return acc;
        },
        [] as (ButtonConfig & { selectedStyles: CSSProperties })[]
    );
