import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import EmptyState from '../ui/EmptyState'
import { Inbox } from 'lucide-react'

const columnColors = {
  todo: { dot: 'bg-yellow-400', bg: 'bg-yellow-50' },
  in_progress: { dot: 'bg-blue-400', bg: 'bg-blue-50' },
  done: { dot: 'bg-green-400', bg: 'bg-green-50' },
  overdue: { dot: 'bg-red-400', bg: 'bg-red-50' },
}

export default function TaskColumn({
  status,
  label,
  tasks,
  onEdit,
  onDelete,
  onMove,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const colors = columnColors[status] || columnColors.todo

  return (
    <div
      ref={setNodeRef}
      className={`kanban-column flex-1 min-w-[280px] transition-colors ${
        isOver ? 'bg-primary-50 ring-2 ring-primary-300' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-3 h-3 rounded-full ${colors.dot}`} />
        <h3 className="font-semibold text-sm text-gray-700">{label}</h3>
        <span className="ml-auto text-xs font-medium text-gray-400 bg-white px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[200px]">
          {tasks.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Belum ada tugas"
              description="Tugas yang dipindahkan ke sini akan muncul di sini."
            />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}
