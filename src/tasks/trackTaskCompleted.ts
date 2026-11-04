/**
 * Pendo Track Event `task_completed` — shared by both completion paths:
 *   - 'list_checkbox': the row checkbox in ListsPage (onToggleComplete, nextDone=true)
 *   - 'edit_modal':    a status change to 'done' saved from TaskFormModal
 *
 * Callers must only invoke this on the non-done → done transition (the same
 * edge where `tasksRepo.updateTask` stamps `completedAt`), so the event fires
 * exactly once per completion.
 */

import { trackPendoEvent } from '../pendo/track'
import type { Task } from './types'

const MS_PER_HOUR = 60 * 60 * 1000
const MS_PER_DAY = 24 * MS_PER_HOUR

export type TaskCompletionSource = 'list_checkbox' | 'edit_modal'

export function trackTaskCompleted(
  previous: Task,
  completed: Task,
  source: TaskCompletionSource,
): void {
  const completedAtMs = completed.completedAt
    ? new Date(completed.completedAt).getTime()
    : Date.now()
  const cycleTimeHours =
    Math.round(((completedAtMs - new Date(previous.createdAt).getTime()) / MS_PER_HOUR) * 10) / 10
  // dueDate is stored as UTC midnight of the due day, so a task is overdue
  // only when it is completed after that whole day has elapsed.
  const wasOverdue = previous.dueDate
    ? completedAtMs >= new Date(previous.dueDate).getTime() + MS_PER_DAY
    : false

  trackPendoEvent('task_completed', {
    source,
    priority: completed.priority,
    previousStatus: previous.status,
    cycleTimeHours,
    wasOverdue,
    hasDueDate: previous.dueDate !== null,
  })
}
