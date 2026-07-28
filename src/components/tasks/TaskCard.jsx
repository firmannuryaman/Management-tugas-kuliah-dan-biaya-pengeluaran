import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil, Trash2, Calendar, BookOpen, User, ArrowRight, ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { STATUSES, STATUS_LABELS } from '../../lib/store'

const statusColors = {
  todo: 'border-l-yellow-400',
  in_progress: 'border-l-blue-400',
  done: 'border-l-green-400',
}

const nextStatus = {
  todo: 'in_progress',
  in_progress: 'done',
}

const prevStatus = {
  in_progress: 'todo',
  done: 'in_progress',
}

const nextLabel = {
  todo: 'Kerjakan',
  in_progress: 'Selesaikan',
}

const prevLabel = {
  in_progress: 'Kembali',
  done: 'Revisi',
}

export default function TaskCard({ task, onEdit, onDelete, onMove }) {
  const isDone = task.status === 'done'
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: isDone })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date(new Date().toDateString()) &&
    task.status !== 'done'

  const isNearDeadline =
    !isOverdue &&
    task.deadline &&
    task.status !== 'done' &&
    (new Date(task.deadline) - new Date()) / (1000 * 60 * 60 * 24) <= 3

  const canNext = nextStatus[task.status]
  const canPrev = prevStatus[task.status]

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isDone ? {} : attributes)}
      {...(isDone ? {} : listeners)}
      className={`kanban-card border-l-4 ${statusColors[task.status]} ${isDragging ? 'shadow-xl' : ''} ${isDone ? 'cursor-default' : ''} select-none`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm text-gray-900 leading-snug">
              {task.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(task) }}
                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(task) }}
                className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
            {task.courseName && (
              <span className="flex items-center gap-1">
                <BookOpen size={12} />
                {task.courseName}
              </span>
            )}
            {task.lecturerName && (
              <span className="flex items-center gap-1">
                <User size={12} />
                {task.lecturerName}
              </span>
            )}
          </div>

          {task.deadline && (
            <div className="mt-2 flex items-center gap-1.5">
              <Calendar size={12} className={isOverdue ? 'text-red-500' : isNearDeadline ? 'text-orange-500' : 'text-gray-400'} />
              <span
                className={`text-xs font-medium ${
                  isOverdue
                    ? 'text-red-600'
                    : isNearDeadline
                      ? 'text-orange-600'
                      : 'text-gray-500'
                }`}
              >
                {new Date(task.deadline).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {isOverdue && ' (Terlewat)'}
                {isNearDeadline && !isOverdue && ' (Segera)'}
              </span>
            </div>
          )}

          {task.description && (
            <p className="mt-2 text-xs text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {canPrev && (
              <button
                onClick={(e) => { e.stopPropagation(); onMove(task.id, prevStatus[task.status]) }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <ArrowLeft size={12} />
                {prevLabel[task.status]}
              </button>
            )}
            {canNext && (
              <button
                onClick={(e) => { e.stopPropagation(); onMove(task.id, nextStatus[task.status]) }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                {nextLabel[task.status]}
                <ArrowRight size={12} />
              </button>
            )}
            {task.status === 'done' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                <CheckCircle2 size={12} />
                Selesai
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
