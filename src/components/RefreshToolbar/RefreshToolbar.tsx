import { ComponentProps, FC, ReactNode } from 'react';
import {
  ToolbarContainer, LogoLoadingSpinner, RefreshProgressContainer,
  ToolbarAdditionalContent, ButtonContainer, RightSideContainer
} from './refreshToolbarStyles';
import { ReactComponent as RefreshIcon } from './assets/refreshIcon.svg';
import Button from 'src/components/Button/Button';

export interface RefreshToolbarProps {
  /**
   * This is called when the refresh button is clicked.
   */
  handleRefresh(): void;
  /**
   * This is to set the Refresh toolbar class.
   */
  className?: string;
  /**
   * The additional content to display if desired.
   */
  children?: ReactNode;
  /**
   * This is to set to false if you want to apply your own container styling (with className prop or a wrapper)
   */
  standalone?: boolean;
  /**
   * Set this to true if you want to display the loading image.
   */
  isRefreshing?: boolean;
  /**
   * This is to set the last updated text.
   */
  lastUpdated?: string | null;
  /**
   * This is to display the loading image label.
   */
  refreshProgressLabel?: string;
  /**
   * This is to render right side components.
   */
  rightComp?: ReactNode;
  /**
   * This is to set right side text.
   */
  rightSideText?: string;
  /**
   * This is to render a custom refresh button.
   */
  refreshButton?: ReactNode;
}

/**
 * Refresh toolbar component that can be used as an additional header row.
 *
 * Set [standalone] to false if you want to apply your own container styling (with className
 * prop or a wrapper). Set [standalone] to true to add full-width behavior with margins and
 * a bottom border (to function as a standalone header). Defaults to true.
 */
const RefreshToolbar: FC<RefreshToolbarProps & ComponentProps<'div'>> = props => {
  const {
    handleRefresh,
    className,
    children,
    standalone = true,
    lastUpdated = '',
    isRefreshing = false,
    refreshProgressLabel = 'Updating...',
    rightComp,
    rightSideText,
    refreshButton,
    ...rest
  } = props;
  return (
    <ToolbarContainer className={className} standalone={standalone} {...rest}>
      <div>
        {isRefreshing && (
          <RefreshProgressContainer>
            <LogoLoadingSpinner
              animated
              height={24}
              label={refreshProgressLabel}
              labelPosition="RIGHT"
              width={24}
            />
          </RefreshProgressContainer>
        )}
        {!isRefreshing && (
          refreshButton ? refreshButton :
            <Button icon={<RefreshIcon />} onClick={handleRefresh} />
        )}
      </div>
      <ToolbarAdditionalContent>
        <ButtonContainer>{!isRefreshing && children}</ButtonContainer>
        <RightSideContainer>
          {rightComp}
          {lastUpdated && rightSideText}
        </RightSideContainer>
      </ToolbarAdditionalContent>
    </ToolbarContainer>
  );
};

export default RefreshToolbar;
