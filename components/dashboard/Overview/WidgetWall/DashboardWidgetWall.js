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
import ActionStepsWidget from '../ActionSteps/ActionStepsWidget.tsx';
import MatchupsWidget from '../Matchups/MatchupsWidget';
import NewsWidget from '../NewsFeed/NewsFeedWidget';
import StandingsWidget from '../Standings/StandingsWidget.tsx';
import TeamArchetypeWidget from '../TeamArchetype/TeamArchetypeWidget.tsx';
import TeamProfileWidget from '../TeamProfile/TeamProfileWidget';
import SortableWidget from './SortableWidget';

// Map widget IDs to their components and sizes
const widgetMap = {
  standings: { component: StandingsWidget, size: 3 },   
  matchup: { component: MatchupsWidget, size: 7 },         
  newsFeed: { component: NewsWidget, size: 7 },
  teamArchetype: { component: TeamArchetypeWidget, size: 3 },
  teamProfile: { component: TeamProfileWidget, size: 4 }, 
  actionSteps: { component: ActionStepsWidget, size: 6 },  
};

export default function DashboardWidgetWall() {
  const widgetLayout = useDashboardContext((state) => state.widgetLayout);
  const setWidgetLayout = useDashboardContext((state) => state.setWidgetLayout);
  const isEditMode = useDashboardContext((state) => state.isEditMode);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const newLayout = JSON.parse(JSON.stringify(widgetLayout));
    let sourceColumn, sourceIndex, destColumn, destIndex;

    Object.entries(newLayout).forEach(([colId, widgets]) => {
      const activeIndex = widgets.indexOf(active.id);
      const overIndex = widgets.indexOf(over.id);

      if (activeIndex !== -1) {
        sourceColumn = colId;
        sourceIndex = activeIndex;
      }
      if (overIndex !== -1) {
        destColumn = colId;
        destIndex = overIndex;
      }
    });

    if (!destColumn) {
        if (newLayout[over.id]) {
            destColumn = over.id;
            destIndex = newLayout[destColumn].length;
        } else {
            return;
        }
    }

    const [movedItem] = newLayout[sourceColumn].splice(sourceIndex, 1);
    newLayout[destColumn].splice(destIndex, 0, movedItem);
    setWidgetLayout(newLayout);
  };

  const allWidgets = widgetLayout ? Object.values(widgetLayout).flat() : [];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={allWidgets} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-3 gap-2 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent scrollbar-gutter-stable">
          {widgetLayout && Object.entries(widgetLayout).map(([columnId, widgets]) => (
            <div
              key={columnId}
              className="flex flex-col gap-2"
            >
              {widgets.map((widgetId) => {
                const Widget = widgetMap[widgetId];
                if (!Widget) return null;
                const WidgetComponent = Widget.component;
                const widgetSize = Widget.size;

                return (
                  <SortableWidget 
                    key={widgetId} 
                    id={widgetId} 
                    isEditMode={isEditMode}
                  >
                    <WidgetComponent snapHeight size={widgetSize} />
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

