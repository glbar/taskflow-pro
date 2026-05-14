import * as api from './api.js';
import { renderCards, isoToLocal } from './render.js';

// 상태
let editingTaskId = null;
let deletingTaskId = null;
const POLL_INTERVAL = 3000;

// DOM
const themeToggle = document.getElementById('themeToggle');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const addForm = document.getElementById('addForm');
const addError = document.getElementById('addError');
const editModal = document.getElementById('editModal');
const editBackdrop = document.getElementById('editBackdrop');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editDueAt = document.getElementById('editDueAt');
const editStatus = document.getElementById('editStatus');
const editError = document.getElementById('editError');
const editSaveBtn = document.getElementById('editSaveBtn');
const editCancelBtn = document.getElementById('editCancelBtn');
const deleteModal = document.getElementById('deleteModal');
const deleteBackdrop = document.getElementById('deleteBackdrop');
const deleteConfirmBtn = document.getElementById('deleteConfirmBtn');
const deleteCancelBtn = document.getElementById('deleteCancelBtn');

// 테마
function updateThemeIcons() {
  const isDark = document.documentElement.classList.contains('dark');
  iconSun.classList.toggle('hidden', !isDark);
  iconMoon.classList.toggle('hidden', isDark);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcons();
}

// 데이터 fetch + 렌더
async function fetchAndRender() {
  try {
    const tasks = await api.listTasks();
    renderCards(tasks, { onEdit: openEditModal, onDelete: openDeleteModal });
  } catch {
    // 네트워크 오류는 무시 — 폴링이 재시도
  }
}

// 추가 폼 제출
async function handleAddSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('addTitle').value.trim();
  const dueAtLocal = document.getElementById('addDueAt').value;
  const status = document.getElementById('addStatus').value;

  const { ok } = await api.createTask({
    title,
    status,
    due_at: dueAtLocal ? new Date(dueAtLocal).toISOString() : null,
  });

  if (!ok) {
    addError.textContent = '추가 실패. 입력값을 확인하세요.';
    addError.classList.remove('hidden');
    return;
  }

  addError.classList.add('hidden');
  addForm.reset();
  await fetchAndRender();
}

// 수정 모달
async function openEditModal(taskId) {
  editingTaskId = taskId;
  editError.classList.add('hidden');
  try {
    const task = await api.getTask(taskId);
    editTitle.value = task.title;
    editDescription.value = task.description ?? '';
    editDueAt.value = isoToLocal(task.due_at);
    editStatus.value = task.status;
    editModal.classList.remove('hidden');
  } catch {
    alert('태스크를 불러오지 못했습니다.');
  }
}

function closeEditModal() {
  editModal.classList.add('hidden');
  editingTaskId = null;
}

async function handleEditSave() {
  const title = editTitle.value.trim();
  if (!title) {
    editError.textContent = '제목은 필수입니다.';
    editError.classList.remove('hidden');
    return;
  }

  const dueAtLocal = editDueAt.value;
  const { ok } = await api.updateTask(editingTaskId, {
    title,
    description: editDescription.value.trim() || null,
    status: editStatus.value,
    due_at: dueAtLocal ? new Date(dueAtLocal).toISOString() : null,
  });

  if (!ok) {
    editError.textContent = '저장 실패. 입력값을 확인하세요.';
    editError.classList.remove('hidden');
    return;
  }

  closeEditModal();
  await fetchAndRender();
}

// 삭제 모달
function openDeleteModal(taskId) {
  deletingTaskId = taskId;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  deletingTaskId = null;
}

async function handleDeleteConfirm() {
  if (!deletingTaskId) return;
  await api.deleteTask(deletingTaskId);
  closeDeleteModal();
  await fetchAndRender();
}

// 이벤트 바인딩
themeToggle.addEventListener('click', toggleTheme);
addForm.addEventListener('submit', handleAddSubmit);
editSaveBtn.addEventListener('click', handleEditSave);
editCancelBtn.addEventListener('click', closeEditModal);
editBackdrop.addEventListener('click', closeEditModal);
deleteConfirmBtn.addEventListener('click', handleDeleteConfirm);
deleteCancelBtn.addEventListener('click', closeDeleteModal);
deleteBackdrop.addEventListener('click', closeDeleteModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeEditModal(); closeDeleteModal(); }
});

// 초기화
updateThemeIcons();
await fetchAndRender();
setInterval(fetchAndRender, POLL_INTERVAL);
