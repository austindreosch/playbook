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
    
    measureHeight(); // Initial measurement
    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [widgetLayout]); // Re-run when layout changes, which covers most cases

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
        <div ref={containerRef} className="flex w-full h-full gap-2">
          {widgetLayout && Object.entries(widgetLayout).map(([columnId, widgets]) => (
            <div
              key={columnId}
              className="flex-1 flex flex-col gap-2 min-h-fit overflow-y-auto scrollbar-thin scrollbar-thumb-pb_lightgray hover:scrollbar-thumb-pb_midgray scrollbar-track-transparent scrollbar-gutter-stable"
            >
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