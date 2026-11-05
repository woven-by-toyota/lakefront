import type { FC } from 'react';
import { PreviewBar, UrlPreviewContainer } from './urlPreviewStyles';

interface UrlPreviewProps {
    baseUrl?: string;
    queryParams?: string;
}

const UrlPreview: FC<UrlPreviewProps> = ({ baseUrl = 'https://localhost/repository', queryParams = '' }) => {
    return (
        <UrlPreviewContainer>
            <PreviewBar
                value={`${baseUrl}${queryParams ? '?' : ''}${queryParams}`}
                disabled
                label={'Example of the effects filters can have on the current URL.'}
            />
        </UrlPreviewContainer>
    );
};

export default UrlPreview;
