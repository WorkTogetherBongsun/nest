# 로컬 개발 환경 데이터베이스 설정 가이드 (Local Development DB Setup)

본 문서는 로컬 개발 환경에서 PostgreSQL 데이터베이스를 도커(Docker) 기반으로 띄우고, 이를 NestJS 애플리케이션과 원활하게 연동하기 위해 진행된 설정 내역을 요약한 문서입니다.

---

## 1. 개요 및 DB 접속 정보
회사와 로컬 환경을 분리 운영하며, 로컬에서는 `docker-compose`를 제어할 수 있도록 **선택적 자동화 파이프라인(`concurrently` 도입)**을 구축했습니다. 회사 컴퓨터등 도커를 쓸 수 없는 환경을 위해 기본 명령어와 분리되어 있습니다.

- **목표 컨테이너**: PostgreSQL 15 (`mesapphub-pg`)
- **DBMS 종류**: PostgreSQL
- **Database Name**: `mesapphub`
- **Username**: `mesappdba` (변경됨)
- **Password**: `mesdba@@`
- **도커 포트포워딩**: `30012` -> `5432` (로컬 데몬 충돌 회피용)
- **초기 생성 테이블**: `member` 

---

## 2. 주요 설정 파일 및 변경 내역 요약

### 1) `docker-compose.yml`
도커 컴포즈(Docker Compose)를 사용하여 디비 컨테이너를 구동합니다.
- **접속 정보**: `POSTGRES_USER=mesappdba`, 외부 포트 `30012`번을 개방했습니다.
- **초기 볼륨 연결**: `init.sql` 마운트로 초기 `member` 스키마 구성. 
- **데이터 보존**: `mesapphub-pg-data` 볼륨으로 영속성 부여.

### 2) `.env.development`
로컬 및 도커 연결 전용 환경변수입니다. 
- 설정 항목: `DB_USER=mesappdba`, `DB_PASSWORD=mesdba@@`, `DB_PORT=30012`, `DB_NAME=mesapphub`

### 3) `setup.ts` (구동 시 환경변수 모니터링)
올바른 DB로 연결되었는지 혼선을 막기 위해 서버 가동 시 NestJS 콘솔에 현재 물고 있는 DB 계정 및 포트 정보가 리포트되도록 `Logger`를 추가했습니다.

### 4) `package.json` 자동화 및 분리 정책 (중요)
회사 환경(도커 미사용)과 개인 로컬(도커 사용) 환경을 강제 충돌 없이 운영하기 위해 실행 스크립트를 분리했습니다. 여기서 두 환경의 생명주기 관리를 위해 **`concurrently` 모듈**을 도입했습니다.

📌 **`concurrently` 패키지의 역할과 도입 이유**
- **동시 병렬 실행 보장**: 서로 다른 두 개의 명령어(`docker-compose up`과 `nest start`)를 OS에 구애받지 않고 포그라운드에서 동시에 실행시켜 줍니다.
- **Graceful Shutdown (우아한 종료)**: 로컬 터미널에서 `Ctrl + C`로 서버를 종료할 때, `concurrently`의 `-k`(--kill-others) 옵션이 작동하여 NestJS와 Docker 컨테이너 둘 모두에게 동시에 **종료 시그널(SIGINT)을 전달**합니다. 이로 인해 도커 컨테이너가 고아 프로세스로 살아서 뒷단에 남는 현상을 깔끔하게 방지합니다.
- **통합 로깅**: 도커의 로그와 NestJS의 로그를 `[Docker]`, `[NestJS]`라는 이름표와 색상으로 구분하여 하나의 터미널 창에 보기 좋게 합쳐줍니다.

- **[로컬 도커 사용 안할 때 (회사용)]**: 
  - `npm run start:dev`: 순수 NestJS 서버만 백그라운드 작업 없이 켭니다. 
- **[로컬 도커 함께 켤 때 (개인 로컬용)]**:
  - `npm run start:dev:docker`: `concurrently` 모듈이 작동해 도커와 NestJS가 묶여서 실행됩니다. `Ctrl + C` 로 끌 때 DB도 깔끔하게 같이 죽습니다.

---

## 3. 실행 방법 및 관리 명령어 가이드

- **[회사 환경] NestJS만 단독 실행하기**:
  ```bash
  npm run start:dev
  ```

- **[개인 환경] 묶음 모드(도커 + 서버 한 번에 켜기/끄기)**:
  ```bash
  npm run start:dev:docker
  ```
  > 구동 중에 `Ctrl + C` 입력 시 서버와 DB(도커 컨테이너)가 Graceful Shutdown 됩니다.

- **데이터베이스를 완전히 깡통으로 초기화하고 싶을 때 (위험)**:
  계정이나 테이블 데이터가 꼬여서 새로 갈아엎고 싶을 때는 볼륨을 파괴해야 합니다:
  ```bash
  npm run docker:down -v
  ```
