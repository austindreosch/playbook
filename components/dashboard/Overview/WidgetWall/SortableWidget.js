'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableWidget({ id, children, isEditMode, className = '' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative ${className}`}>
      {children}
      {isEditMode && (
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 z-10 p-1 bg-gray-200 rounded-md cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
} 