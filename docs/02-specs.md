# 02. Specs

---

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| 프론트엔드 | Vanilla JS + Tailwind CSS (CDN) |
| 백엔드 | Python + FastAPI |
| 데이터베이스 | SQLite (개발) → PostgreSQL (프로덕션) + SQLAlchemy ORM |

---

## 데이터 모델

### Task

| 필드 | 타입 | 제약 |
|------|------|------|
| `id` | INTEGER / UUID | PK, 자동 생성 |
| `title` | VARCHAR(200) | NOT NULL |
| `description` | TEXT | nullable |
| `status` | ENUM | `todo` \| `in_progress` \| `done`, 기본값 `todo` |
| `due_at` | DATETIME (UTC) | nullable |
| `created_at` | DATETIME (UTC) | 자동 생성 |
| `updated_at` | DATETIME (UTC) | 자동 갱신 |

---

## 유효성 검증

| 조건 | 응답 |
|------|------|
| `title` 누락 또는 200자 초과 | `400 Bad Request` |
| `status` 허용 값 외 값 | `400 Bad Request` |
| `due_at` ISO 8601 형식 위반 | `400 Bad Request` |
| 존재하지 않는 `id` 요청 | `404 Not Found` |

- `due_at` 허용 형식 예시: `2026-05-12T18:00:00Z`, `2026-05-12T18:00:00+09:00`

---

## REST API

Base path: `/api/tasks`

### 엔드포인트 목록

| 메서드 | 경로 | 상태 코드 | 설명 |
|--------|------|-----------|------|
| `POST` | `/api/tasks` | `201 Created` | 태스크 생성 |
| `GET` | `/api/tasks` | `200 OK` | 태스크 목록 조회 |
| `GET` | `/api/tasks/:id` | `200 OK` | 태스크 단건 조회 |
| `PUT` | `/api/tasks/:id` | `200 OK` | 태스크 수정 (부분 수정 허용) |
| `DELETE` | `/api/tasks/:id` | `204 No Content` | 태스크 삭제 |

### 응답 필드 차이

| 엔드포인트 | `description` 포함 여부 |
|------------|------------------------|
| `GET /api/tasks` (목록) | **제외** |
| `GET /api/tasks/:id` (단건) | **포함** |

### 요청/응답 예시

**POST /api/tasks**
```json
// Request
{
  "title": "API 설계 완료",
  "description": "REST 엔드포인트 5개 정의",
  "status": "todo",
  "due_at": "2026-05-20T18:00:00Z"
}

// Response 201
{
  "id": 1,
  "title": "API 설계 완료",
  "description": "REST 엔드포인트 5개 정의",
  "status": "todo",
  "due_at": "2026-05-20T18:00:00Z",
  "created_at": "2026-05-14T09:00:00Z",
  "updated_at": "2026-05-14T09:00:00Z"
}
```

**GET /api/tasks (목록)**
```json
// Response 200
[
  {
    "id": 1,
    "title": "API 설계 완료",
    "status": "todo",
    "due_at": "2026-05-20T18:00:00Z",
    "created_at": "2026-05-14T09:00:00Z",
    "updated_at": "2026-05-14T09:00:00Z"
  }
]
```

**PUT /api/tasks/:id** — 전달된 필드만 수정 (부분 수정)
```json
// Request
{ "status": "in_progress" }

// Response 200
{
  "id": 1,
  "title": "API 설계 완료",
  "description": "REST 엔드포인트 5개 정의",
  "status": "in_progress",
  "due_at": "2026-05-20T18:00:00Z",
  "created_at": "2026-05-14T09:00:00Z",
  "updated_at": "2026-05-14T10:30:00Z"
}
```

---

## 화면 명세

### 추가 (Create)

- 폼 구성: `title` 입력 / `due_at` 날짜+시각 피커 / `status` 셀렉트
- `title` 은 필수 입력, 나머지는 선택
- 제출 시 `POST /api/tasks` 호출 → 목록 갱신

### 목록 (Read)

- 카드 레이아웃으로 태스크 나열
- 카드 내 표시 요소:
  - `status` 배지 (`todo` / `in_progress` / `done`)
  - 마감까지 남은 시간: `D-N HH:MM` 형식 (예: `D-3 18:00`)
  - `description` 은 목록에서 표시하지 않음

### 수정 (Update)

- 카드 클릭 → 수정 모달 오픈
- 모달 내 `title` / `description` / `due_at` / `status` 수정 가능
- 저장 시 `PUT /api/tasks/:id` 호출 → 카드 즉시 갱신

### 삭제 (Delete)

- 카드 내 휴지통 아이콘 클릭 → 확인 모달
- 확인 시 `DELETE /api/tasks/:id` 호출 → 목록에서 제거
