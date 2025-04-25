"use client"

import { useState, type ReactNode } from "react"
import { TaskDetailModal } from "./task-detail-modal"

interface TaskDetailButtonProps {
  task: any
  onStatusChange?: (taskId: string, status: string) => void
  onPriorityChange?: (taskId: string, priority: string) => void
  children: ReactNode
}

export function TaskDetailButton({ task, onStatusChange, onPriorityChange, children }: TaskDetailButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(true)
        }}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isOpen && (
        <TaskDetailModal
          task={task}
          onClose={() => setIsOpen(false)}
          onStatusChange={onStatusChange}
          onPriorityChange={onPriorityChange}
        />
      )}
    </>
  )
}
