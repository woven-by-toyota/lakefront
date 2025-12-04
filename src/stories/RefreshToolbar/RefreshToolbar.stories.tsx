import { ComponentPropsWithoutRef, useEffect, useState, useRef } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import RefreshToolbarComponent, { RefreshToolbarProps } from 'src/components/RefreshToolbar';
import Button from 'src/components/Button/Button';
import DocBlock from '.storybook/DocBlock';
import { useTheme } from '@emotion/react';

export default {
    title: 'Lakefront/RefreshToolbar',
    component: RefreshToolbarComponent,
    parameters: {
        docs: {
            page: DocBlock
        }
    }
} as Meta;

const BANNER_HEIGHT = 60;

const Template: StoryFn<RefreshToolbarProps & ComponentPropsWithoutRef<'div'>> = (args) => {
    const [count, setCount] = useState(0);
    const [showBanner, setShowBanner] = useState(false);
    const refreshToolbarRef = useRef(null);
    const theme = useTheme();

    const handleRefresh = () => {
        setCount(count => count + 1);
    };
    const resetCount = () => {
        setCount(0);
    }

    useEffect(() => {
        if (refreshToolbarRef.current) {
            setShowBanner(true);
        }

        const timer = setTimeout(() => {
            setShowBanner(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [count]);


    return (
        <div ref={refreshToolbarRef} style={{ width: '100%' }}>
          {showBanner && (
            <div
              style={{
                boxSizing: 'border-box',
                height: BANNER_HEIGHT,
                color: theme.foregrounds.success,
                backgroundColor: theme.backgrounds.primary,
                textAlign: 'center',
                width: '100%',
                border: `1px solid ${theme.foregrounds.success}`,
                borderRadius: 4,
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {count > 0 && `Refresh clicked ${count} times.`}
              {count === 0 && `Refresh counter reset to 0`}
            </div>
          )}
          {showBanner || <div style={{ height: BANNER_HEIGHT + 16 }} />}
            <section style={{ display: 'inline-flex', width: '100%', borderTop: `1px solid ${theme.borderColors.primary}` }}>
                <RefreshToolbarComponent handleRefresh={handleRefresh} className={args.className}
                    standalone={args.standalone} isRefreshing={args.isRefreshing} lastUpdated={args.lastUpdated}
                    refreshProgressLabel={args.refreshProgressLabel}
                    rightComp={args.rightComp} rightSideText={args.rightSideText} refreshButton={args.refreshButton}
                                         style={{ width: '100%' }}
                />
            </section>
          <div>
            <Button color='secondary' onClick={resetCount} style={{ marginTop: 16 }}>Reset</Button>
          </div>
        </div>
    );
};

export const RefreshToolbar = Template.bind({});
RefreshToolbar.args = {
    isRefreshing: false,
    refreshProgressLabel: "Loading...",
    refreshTooltipText: "Refresh LogSync File Details",
    lastUpdated: "11:28:22 AM",
    rightSideText: "Last Updated: 11:28:22 AM EST"
};
