import { useState } from 'react'
import {DndContext} from '@dnd-kit/core';

import {Draggable} from '../components/Draggable';
import {Droppable} from '../components/Dropppable';

export default function Home () {
  const [isDropped, setIsDropped] = useState(false);

  const draggableMarkup = (
    <Draggable>Drag me</Draggable>
  );

  function handleDragEnd(event) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }

  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 h-full">
      <div className="absolute top-0 right-0 left-0 h-12 border-b border-base-200">
        <div className="flex items-center h-full gap-3 px-3">
          <p>General</p>
        </div>
      </div>
      <div className="absolute top-12 right-0 bottom-0 left-0 overflow-y-auto">
        <DndContext onDragEnd={handleDragEnd}>
          {!isDropped ? draggableMarkup : null}
          <Droppable>
            {isDropped ? draggableMarkup : 'Drop here'}
          </Droppable>
        </DndContext>
      </div>
    </div>
  )
}
