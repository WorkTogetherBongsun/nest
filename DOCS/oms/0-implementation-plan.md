# OMS Binance 트레이딩 API 연동 계획 (ccxt)

*해당 문서는 실제 개발 전 시스템 아키텍트를 위해 수립되었던 역사 보존용 계획서(Implementation Plan)입니다.*

## 1. 목표
`oms-api` 앱 내부에서 암호화폐 통합 라이브러리인 [`ccxt`](https://github.com/ccxt/ccxt)를 활용하여 글로벌 1위 거래소인 **바이낸스(Binance)**와 통신하고, 잔고 조회 및 자동 매매주문을 실행할 수 있는 핵심 API 백엔드를 구축합니다.

---

## 2. 개발 및 적용 시나리오 (Proposed Changes)

### 1) 패키지 의존성 설치
- **`ccxt`**: 암호화폐 거래소 통신 전용 표준화 라이브러리 (NPM 설치).

### 2) Exchange 모듈 구조화 (oms-api)
시스템 대외 API 역할을 하므로, 거래소 통신을 전담하는 `exchange` 도메인 폴더를 신규 생성.

#### `apps/oms-api/src/exchange/exchange.module.ts`
- ccxt 비지니스 로직들을 캡슐화한 NestJS 전용 모듈화 작업.

#### `apps/oms-api/src/exchange/exchange.service.ts`
- **인스턴스 초기화**: `ConfigService`로부터 API 키를 수급해 `new ccxt.binance({ ... })` 객체를 싱글톤으로 생성.
- **주요 기능 명세**:
  - `getBalance()`: 코인 잔고 조회 로직
  - `createOrder()`: 주문 타입, 방향, 수량을 조합해 주문 체결 구송.

#### `apps/oms-api/src/exchange/exchange.controller.ts`
- 외부 시스템이 찔러볼 수 있는 열린 문(Endpoint) 제공.
- 라우팅: `GET /exchange/balance` , `POST /exchange/order`

#### `apps/oms-api/src/exchange/dto/create-order.dto.ts`
- 악의적인 페이로드를 막고 타입 검사를 위한 전용 검증 스키마 클래스 생성.

### 3) 환경변수 파이프라인 방어
- `.env.development`에 `BINANCE_API_KEY`와 `BINANCE_SECRET_KEY` 빈칸(Mock Value)을 뚫어 시스템 순환 참조 에러 선제적 예방.

---

## 3. 검토되었던 보안 리스크 점검표
- **Question**: API 호출 접근 통제(Access Control) 여부.
- **방침**: 최초 구현 시점에는 빠른 개발 확인을 위해 컨트롤러의 인증 가드를 비우고, 프론트(또는 시스템)와의 통합 단계 때 JWT나 인증 레이어(AuthGuard)를 보강하여 외부인의 불법 매매 요청을 격리하기로 합의함.
