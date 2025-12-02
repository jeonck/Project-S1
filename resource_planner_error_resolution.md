# Resource Planner 오류 해결 내역

## 문제 발생

`리소스 플래너` 메뉴 진입 시, 다음과 같은 오류가 발생했습니다:

```
Uncaught ReferenceError: useData is not defined
    at ResourcePlanner (ResourcePlanner.jsx:5:71)
```

이 오류는 `ResourcePlanner.jsx` 컴포넌트 내에서 `useData` 훅이 정의되지 않았다는 것을 나타냅니다.

## 원인 분석

`src/pages/ResourcePlanner.jsx` 파일을 확인한 결과, `useData` 훅을 `../context/DataContext` 파일로부터 import 하는 구문이 누락되어 있었습니다. 컴포넌트 내부에서는 `useData()`를 호출하고 있었지만, 해당 훅이 스코프 내에 존재하지 않아 `ReferenceError`가 발생한 것입니다.

## 해결 방법

`src/pages/ResourcePlanner.jsx` 파일의 상단에 누락된 `useData` import 구문을 추가하여 `DataContext`에서 `useData` 훅을 가져오도록 수정했습니다.

**변경 전:**
```jsx
import React, { useState } from 'react';
import { FrappeGantt as Gantt, ViewMode } from "react-frappe-gantt";

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects, updateTask, updateProject } = useData();
  // ...
};
```

**변경 후:**
```jsx
import React, { useState } from 'react';
import { FrappeGantt as Gantt, ViewMode } from "react-frappe-gantt";
import { useData } from '../context/DataContext'; // 이 줄을 추가

const ResourcePlanner = () => {
  const { teamMembers, tasks, projects, updateTask, updateProject } = useData();
  // ...
};
```

이 변경으로 인해 `ResourcePlanner` 컴포넌트는 `useData` 훅을 올바르게 참조할 수 있게 되어 `ReferenceError`가 해결되었습니다.