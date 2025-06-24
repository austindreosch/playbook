'use client';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
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
  standings: { component: StandingsBlock, size: 1 },     // 1x unit
  matchup: { component: MatchupBlock, size: 3 },         // 3x unit
  teamArchetype: { component: TeamArchetypeBlock, size: 2 },// 2x unit
  actionSteps: { component: ActionStepsBlock, size: 2 },  // 2x unit
  teamProfile: { component: TeamProfileBlock, size: 1 },  // 1x unit
  newsFeed: { component: NewsFeedBlock, size: 3 },       // 3x unit
};

export default function DashboardWidgetWall() {
  const widgetLayout = useDashboardContext((state) => state.widgetLayout);
  const setWidgetLayout = useDashboardContext((state) => state.setWidgetLayout);
  const isEditMode = useDashboardContext((state) => state.isEditMode);
  const containerRef = useRef(null);
  const [unitHeight, setUnitHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // We want the unit height to be 1/6th of the container's height, minus the gaps.
      // Assuming 6 rows, there will be 5 gaps.
      const totalGapHeight = 5 * 8; // gap-2 is 0.5rem = 8px
      const netHeight = container.clientHeight - totalGapHeight;
      setUnitHeight(netHeight / 6);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
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
                  ? (unitHeight * Widget.size) + ((Widget.size - 1) * 8) // Add back gap height for multi-unit widgets
                  : undefined;

                return (
                  <SortableWidget 
                    key={widgetId} 
                    id={widgetId} 
                    isEditMode={isEditMode}
                    style={{ height: widgetHeight ? `${widgetHeight}px` : 'auto' }}
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