import { FC, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/react/sortable';

interface SortableSectionProps {
  id: string;
  index: number;
  isDragEnabled: boolean;
  children: (handleRef: any) => any;
}

const SortableSection: FC<SortableSectionProps> = ({
  id,
  index,
  isDragEnabled,
  children
}) => {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
    disabled: !isDragEnabled
  });

  return (
    <section
      ref={setElement}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transition: 'opacity 0.2s'
      }}
    >
      {children(isDragEnabled ? handleRef : null)}
    </section>
  );
};

export default SortableSection;
