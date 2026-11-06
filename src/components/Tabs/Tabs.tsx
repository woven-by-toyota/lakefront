import type { ComponentProps, FC } from 'react';
import type { TabDef } from 'src/types/global';
import { TabBar, TabStyle } from './tabStyles';

export interface TabProps {
    /**
     * This is to set the options which has a key and a caption.
     */
    options: TabDef[];
    /**
     * This is to set the selected tab by default.
     */
    value: string;

    /**
     * This is an event which is called whenever a tab is clicked.
     */
    onChange(value: string): void;

    /**
     * This is to set a class on the tab component.
     */
    className?: string;
}

/**
 * The Tab Component is used to render multiple tabs. The onChange event is called whenever the user clicks a different tab.
 * The value will set the selection of the tab by default.
 */
/*
 * The div's onChange is omitted so TabProps' own onChange is the only one. Intersecting the two makes
 * onChange satisfy both a value handler and a DOM event handler at once, which nothing can.
 */
const Tabs: FC<TabProps & Omit<ComponentProps<'div'>, 'onChange'>> = ({
    options,
    value,
    onChange,
    className,
    ...rest
}) => (
    <TabBar
        className={className}
        {...rest}
    >
        {options.map((t) => (
            <TabStyle
                key={t.key}
                isSelected={t.key === value}
                onClick={() => onChange(t.key)}
            >
                {t.caption}
            </TabStyle>
        ))}
    </TabBar>
);

export default Tabs;
