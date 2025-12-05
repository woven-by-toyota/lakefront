import React from 'react';
import { renderWithTheme as render } from 'src/lib/testing';
import IconButton from '../IconButton';
import { getIconStyles } from '../iconButtonVariants';
import theme from '../../../styles/theme';

describe('IconButton', () => {
    const ICON_NAME = 'add';
    const TEXT_ID = 'textId';
    const POSITIONS = {
        LEFT: 'left',
        RIGHT: 'right'
    };

    it(`renders the icon and children in the proper order when position is '${POSITIONS.LEFT}'`, () => {
        const { getByText } = render(
            <IconButton icon={ICON_NAME} iconPosition={POSITIONS.LEFT}>
                <div id={TEXT_ID}>{TEXT_ID}</div>
            </IconButton>
        );

        expect(getByText(ICON_NAME)).toBeInTheDocument();
        expect(getByText(TEXT_ID).parentNode.parentNode).toHaveStyle({ flexDirection: 'row' });
    });

    it(`renders the icon and children in the proper order when position is '${POSITIONS.RIGHT}`, () => {
        const { getByText } = render(
            <IconButton icon={ICON_NAME} iconPosition={POSITIONS.RIGHT}>
                <div id={TEXT_ID}>{TEXT_ID}</div>
            </IconButton>
        );

        expect(getByText(ICON_NAME)).toBeInTheDocument();
        expect(getByText(TEXT_ID).parentNode.parentNode).toHaveStyle({ flexDirection: 'row-reverse' });
    });
});

describe('getIconStyles', () => {
    const THEME = theme;

    it('returns the correct styles when alternate is false', () => {
        expect(getIconStyles({ theme: THEME, alternate: false }).primary.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#12121b;}');
        expect(getIconStyles({ theme: THEME, alternate: false }).secondary.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#2c2c351A;span{}svg{}}');
        expect(getIconStyles({ theme: THEME, alternate: false }).destructive.styles).toContain('border:1px solid #ef5042;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#ef5042;span{color:#ef5042;}}');
        expect(getIconStyles({ theme: THEME, alternate: false }).link.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#2c2c351A;}');
    });

    it('returns the correct styles when alternate is true', () => {
        expect(getIconStyles({ theme: THEME, alternate: true }).primary.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#dcdcde;}');
        expect(getIconStyles({ theme: THEME, alternate: true }).secondary.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#ffffff1A;color:#2c2c35;span{color:#2c2c35;}svg{fill:#f6f6f8;}}');
        expect(getIconStyles({ theme: THEME, alternate: true }).destructive.styles).toContain('border:1px solid #ef5042;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#d53628;span{color:#d53628;}}');
        expect(getIconStyles({ theme: THEME, alternate: true }).link.styles).toContain('border:none;min-width:0;height:48px;width:48px;border-radius:100%;:hover{background-color:#ffffff1A;}');
    });
});
