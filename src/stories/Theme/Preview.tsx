import type { FC } from 'react';
import lakefrontColors from 'src/styles/lakefrontColors';

export interface PreviewProps { sortBy?: 'color' | 'name' }

/**
 * Lakefront Colors
 *
 * Lakefront Colors are used in the default Lakefront theme, consisting of
 * regular and saturated variants to create the right stylistic combination for your application.
 *
 */
const Preview: FC<PreviewProps> = ({ sortBy = 'name' }) => {
    const colorEntries = Object.entries(lakefrontColors);

    if (sortBy === 'name') {
        colorEntries.sort(([name1, _], [name2, __]) => {
            if (name1 > name2) {
                return 1;
            }
            if (name2 > name1) {
                return -1;
            }
            return 0;
        });
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', rowGap: 4, fontSize: 20 }}>
            {colorEntries.map(([key, hexValue]) => (
                <div key={key} style={{ display: 'flex', flex: 1, justifyContent: 'space-between', border: `1px solid ${lakefrontColors.mercury}` }}>
                    <div style={{ padding: 4, borderRight: `1px solid ${lakefrontColors.mercury}`, flex: 2 }}>{key}</div>
                    <div style={{ flex: 8, backgroundColor: hexValue as string }} />
                </div>
            ))}
        </div>
    );
};

export default Preview;
