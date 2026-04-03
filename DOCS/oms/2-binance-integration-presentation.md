# [PPT 자료] OMS & Binance 자동매매 모듈 구축 및 트러블슈팅

본 문서는 사내 발표 또는 팀 리뷰 시 파워포인트(PPT)에 옮겨 적기 편하도록 "슬라이드 단위"로 핵심 텍스트를 요약해 둔 자료입니다.

---

## [Slide 1: 표지]
**제목**: OMS(Order Management System) 모듈 구축기
**부제**: 글로벌 가상화폐 거래소(Binance) API 연동 및 아키텍처 최적화
**발표자**: [본인 이름/팀명]

---

## [Slide 2: 프로젝트 목표 ও 주요 스택]
- **목표**: 
  - 자체 OMS 서버와 외부 거래소(Binance) 간의 실시간 자산 조회 및 자동 주문 파이프라인 구축.
- **주요 기술 스택**:
  - **Framework**: NestJS (모노레포 아키텍처)
  - **Library**: `CCXT` (글로벌 표준 암호화폐 거래 통합 라이브러리 채택)
- **개발된 주요 기능**:
  - `GET /exchange/balance` : 실시간 유효 자산 필터링 및 잔고 조회
  - `POST /exchange/order` : 지정가(limit)/시장가(market) 자동 매매 주문 실행

---

## [Slide 3: 이슈 #1 - 모노레포 빌드 경로 충돌 (MODULE_NOT_FOUND)]
- **문제 상황**: 
  - `oms-api` 앱을 단독으로 실행(`npm run start:dev -- oms-api`)했을 때 서버가 켜지지 않고 모듈을 찾을 수 없다는 치명적 에러 발생.
- **원인 분석**: 
  - 초기 모노레포 구조 세팅 시 남겨진 과거의 앱 이름(`nest-backend`)이 `oms-api`의 컴파일 설정 파일(`tsconfig.app.json`)에 잔재로 남아, 빌드 결과물이 엉뚱한 폴더로 추출됨.
- **해결 방안**:
  - `tsconfig.app.json`의 `outDir` 옵션을 `dist/apps/oms-api`로 정확히 타겟팅하여 라우팅 문제 완벽 해결.

---

## [Slide 4: 이슈 #2 - 로컬 테스트 통신 장애 (CORS & URL Scheme)]
- **문제 상황**: 
  - Swagger 및 프론트엔드 환경에서 API 직접 호출 시 `Failed to fetch` 에러 발생.
- **원인 분석**:
  1. 백엔드에 사전에 강력하게 세팅해 둔 보안 미들웨어(`Helmet`)가 크로스-도메인 스크립트를 방어(블락)함.
  2. 프론트엔드/테스트 툴에서 API 호출 시 통신 규약인 `http://` 접두사를 누락하여 발생.
- **해결 방안**:
  - 로컬 및 Swagger 환경을 배려하여 `shared-core`의 `helmet` 옵션 중 `crossOriginResourcePolicy`를 완화하는 예외 처리 적용.

---

## [Slide 5: 이슈 #3 - 바이낸스 접속 차단 (IP Whitelist)]
- **문제 상황**:
  - 로컬에서 기능 완벽 구동 확인 후 실제 API 키를 주입했을 때, 바이낸스 측에서 접근을 거부함.
- **원인 분석**:
  - 바이낸스 등 메이저 거래소의 API 환경은 보안을 위해 등록되지 않은 IP(가정용 유동 IP 등)의 접근을 방화벽단에서 차단함(Whitelist 정책).
- **해결 방안 (클라우드 도커 격리 배포)**:
  - **DOCKER MULTI-STAGE 빌드 활용**: 하나의 `Dockerfile`에서 `APP_NAME` 매개변수(`--build-arg APP_NAME=oms-api`)를 주입하여, `oms-api` 모듈만 가볍게 뜯어냄.
  - 이를 Vultr(클라우드 서버) 고정 IP 환경에 도커 컨테이너로 격리 배포한 뒤, 환경변수(`-e BINANCE_API_KEY=...`)를 주입하여 화이트리스트 검열 우회 및 실거래 관문 통과 성공.

---

## [Slide 6: 맺음말 및 향후 과제]
- **개발 성과**: 
  - 단일 레포지토리 내에서 다른 앱(mesapphub)에 영향을 주지 않고 성공적으로 마이크로서비스(oms-api)를 구축, 빌드, 배포하는 모노레포 파이프라인의 실효성 증명.
- **Next Step**:
  - 내부 로컬망 개발 시 안전한 **테스트넷(Sandbox) 모드 적용 고도화**
  - 자금이 오가는 `POST /order` 엔드포인트에 대한 **사내 AD JWT 인증 방어벽(AuthGuard)** 연동 적용.
