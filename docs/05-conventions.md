# 05. Conventions

---

## 코딩 스타일

### Python (FastAPI 백엔드)

| 항목 | 규칙 |
|------|------|
| 포매터 | `black` (줄 길이 88) |
| 린터 | `ruff` |
| 타입 힌트 | 모든 함수 시그니처에 필수 |
| 변수·함수 | `snake_case` |
| 클래스 | `PascalCase` |
| 상수 | `UPPER_SNAKE_CASE` |
| 임포트 순서 | stdlib → 서드파티 → 로컬 (isort 기준) |

```python
# Good
async def get_task(task_id: int, db: Session = Depends(get_db)) -> TaskResponse:
    ...

# Bad — 타입 힌트 없음
async def get_task(task_id, db):
    ...
```

### JavaScript (Vanilla JS 프론트엔드)

| 항목 | 규칙 |
|------|------|
| 문법 | ES2022+ (async/await, optional chaining) |
| 변수·함수 | `camelCase` |
| 상수 | `UPPER_SNAKE_CASE` |
| DOM 선택자 | `data-*` 속성 우선, `id` 차선 |
| 모듈 | `type="module"` 스크립트 분리 |

```js
// Good
const fetchTasks = async () => { ... };
const POLL_INTERVAL = 3000;

// Bad — var 사용, 타입 불명확
var tasks = [];
```

### HTML / Tailwind CSS

- Tailwind 유틸리티 클래스만 사용 (인라인 `style` 속성 금지)
- `dark:` 변형 클래스 모든 배경·텍스트·보더에 적용
- 터치 타깃 최소 `h-11`(44px) 이상 유지

---

## 파일·폴더 네이밍

| 대상 | 규칙 | 예시 |
|------|------|------|
| Python 파일 | `snake_case.py` | `task_router.py` |
| JS 파일 | `camelCase.js` | `taskApi.js` |
| HTML 파일 | `kebab-case.html` | `index.html` |
| 환경변수 키 | `UPPER_SNAKE_CASE` | `DATABASE_URL` |

---

## Git 브랜치 전략

```
master          — 항상 배포 가능 상태 유지
├── feat/xxx    — 새 기능
├── fix/xxx     — 버그 수정
├── docs/xxx    — 문서 변경
└── refactor/xxx — 리팩터링 (기능 변경 없음)
```

- `master` 직접 push 금지 (PR 경유)
- 브랜치명은 `kebab-case` 사용
- 작업 단위가 작을수록 좋다 — 하나의 브랜치는 하나의 목적

---

## 커밋 메시지 규칙

```
<type>: <subject>

[optional body]
```

| type | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `style` | 포매팅, 세미콜론 등 (로직 변경 없음) |
| `refactor` | 리팩터링 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드, 설정 변경 |

```bash
# Good
feat: add task delete confirmation modal
fix: return 404 when task id not found
docs: update 04-tasks milestone status

# Bad — 타입 없음, 모호한 메시지
update code
fix bug
```

- subject는 **영어**, 소문자 동사 시작, 50자 이내
- 마침표 없음

---

## PR 규칙

- 제목은 커밋 메시지 규칙과 동일
- 본문에 **변경 이유** 명시 (무엇이 아닌 왜)
- 셀프 리뷰 후 머지 (팀원 없을 경우 24시간 후 셀프 머지 허용)
- 머지 방식: **Squash and merge** (커밋 히스토리 단순화)

---

## 환경변수 관리

- `.env` 파일은 `.gitignore`에 포함 — 절대 커밋하지 않는다
- `.env.example` 파일로 필요한 키 목록만 공유

```bash
# .env.example
DATABASE_URL=
SECRET_KEY=
ENVIRONMENT=development
```

---

## 테스트 규칙

| 레이어 | 도구 | 대상 |
|--------|------|------|
| 백엔드 | `pytest` + `httpx` | API 엔드포인트 전수, 유효성 검증 케이스 |
| 프론트엔드 | 수동 시나리오 | CRUD 4종 + 테마 토글 + 360px 레이아웃 |

- 새 엔드포인트 추가 시 반드시 테스트 함께 작성
- 테스트 없이 PR 머지 금지 (`03-design.md` 절대 규칙 3번 참고)
