# 03. Design

---

## 아키텍처 결정 기록 (ADR)

> **의존성 추가 정책**: 새 패키지·라이브러리 도입 전 반드시 이 문서에 사유를 먼저 기재한다.
> 사유 없는 의존성 추가는 금지한다.

---

## 8가지 기술 결정

| # | 항목 | **선택** | 대안 | 근거 | 트레이드오프 |
|---|------|---------|------|------|-------------|
| 1 | 백엔드 | **FastAPI** | Django, Express | 자동 문서화(Swagger), 타입 힌트 기반 유효성 검증, 가벼운 구조 | Django 대비 생태계 좁음. Express 대비 Python 런타임 필요 |
| 2 | 프론트엔드 | **Vanilla JS + Tailwind CDN** | React, Vue | 번들러·빌드 도구 없이 즉시 실행. 학습 곡선 최소화. CDN 한 줄로 스타일 완성 | 컴포넌트 재사용 구조 직접 설계 필요. 규모 커지면 유지보수 부담 증가 |
| 3 | 데이터베이스 | **SQLite → PostgreSQL** + SQLAlchemy | MySQL, MongoDB | 로컬 개발은 SQLite(파일 DB), 프로덕션은 PostgreSQL로 전환. SQLAlchemy로 ORM 추상화 | SQLite → PostgreSQL 전환 시 마이그레이션 검증 필요 |
| 4 | CSS | **Tailwind CSS만** | styled-components, CSS Modules | 유틸리티 클래스로 일관성 유지. 별도 CSS 파일 불필요. CDN 방식으로 빌드 단계 제거 | `styled-components` 사용 금지. Tailwind 클래스 이외의 인라인 스타일 지양 |
| 5 | 실시간 | **폴링 3초 (MVP)** | WebSocket, SSE | 구현 복잡도 최소화. MVP 성공 기준(API 200ms)에서 폴링으로 충분 | 불필요한 요청 발생. WebSocket은 확장 단계에서 도입 |
| 6 | 상태 관리 | **모듈 변수 + DOM 직접 갱신** | Redux, Zustand, Pinia | 프레임워크 없는 Vanilla JS 환경에서 가장 단순한 방식. 외부 라이브러리 불필요 | 상태·DOM이 분리되지 않아 규모 커지면 복잡도 증가 |
| 7 | 디자인 시스템 | **macOS UI 톤** | Material Design, Ant Design | 제품 컨셉(세련된 팀 도구)과 일치. 외부 컴포넌트 라이브러리 의존 없음 | 디자인 토큰 직접 정의 필요 |
| 8 | 테마 | **라이트/다크 토글** | 라이트 고정 | 사용자 선호 반영. `prefers-color-scheme` 초기값 → `localStorage('theme')` 저장 | 모든 컴포넌트에 `dark:` 변형 클래스 적용 필요 |

---

## 디자인 토큰

```
rounded-xl          — 모서리 반경
shadow-lg           — 카드 그림자
backdrop-blur       — 반투명 카드 배경
font-family: system-ui, -apple-system, sans-serif   — 시스템 폰트
touch target ≥ 44px — 모바일 터치 타깃 최소 높이
```

---

## 테마 구현 규칙

```js
// 초기값: prefers-color-scheme 우선, localStorage 저장값으로 덮어쓰기
const saved = localStorage.getItem('theme');
const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.classList.toggle('dark', (saved ?? preferred) === 'dark');

// 토글 시
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}
```

- Tailwind `dark:` 변형 클래스를 모든 컴포넌트에 적용한다.
- `darkMode: 'class'` 설정 필수 (Tailwind config).

---

## 의존성 추가 시 기재 양식

```
### [라이브러리명] vX.X.X
- 도입 목적:
- 대안 검토:
- 결정 근거:
- 추가 일자:
```

---

## 도입된 의존성

### dayjs (CDN)
- 도입 목적: `created_at` 상대 시각 표시 ("3분 전", "어제" 등). 수동 계산 대비 간결하고 i18n 지원
- 대안 검토: `date-fns` (트리쉐이킹 좋지만 번들러 필요), `luxon` (용량 큼), 수동 구현 (반복 코드)
- 결정 근거: CDN 한 줄로 추가 가능, 번들러 없는 Vanilla JS 환경에 적합, 용량 경량
- 추가 일자: 2026-05-14
