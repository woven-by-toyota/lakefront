import styled from '@emotion/styled';
import { ReactComponent as CheckOutlinedIcon } from './assets/checkedOutline.svg';

export const MaskableImageContainer = styled.div<any>(({ heightToWidthRatio, theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: theme?.colors?.dolphin,
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    width: '100%',
    paddingBottom: heightToWidthRatio,
    color: theme.foregrounds.primary
}
));

export const MaskedImage = styled.img<any>(({ imageLoaded, allLoading, showSpinnerOnLoad }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    // intentional height over-adjustment helps contained content to fully fit width bounds for most 16:10 scenarios
    // (e.g. hide small pixel value background that shows because of rounding applied to scaled size)
    height: '100.5%',
    width: '100%',
    ...((!imageLoaded || allLoading) && showSpinnerOnLoad && { visibility: 'hidden' }),
    objectFit: 'contain'
}));

export const DisplayImage = styled.img<any>(({ imageLoaded, allLoading, showSpinnerOnLoad }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    // intentional height over-adjustment helps contained content to fully fit width bounds for most 16:10 scenarios
    // (e.g. hide small pixel value background that shows because of rounding applied to scaled size)
    height: '100.5%',
    width: '100%',
    ...imageLoaded || !allLoading && { visibility: 'hidden' },
    ...imageLoaded && showSpinnerOnLoad && { display: 'none' }
}));

export const LoadingSpinner = styled.div(({ theme }) => ({
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: theme.foregrounds.primary
}));

export const HighlightedImageStyle = styled.div<any>(({ theme, highlighted }) => ({
    ...highlighted && {
        backgroundColor: 'rgba(55, 143, 238,0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        color: theme.foregrounds.primary
    },
    ...!highlighted && { display: 'none' }
}));

export const CheckOutlinedIconStyle = styled(CheckOutlinedIcon)<any>(({ selectable, selected,
    hovered, individuallySelected, theme }) => ({
        ...selectable && {
            position: 'absolute',
            bottom: '15px',
            right: '15px',
            fill: theme.borderColors.primary,
            borderRadius: '50%'
        },
        ...((!selectable || (!selected && (!hovered && !individuallySelected))) && { display: 'none' }),
        ...(selectable && (selected || individuallySelected) && {
            background: theme.foregrounds.success,
            border: '1px solid', borderColor: theme.borderColors.primary
        })
    })
)
