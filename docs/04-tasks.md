# 04. Tasks

> **MVP 3-Phase 계획** — 확장 단계는 이 문서에 포함하지 않는다.

---

## 진행 규칙

- **순서대로만** 진행한다. 이전 단계 미완료 시 다음 단계 진입 금지.
- **병렬 작업 금지** — 한 단계씩, 검증 후 다음 단계.
- **단계별 검증 필수** — 검증 방법을 실행하여 통과 확인 후 체크.

---

## 전체 진행 현황

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | 설계 — CLAUDE.md + docs/ 6종 | ✅ 완료 |
| Phase 2 | 백엔드 — FastAPI CRUD API 5개 | ✅ 완료 |
| Phase 3 | 프론트엔드 — HTML+JS+Tailwind | ✅ 완료 |

---

## Phase 1. 설계 ✅

| # | 작업 | 상태 | 검증 방법 |
|---|------|------|----------|
| 1 | Git 초기화 + GitHub 연결 | ✅ | `git remote -v` 로 origin 확인 |
| 2 | `.gitignore` 작성 | ✅ | `git status` 에서 제외 파일 확인 |
| 3 | `CLAUDE.md` 작성 | ✅ | 역할·규칙·필독 절차 포함 여부 확인 |
| 4 | `docs/00-overview.md` 작성 | ✅ | 6개 파일 매핑표 + 읽는 순서 포함 확인 |
| 5 | `docs/01-product.md` 작성 | ✅ | 페르소나·MVP 범위·성공 기준 포함 확인 |
| 6 | `docs/02-specs.md` 작성 | ✅ | Task 모델·API 5개·화면 명세 포함 확인 |
| 7 | `docs/03-design.md` 작성 | ✅ | 기술 결정 8개 ADR 포함 확인 |
| 8 | `docs/04-tasks.md` 작성 | ✅ | Phase 3개·체크리스트 포함 확인 |
| 9 | `docs/05-conventions.md` 작성 | ✅ | 코딩 스타일·Git 전략·커밋 규칙 포함 확인 |
| 10 | 전체 docs/ GitHub 푸시 | ✅ | `git log --oneline` 으로 커밋 확인 |

---

## Phase 2. 백엔드 ✅

| # | 작업 | 상태 | 검증 방법 |
|---|------|------|----------|
| 1 | `backend/` 폴더 구조 생성 | ✅ | `ls backend/` 로 파일 트리 확인 |
| 2 | Python 가상환경 생성 + 패키지 설치 | ✅ | `pip list` 에서 fastapi·sqlalchemy·uvicorn 확인 |
| 3 | FastAPI 앱 진입점 작성 (`main.py`) + CORS 설정 | ✅ | `uvicorn main:app --reload` 실행 후 200 응답 확인 |
| 4 | SQLAlchemy `Task` 모델 정의 | ✅ | 모델 필드 7개(`id`·`title`·`description`·`status`·`due_at`·`created_at`·`updated_at`) 확인 |
| 5 | DB 초기화 + 테이블 생성 | ✅ | SQLite 파일 생성 및 `tasks` 테이블 존재 확인 |
| 6 | `POST /api/tasks` 구현 | ✅ | Swagger에서 201 응답 + DB 저장 확인 |
| 7 | `GET /api/tasks` 구현 | ✅ | Swagger에서 200 응답 + `description` 제외 확인 |
| 8 | `GET /api/tasks/{id}` 구현 | ✅ | Swagger에서 200 응답 + `description` 포함 확인 |
| 9 | `PUT /api/tasks/{id}` 구현 (부분 수정) | ✅ | Swagger에서 일부 필드만 전송 후 200 응답 확인 |
| 10 | `DELETE /api/tasks/{id}` 구현 + 유효성 검증 (400·404) | ✅ | Swagger에서 204 응답 / 없는 id 요청 시 404 확인 |

---

## Phase 3. 프론트엔드 ✅

| # | 작업 | 상태 | 검증 방법 |
|---|------|------|----------|
| 1 | `frontend/` 폴더 구조 생성 + `index.html` 기본 레이아웃 | ✅ | 브라우저에서 `index.html` 열려 빈 화면 정상 표시 확인 |
| 2 | Tailwind CDN 연결 + 라이트/다크 테마 토글 구현 | ✅ | 토글 클릭 후 `localStorage('theme')` 저장 + 새로고침 유지 확인 |
| 3 | 태스크 추가 폼 구현 (`title` / `due_at` / `status`) | ✅ | 폼 제출 시 `POST /api/tasks` 호출 + 201 응답 확인 |
| 4 | 태스크 목록 카드 구현 (status 배지 + D-N HH:MM) | ✅ | 목록 조회 시 카드 렌더링 + D-Day 표시 확인 |
| 5 | 폴링 3초 구현 (`setInterval`) | ✅ | 다른 탭에서 태스크 추가 후 3초 내 목록 갱신 확인 |
| 6 | 태스크 수정 모달 구현 (카드 클릭 → 모달 → PUT) | ✅ | 모달 저장 후 카드 즉시 갱신 + `PUT /api/tasks/{id}` 200 응답 확인 |
| 7 | 태스크 삭제 구현 (휴지통 → 확인 모달 → DELETE) | ✅ | 삭제 확인 후 목록에서 제거 + `DELETE /api/tasks/{id}` 204 응답 확인 |
| 8 | MVP 성공 기준 5가지 전수 검증 + git push | ✅ | `01-product.md` 성공 기준 5개 모두 체크 후 GitHub 푸시 |
