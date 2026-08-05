import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { useStore, STATUSES, STATUS_LABELS } from '../../lib/store'
import TaskColumn from './TaskColumn'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import Modal from '../ui/Modal'
import { Plus, Search, X } from 'lucide-react'

export default function TaskBoard() {
  const tasks = useStore((s) => s.tasks)
  const moveTask = useStore((s) => s.moveTask)
  const deleteTask = useStore((s) => s.deleteTask)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCourse, setFilterCourse] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.courseName?.toLowerCase().includes(search.toLowerCase())
    const matchCourse = !filterCourse || t.courseName === filterCourse
    return matchSearch && matchCourse
  })

  const courses = [...new Set(tasks.map((t) => t.courseName).filter(Boolean))]

  const getTasksByStatus = (status) =>
    filteredTasks.filter((t) => t.status === status)

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeTask = tasks.find((t) => t.id === active.id)
    if (!activeTask) return

    const overId = over.id
    const targetStatus = STATUSES.includes(overId) ? overId : activeTask.status

    if (activeTask.status === 'overdue' && targetStatus === 'in_progress') return

    if (activeTask.status !== targetStatus) {
      moveTask(active.id, targetStatus)
    }
  }

  const handleDragCancel = () => setActiveId(null)

  const openAdd = () => {
    setEditTask(null)
    setModalOpen(true)
  }

  const openEdit = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleDelete = (task) => {
    if (window.confirm(`Hapus tugas "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  const handleMove = (id, status) => {
    moveTask(id, status)
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
              placeholder="Cari tugas..."
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {courses.length > 0 && (
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="input w-auto"
            >
              <option value="">Semua MK</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
        <button onClick={openAdd} className="btn-primary w-full sm:w-auto justify-center">
          <Plus size={16} />
          Tambah Tugas
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <TaskColumn
              key={status}
              status={status}
              label={STATUS_LABELS[status]}
              tasks={getTasksByStatus(status)}
              onEdit={openEdit}
              onDelete={handleDelete}
              onMove={handleMove}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="kanban-card border-l-4 border-primary-400 shadow-xl rotate-3 select-none">
              <h4 className="font-medium text-sm">{activeTask.title}</h4>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTask ? 'Edit Tugas' : 'Tambah Tugas Baru'}
      >
        <TaskForm
          editTask={editTask}
          onClose={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
