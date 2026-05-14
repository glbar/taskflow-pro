# 05. Conventions

---

## 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 백엔드 변수·함수·파일 | `snake_case` | `task_router.py`, `get_task_by_id` |
| 프론트엔드 변수·함수 | `camelCase` | `fetchTasks`, `dueAtValue` |
| 컴포넌트·클래스 | `PascalCase` | `TaskCard`, `ModalDialog` |
| 상수 | `UPPER_SNAKE_CASE` | `POLL_INTERVAL`, `MAX_TITLE_LENGTH` |
| 식별자 | **영어만** | 변수·함수·파일명에 한국어 사용 금지 |
| 주석 | **한국어** | 코드 설명은 한국어로 작성 |

---

## 금지 사항

| 금지 | 이유 | 대안 |
|------|------|------|
| `print` 디버깅 | 운영 환경 노이즈, 삭제 누락 위험 | `logging` 모듈 사용 (`logger.debug / info / error`) |
| `bare except:` | 모든 예외를 삼켜 원인 추적 불가 | `except SpecificError as e:` 로 명시적 처리 |
| 비밀번호·키 하드코딩 | 보안 사고, git 이력에 영구 잔존 | `.env` + `os.getenv("KEY")` 로 관리 |
| TypeScript `any` 타입 | 타입 검사 무력화, 런타임 오류 증가 | 명시적 타입 또는 `unknown` 후 타입 가드 사용 |
| CSS `!important` | 우선순위 구조 붕괴, 디버깅 난이도 증가 | 셀렉터 구체성 높이거나 Tailwind 유틸리티 클래스 활용 |

---

## 테스트 규칙

- 테스트 프레임워크: `pytest`
- 모든 API 엔드포인트에 아래 케이스를 작성한다.

| 케이스 | 설명 |
|--------|------|
| 정상 케이스 | 유효한 입력 → 기대 상태 코드 + 응답 구조 확인 |
| 404 케이스 | 존재하지 않는 `id` 요청 → 404 응답 확인 |
| 400 케이스 | 필수 필드 누락·형식 오류 → 400 응답 확인 |

---

## Git 커밋 규칙

```
<type>: <한국어 요약>
```

| type | 용도 |
|------|------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `docs` | 문서 변경 |
| `refactor` | 기능 변경 없는 코드 구조 개선 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드·설정·패키지 변경 |

```bash
# 예시
feat: 태스크 삭제 API 구현
fix: due_at 형식 검증 오류 수정
docs: 04-tasks Phase 2 체크리스트 업데이트
test: POST /api/tasks 400 케이스 추가
```

- 요약은 **한국어**, 50자 이내
- 마침표 없음
- 본문이 필요하면 한 줄 띄우고 작성
