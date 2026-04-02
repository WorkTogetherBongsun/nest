# OMS Monorepo Workspace (mesapphub)

본 프로젝트는 `mesapphub`를 비롯한 여러 서비스(OMS API, Intos 등)를 단일 코드베이스에서 관리하고 확장하기 위해 구축된 **NestJS 모노레포(Monorepo)** 프로젝트입니다.

---

## 📚 프로젝트 정책 및 아키텍처 가이드 (DOCS)

본 프로젝트의 아키텍처 규칙과 개발 환경 설정은 `DOCS/` 폴더 내에 잘 정리되어 있습니다. 개발 전에 반드시 아래의 문서를 확인해 주세요!

1. [06. 로컬 환경 및 도커(회사망 분리) 데이터베이스 설정 가이드](./DOCS/6-local_development_setup.md) 🌟 **(Updated!)**
2. [02. 모노레포 아키텍처 설계 배경 및 구조](./DOCS/1-monorepo-architecture.md)
3. [03. 계층형 아키텍처 (Layered Architecture)](./DOCS/2-layered-architecture.md)
4. [04. Swagger API 자동화 연동](./DOCS/3-swagger-api-docs.md)
5. [05. 중앙 집중식 Winston 로깅 체계](./DOCS/4-winston-logging.md)
6. [06. 로컬 및 운영 환경 변수 자동 분기 (`@nestjs/config`)](./DOCS/5-environment-config.md)

---

## 🚀 빠른 시작 가이드 (Quick Start)

본 프로젝트는 회사망(도커 실행 불가)과 개인 로컬망(도커 실행)을 원활하게 분리하여 동작하도록 설계되었습니다.

### 1. 패키지 설치
```bash
npm install
```

### 2. 서버 실행하기 (선택)

**✅ 시나리오 A: 회사에서 작업할 때 (도커 없음)**
```bash
# 순수하게 NestJS 서버만 구동 (DB는 회사의 테스트/사내 로컬 DB를 바라봅니다)
npm run start:dev
```

**✅ 시나리오 B: 개인망에서 작업할 때 (도커 DB 필요)**
```bash
# PostgreSQL 도커 컨테이너를 함께 구동시키고 NestJS를 켭니다. 
# 구동 중 터미널에서 Ctrl + C를 누르면 깨끗하게 한 번에 같이 종료됩니다.
npm run start:dev:docker
```

---

*본 README는 기본적인 NestJS Starter 템플릿에서 mesapphub 프로젝트 전용 안내문으로 업데이트 되었습니다.*
