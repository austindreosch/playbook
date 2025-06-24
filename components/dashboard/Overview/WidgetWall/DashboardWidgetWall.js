'use client';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useLayoutEffect, useRef, useState } from 'react';
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
  standings: { component: StandingsBlock, size: 2 },   
  matchup: { component: MatchupBlock, size: 4 },         
  teamArchetype: { component: TeamArchetypeBlock, size: 3 },
  actionSteps: { component: ActionStepsBlock, size: 3 },  
  teamProfile: { component: TeamProfileBlock, size: 2 }, 
  newsFeed: { component: NewsFeedBlock, size: 4 },
};

export default function DashboardWidgetWall() {
  const widgetLayout = useDashboardContext((state) => state.widgetLayout);
  const setWidgetLayout = useDashboardContext((state) => state.setWidgetLayout);
  const isEditMode = useDashboardContext((state) => state.isEditMode);
  const containerRef = useRef(null);
  const [unitHeight, setUnitHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureHeight = () => {
      const containerHeight = container.clientHeight;
      if (containerHeight > 0) {
        const totalGapHeight = 5 * 8; 
        const netHeight = containerHeight - totalGapHeight;
        setUnitHeight(netHeight / 6);
      }
    };

    // Delay measurement to allow parent layout to settle
    const timeoutId = setTimeout(measureHeight, 0);
    
    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, []);

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
        <div ref={containerRef} className="flex w-full h-full gap-2">
          {widgetLayout && Object.entries(widgetLayout).map(([columnId, widgets]) => (
            <div key={columnId} className="flex-1 flex flex-col gap-2 overflow-y-auto">
              {widgets.map((widgetId) => {
                const Widget = widgetMap[widgetId];
                if (!Widget) return null;
                const WidgetComponent = Widget.component;
                const widgetHeight = unitHeight > 0 
                  ? (unitHeight * Widget.size) + ((Widget.size - 1) * 8)
                  : undefined;

                return (
                  <SortableWidget 
                    key={widgetId} 
                    id={widgetId} 
                    isEditMode={isEditMode}
                    style={{ height: widgetHeight ? `${widgetHeight}px` : undefined }}
                  >
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