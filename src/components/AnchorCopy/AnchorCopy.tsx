import type { ComponentPropsWithoutRef, FC } from 'react';
import { generateScrollToUrl } from './anchorCopyUtil';
import styled from '@emotion/styled';
import copyClipboard from 'src/lib/util/copy';
import Button from 'src/components/Button/Button';
import { ReactComponent as Link } from './assets/link.svg';


export interface AnchorCopyProps {
    /**
     * The button or inner content to render. This defaults to
     * a link icon button.
     */
    AnchorContent: FC;
    /**
     * The classes to pass to the anchor container.
     */
    className?: string;
    /**
     * A boolean that defines whether the anchor should be disabled.
     */
    disabled?: boolean;
    /**
     * The (non-encoded) hash to be appended to the end of the url.
     */
    hashId?: string;
    /**
     * The action to run on copy success.
     */
    onCopy?: (scrollToUrl: string) => void;
    /**
     * The title to display next to the anchor button or content.
     */
    title: string;
}

const AnchorDiv = styled.div({
    display: 'inline-flex',
    alignItems: 'center',
    button: {
        marginRight: 5
    }
});

/**
 * AnchorCopy Component
 *
 * The AnchorCopy component is meant for creating in page anchor links that
 * can be easily copied on button click. The `hashId` (or `title`
 * if `hashId` is falsy) will be encoded, appended to the current url, and copied
 * to the user's clipboard. `onCopy` can also be provided to perform additional
 * operations on the copied content.
 */
const AnchorCopy: FC<AnchorCopyProps & Omit<ComponentPropsWithoutRef<'div'>, 'onCopy'>> = ({
    AnchorContent,
    className,
    disabled,
    hashId,
    onCopy,
    title,
    ...props
}) => {
    const hash = hashId || title;

    const AnchorContentComponent = AnchorContent ? (
        <AnchorContent />
    ) : (
        <Button className="anchorCopyContent" disabled={disabled} icon={<Link className="anchorLinkIcon" />} />
    );

    return (
        <AnchorDiv
            className={className}
            {...props}
            onClick={
                disabled
                    ? () => null
                    : () => {
                        const success = copyClipboard(generateScrollToUrl(hash));

                        if (onCopy && success) {
                            onCopy(generateScrollToUrl(hash));
                        }
                    }
            }
        >
            {AnchorContentComponent}
            <div className="anchorCopyTitle">{title}</div>
        </AnchorDiv>
    );
};

export default AnchorCopy;
