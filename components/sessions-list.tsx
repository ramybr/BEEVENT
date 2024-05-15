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
  onReorder: (updateData: { id: number; position: number }[]) => void;
  onEdit: (id: number) => void;
};

export const SessionsList = ({
  items,
  onReorder,
  onEdit,
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

    const items = Array.from(sessions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSessions = items.slice(startIndex, endIndex + 1);

    setSessions(items);

    const bulkUpdateData = updatedSessions.map((session) => ({
      id: session.id,
      position: items.findIndex((item) => item.id === session.id),
    }));

    onReorder(bulkUpdateData);
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
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {session.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Pencil
                        onClick={() => onEdit(session.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
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
