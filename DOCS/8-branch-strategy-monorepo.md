# 모노레포 앱별 브랜치 및 배포 전략 (App-Specific Branch Strategy)

본 프로젝트는 단일 저장소(Monorepo) 내에 여러 애플리케이션(`mesapphub`, `oms-api`, `intos-api`)이 공존하므로, 각 앱의 개발 및 배포 생명주기를 독립적으로 관리하기 위해 **앱 단위 브랜치 전략**을 채택합니다.

---

## 1. 브랜치 명명 규칙 (Branch Naming Convention)

모든 브랜치는 해당 브랜치가 영향을 주는 앱의 이름을 접두어로 사용합니다.

- **개발 브랜치 (Development)**: `dev/{app-name}`
  - 예: `dev/mesapphub`, `dev/oms-api`, `dev/intos-api`
  - 각 앱의 최신 개발 코드가 통합되는 곳입니다.
- **배포 브랜치 (Main/Production)**: `main/{app-name}`
  - 예: `main/mesapphub`, `main/oms-api`, `main/intos-api`
  - 실제 서버에 배포되는 안정적인 상태의 코드입니다.
- **기능 브랜치 (Feature)**: `feature/{app-name}/{task-name}`
  - 예: `feature/mesapphub/login-api`
  - 특정 기능을 개발할 때 사용하며, 개발 완료 후 `dev/{app-name}`으로 병합합니다.

---

## 2. CI/CD 자동화 연동 (Path-Filtering)

각 앱의 브랜치에 코드가 푸시될 때, 해당 앱과 관련된 빌드만 실행되도록 GitHub Actions에 **경로 필터링(Path Filtering)**을 적용합니다.

### 작업 흐름 (Workflow)
1. 사용자가 `dev/mesapphub` 브랜치에 푸시합니다.
2. GitHub Actions가 파일 변경 경로를 확인합니다:
   - `apps/mesapphub/**` 또는 `libs/**` 에 변경이 있는 경우에만 `mesapphub`용 도커 빌드를 시작합니다.
   - 다른 앱(`oms-api`, `intos-api`)의 워크플로우는 실행되지 않습니다.
3. 빌드된 이미지는 해당 앱 전용 태그와 함께 레지스트리에 업로드됩니다.
   - 예: `mesapphub:1.0.0-dev`

---

## 3. 앱별 배포 주기 관리

이 전략의 가장 큰 장점은 **앱별 독립 배포**가 가능하다는 점입니다.

- `mesapphub`의 버그 수정이 완료되어 배포가 필요할 때, `oms-api`의 진행 상황과 상관없이 `dev/mesapphub` -> `main/mesapphub` 병합 만으로 배포를 완료할 수 있습니다.
- 공용 라이브러리(`libs/shared-core`) 수정 시에는 해당 라이브러리를 참조하는 모든 앱의 브랜치를 체크하여 일괄 업데이트하거나 순차적으로 병합을 진행합니다.

---

## 4. GitHub Actions 설정 예시 (참고)

```yaml
on:
  push:
    branches:
      - main/mesapphub
    paths:
      - 'apps/mesapphub/**'
      - 'libs/**'
      - 'package.json'
```

위와 같이 설정하면 `main/mesapphub` 브랜치에 푸시가 발생하고, 실제로 `mesapphub` 앱이나 공용 라이브러리에 변화가 있을 때만 배포가 트리거됩니다.
