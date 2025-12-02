# 오류 해결 과정 요약

이 문서는 프로젝트에서 발생한 일련의 오류와 해결 과정을 요약합니다.

## 초기 문제: 오래된 의존성 및 다수의 취약점

`npm install` 실행 시, 수많은 의존성 경고(deprecation warnings)와 173개의 보안 취약점(vulnerabilities)이 보고되었습니다.

### 1차 해결 시도

`npm audit fix` 명령을 실행했으나, 대부분의 취약점이 해결되지 않았습니다.

### 2차 해결 시도: 의존성 강제 업데이트

`npm audit fix --force` 명령을 실행하여 모든 취약점을 해결했습니다. 이 과정에서 `vite`, `frappe-gantt-react` 등 여러 패키지가 새로운 메이저 버전으로 강제 업데이트되었습니다.

## 후속 문제: 깨진 의존성으로 인한 빌드 실패

강제 업데이트 이후, `npm run dev` 실행 시 다양한 오류가 발생했습니다.

### 문제 1: `frappe-gantt-react` 컴포넌트 경로 오류

- **오류 내용**: `Failed to resolve import "frappe-gantt-react/src/FrappeGantt"`
- **원인**: `frappe-gantt-react` 패키지가 업데이트되면서 내부 모듈 경로가 변경되었습니다.
- **해결**: `src/pages/ResourcePlanner.jsx` 파일에서 `FrappeGantt` 컴포넌트의 import 경로를 패키지의 루트(`"frappe-gantt-react"`)로 수정했습니다.

### 문제 2: `frappe-gantt` CSS 파일 경로 오류

- **오류 내용**: `Failed to resolve import "frappe-gantt/dist/frappe-gantt.css"`
- **원인**: `frappe-gantt` 라이브러리의 CSS 파일 경로 또한 유효하지 않게 되었습니다.
- **해결**: `react-frappe-gantt` 같은 최신 래퍼(wrapper) 라이브러리는 필요한 CSS를 자체적으로 포함하는 경우가 많다고 가정하고, 문제가 되는 CSS import 구문을 `ResourcePlanner.jsx`에서 제거했습니다.

### 문제 3: `ViewMode` import 경로 오류

- **오류 내용**: 이전 오류들을 해결한 후에도 `500 Internal Server Error`가 발생했습니다.
- **원인**: `ResourcePlanner.jsx` 파일을 다시 확인한 결과, `ViewMode` 역시 잘못된 내부 경로(`'frappe-gantt-react/src/ViewMode'`)로 import 되고 있었습니다.
- **해결**: `ViewMode`의 import 경로 또한 패키지 루트로 수정했습니다.

### 문제 4: Vite 캐시 문제

- **오류 내용**: `504 (Outdated Optimize Dep)`
- **원인**: 의존성이 계속 변경되면서 Vite의 의존성 캐시가 오래되어 발생한 문제였습니다.
- **해결**: `rm -rf node_modules/.vite` 명령으로 Vite 캐시를 삭제하고 `npm install`을 다시 실행했습니다.

### 문제 5: `frappe-gantt-react` 패키지 자체의 결함

- **오류 내용**: `Could not resolve "./dist/manifest"`
- **원인**: `frappe-gantt-react@0.0.8` 패키지의 메인 파일(`index.js`)이 존재하지 않는 `dist` 폴더의 파일들을 참조하고 있었습니다. 즉, npm에 배포된 패키지 자체가 손상된 상태였습니다.

## 최종 해결: 라이브러리 교체

`frappe-gantt-react`가 더 이상 안정적으로 유지보수되지 않는다고 판단하여 대체 라이브러리를 찾았습니다.

1.  **대체 라이브러리 `react-frappe-gantt` 설치**: 기존의 불안정한 `frappe-gantt-react`를 제거하고, 더 활발히 유지보수되는 `react-frappe-gantt`를 설치했습니다.
    ```bash
    npm uninstall frappe-gantt-react
    npm install react-frappe-gantt
    ```
2.  **import 구문 수정**: `ResourcePlanner.jsx`의 import 구문을 새로운 패키지 이름(`react-frappe-gantt`)으로 모두 수정했습니다.
3.  **Vite 캐시 정리 및 재실행**: 마지막으로 Vite 캐시를 다시 한번 정리하고 개발 서버를 시작하여 모든 문제를 해결했습니다.
