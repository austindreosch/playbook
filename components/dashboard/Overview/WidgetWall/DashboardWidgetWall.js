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
    if (!over) return;
    if (active.id !== over.id) {
      // This is a simplified logic for reordering within the same column.
      // A full implementation would need to handle moving between columns.
      // For now, we will find the column of the active item and reorder within it.
      const newLayout = { ...widgetLayout };
      let activeColumn = null;
      Object.keys(newLayout).forEach(col => {
        if (newLayout[col].includes(active.id)) {
          activeColumn = col;
        }
      });
      if (activeColumn && newLayout[activeColumn].includes(over.id)) {
        const oldIndex = newLayout[activeColumn].indexOf(active.id);
        const newIndex = newLayout[activeColumn].indexOf(over.id);
        newLayout[activeColumn] = arrayMove(newLayout[activeColumn], oldIndex, newIndex);
        setWidgetLayout(newLayout);
      }
      // TODO: Implement logic for dragging between columns.
    }
  };
  
  const allWidgets = widgetLayout ? Object.values(widgetLayout).flat() : [];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allWidgets} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-6 gap-2 w-full h-full overflow-y-auto">
          {widgetLayout && Object.entries(widgetLayout).map(([columnId, widgets]) => (
            <div key={columnId} className="col-span-2 grid grid-rows-6 gap-2">
              {widgets.map((widgetId) => {
                const Widget = widgetMap[widgetId];
                if (!Widget) return null;
                const WidgetComponent = Widget.component;
                const className = Widget.className;

                return (
                  <SortableWidget key={widgetId} id={widgetId} isEditMode={isEditMode} className={className}>
                    <WidgetComponent />
                  </SortableWidget>
                );
              })}
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
} 