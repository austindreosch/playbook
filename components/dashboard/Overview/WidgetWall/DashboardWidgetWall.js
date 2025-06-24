'use client';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import useDashboardContext from '../../../../stores/dashboard/useDashboardContext';
import ActionStepsBlock from '../ActionSteps/ActionStepsBlock';
import MatchupBlock from '../Matchup/MatchupBlock';
import NewsFeedBlock from '../NewsFeed/NewsFeedBlock';
import StandingsBlock from '../Standings/StandingsBlock';
import TeamArchetypeBlock from '../TeamArchetype/TeamArchetypeBlock';
import TeamProfileBlock from '../TeamProfile/TeamProfileBlock';
import SortableWidget from './SortableWidget';

// Map widget IDs to their components and styling
const widgetMap = {
  standings: { component: StandingsBlock, className: 'row-span-2' },
  matchup: { component: MatchupBlock, className: 'row-span-4' },
  teamArchetype: { component: TeamArchetypeBlock, className: 'row-span-1' },
  actionSteps: { component: ActionStepsBlock, className: 'row-span-1' },
  teamProfile: { component: TeamProfileBlock, className: 'row-span-1' },
  newsFeed: { component: NewsFeedBlock, className: 'row-span-2' },
};

export default function DashboardWidgetWall() {
  const widgetLayout = useDashboardContext((state) => state.widgetLayout);
  const setWidgetLayout = useDashboardContext((state) => state.setWidgetLayout);
  const isEditMode = useDashboardContext((state) => state.isEditMode);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require pointer to move 8px to start dragging
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = active.data.current.sortable.index;
      const newIndex = over.data.current.sortable.index;
      const newLayout = arrayMove(Object.values(widgetLayout).flat(), oldIndex, newIndex);
      
      // Reconstruct the columns. This is a simple example.
      // A more robust solution might be needed for complex layouts.
      const updatedLayout = {
        column1: newLayout.slice(0, 2),
        column2: newLayout.slice(2, 4),
        column3: newLayout.slice(4, 6),
      };
      setWidgetLayout(updatedLayout);
    }
  };
  
  const allWidgets = Object.values(widgetLayout).flat();

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allWidgets} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-6 gap-2 w-full h-full">
          {allWidgets.map((widgetId) => {
            const WidgetComponent = widgetMap[widgetId]?.component;
            const className = widgetMap[widgetId]?.className || '';
            return WidgetComponent ? (
              <SortableWidget key={widgetId} id={widgetId} isEditMode={isEditMode}>
                <WidgetComponent className={className} />
              </SortableWidget>
            ) : null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
} 