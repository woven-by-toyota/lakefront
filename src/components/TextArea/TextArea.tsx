import { ComponentPropsWithRef, FC, forwardRef } from 'react';
import { StyledTextArea, StyledLabel } from './textAreaStyles';

export interface TextAreaProps {
    /**
     * This shows a label above the TextArea when provided.
     */
    label?: string;
    /**
     * If not empty, the TextArea component will be displayed in an error state with the provided error message.
     */
    error?: string;
    /**
     * The classes to pass to the text area.
     */
    className?: string;
    /**
     * The classes to pass to the text area label.
     */
    labelClassName?: string;
}

/**
 * TextArea Component
 *
 * The TextArea component takes in native textarea props as well as its own TextAreaProps. The state is not managed
 * in this component and should be handled in the consuming app.
 *
 */
const TextArea: FC<TextAreaProps & ComponentPropsWithRef<'textarea'>> = forwardRef(({ label, error = '', labelClassName, ...props }, ref) => {
    return (
        <StyledLabel error={error} className={labelClassName}>
            {label && <span>{label}</span>}
            <StyledTextArea ref={ref} error={error} {...props} />
            <div>{error}</div>
        </StyledLabel>
    );
});

export default TextArea;
