const STATUS_LABELS = { todo: 'Todo', in_progress: 'In Progress', done: 'Done' };
const STATUS_CLASSES = {
  todo: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function formatDueAt(dueAtStr) {
  if (!dueAtStr) return null;
  const due = new Date(dueAtStr);
  const now = new Date();
  const dueDate = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((dueDate - nowDate) / 86400000);
  const hh = String(due.getHours()).padStart(2, '0');
  const mm = String(due.getMinutes()).padStart(2, '0');
  const prefix = diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`;
  return `${prefix} ${hh}:${mm}`;
}

// ISO → datetime-local 입력값 형식 변환
export function isoToLocal(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function renderCards(tasks, { onEdit, onDelete }) {
  const container = document.getElementById('taskList');
  const countEl = document.getElementById('taskCount');
  countEl.textContent = `총 ${tasks.length}개`;

  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
        <svg class="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <p class="text-sm">태스크가 없습니다</p>
      </div>`;
    return;
  }

  container.innerHTML = tasks.map(task => {
    const due = formatDueAt(task.due_at);
    const isOverdue = task.due_at && new Date(task.due_at) < new Date() && task.status !== 'done';
    const badge = STATUS_CLASSES[task.status] ?? STATUS_CLASSES.todo;
    const label = STATUS_LABELS[task.status] ?? task.status;

    return `
      <div class="task-card group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/60 dark:border-gray-700/60 p-4 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
        data-id="${task.id}">
        <div class="flex items-start justify-between gap-2 mb-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${badge}">${label}</span>
          <button
            class="trash-btn flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            data-id="${task.id}" aria-label="삭제">
            <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <h3 class="text-sm font-medium text-gray-900 dark:text-white leading-snug mb-2">${escapeHtml(task.title)}</h3>
        ${due ? `<p class="text-xs font-mono ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}">⏰ ${due}</p>` : ''}
        <p class="text-xs text-gray-300 dark:text-gray-600 mt-2">${dayjs(task.created_at).fromNow()}</p>
      </div>`;
  }).join('');

  container.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('click', () => onEdit(parseInt(card.dataset.id)));
  });

  container.querySelectorAll('.trash-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      onDelete(parseInt(btn.dataset.id));
    });
  });
}
