"use client";

import { Session } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";

type SessionsListProps = {
  items: Session[];
  onReorder?: (updateData: { id: number; position: number }[]) => void; // Make optional
  onEdit?: (id: number) => void; // Make optional
  editable: boolean; // Add editable prop
};

export const SessionsList = ({
  items,
  onReorder,
  onEdit,
  editable,
}: SessionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [sessions, setSessions] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSessions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedSessions = Array.from(sessions);
    const [movedSession] = reorderedSessions.splice(result.source.index, 1);
    reorderedSessions.splice(result.destination.index, 0, movedSession);

    // Update the position attribute based on the new order, starting from 1
    const updatedSessions = reorderedSessions.map((session, index) => ({
      ...session,
      position: index + 1,
    }));

    setSessions(updatedSessions);

    const bulkUpdateData = updatedSessions.map((session) => ({
      id: session.id,
      position: session.position,
    }));

    onReorder?.(bulkUpdateData); // Call onReorder only if it is defined
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sessions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sessions.map((session, index) => (
              <Draggable
                key={session.id}
                draggableId={session.id.toString()}
                index={index}
                isDragDisabled={!editable} // Disable dragging if not editable
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm dark:bg-background-2nd-level dark:text-bg2-contrast dark:border-none"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    {editable && (
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                    )}
                    {session.title}
                    {editable && (
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Pencil
                          onClick={() => onEdit?.(session.id)}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
