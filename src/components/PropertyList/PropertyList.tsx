import React, { ReactNode } from 'react';
import { AttributeGrid, AttributeList, Caption, Content } from './propertyListStyles';
import { ThemeProvider } from '@emotion/react';
import theme from 'src/styles/theme';

export interface Property {
    /** This is to set the caption for the PropertyList */
    caption: string;
    /** This is to set the caption style that needs to be added to the caption */
    captionStyles?: string | null;
    /** This is to set the content for the corresponding caption */
    content: (data: any) => ReactNode;
    /** This is to set the style for the content associated to the caption */
    contentStyles?: string | null;
}

interface BaseProps {
    /** This is to set the list of the property- caption, captionStyle, content and contentStyles */
    attributes: Property[];
    /** This is to set the external class on the Property List. */
    className?: string;
    /** This is to set the data for the content defined in the Property */
    data: any;
}

export interface PropertyListProps extends BaseProps {
    /** This is to set the caption width. Set variant as 'variable' to render the caption according to the size of the caption.
     *  The default is set to Fixed. */
    variant: string;
}

/** The PropertyList Component is used to display the list of captions and their corresponding data. The default behavior of the caption is fixed but you can choose to
 *  set the variant='Variable'. The custom styles can be applied to the caption and the corresponding content.
 *  For more information please check the implementations below.
 */
const PropertyList: React.FC<PropertyListProps> = (props) => {
    const { attributes, data, variant } = props;

    if (variant && variant === 'variable') {
        return <PropertyListVariable {...props} />;
    }

    return (
            <AttributeGrid>
                {attributes.map(a => (
                    <React.Fragment key={a.caption}>
                        <Caption className={a.captionStyles}>{a.caption}</Caption>
                        <Content className={a.contentStyles}>{a.content(data)}</Content>
                    </React.Fragment>
                ))}
            </AttributeGrid>
    );
};

export default PropertyList;

export const PropertyListVariable: React.FC<BaseProps> = props => {
    const { attributes, data, className } = props;

    return (
            <AttributeList className={className}>
                {attributes.map(a => (
                    <div key={a.caption}>
                        <Caption className={a.captionStyles}>{a.caption}</Caption>
                        <Content className={a.contentStyles}>{a.content(data)}</Content>
                    </div>
                ))}
            </AttributeList>
    );
};
