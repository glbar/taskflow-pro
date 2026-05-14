const BASE_URL = 'http://localhost:8000/api';

export async function listTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  if (!res.ok) throw new Error('목록 조회 실패');
  return res.json();
}

export async function getTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  if (!res.ok) throw new Error('태스크 조회 실패');
  return res.json();
}

export async function createTask(data) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function updateTask(id, data) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return { ok: res.ok, data: await res.json() };
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' });
  return res.ok;
}
