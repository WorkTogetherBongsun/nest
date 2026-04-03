# OMS Binance 트레이딩 API 구축 완료 스펙업 및 가이드

`oms-api` 앱은 Order Management System으로서 글로벌 거래소의 데이터를 수집하고 자동 주문을 통합/실행하는 백엔드 서버입니다.
본 문서는 그 첫 단계로 도입된 **바이낸스(Binance) `ccxt` 거래소 통신 모듈**의 구조와 사용법을 안내합니다.

---

## 1. 사용된 기술 스택 및 라이브러리
- **`ccxt`**: 암호화폐 거래소를 통합해주는 글로벌 표준 라이브러리를 사용하여, 여러 거래소(바이낸스, 업비트 등)를 연동할 때도 코드가 바뀌지 않도록 일원화된 인터페이스를 채택했습니다.
- **NestJS 모듈 아키텍처 (`apps/oms-api/src/exchange`)**
  - **`exchange.service`**: 백엔드 시스템과 바이낸스의 실질적인 API 통신을 전담.
  - **`exchange.controller`**: 외부 시스템이 OMS API를 통해 주문을 날릴 수 있도록 HTTP 라우터 오픈.
  - **`CreateOrderDto`**: 주문 패킷의 검증(Validation) 및 스웨거(Swagger) 문서화.

---

## 2. 안정성(Safety) 장치 구성 설계

1. **테스트망(Sandbox) 강제 라우팅**
   `exchange.service.ts` 내부에는 현재 서버의 개발 환경(`NODE_ENV`)이 `development`일 경우, `this.binance.setSandboxMode(true)` 옵션이 자동으로 켜지도록 설계해두었습니다. 따라서 개발 중 실수로 진짜 돈이 빠져나가는 대형 사고를 원천 차단합니다.
   
2. **Key 하드코딩 방지**
   `BINANCE_API_KEY`와 `BINANCE_SECRET_KEY`는 절대로 파일에 직접 기록되지 않으며, 실행 시점에 `.env` 파일과 시스템 메모리(K8s ConfigMap)에서만 퍼올리도록 `@nestjs/config`에 의존합니다.

---

## 3. 엔드포인트(API) 명세 레퍼런스

### 1) 자산 잔고 조회 (`GET /exchange/balance`)
연결된 바이낸스 계좌에서 '현재 내가 쥐고 있는 쓸모있는 코인'만 가져옵니다.
- **로직 특징**: 전체 쓰레기 코인 명단이 넘어오는 것을 막기 위해 0 미만의 잔고(dust)는 백엔드 선에서 필터링한 후 응답합니다.

### 2) 통합 주문 실행 (`POST /exchange/order`)
원하는 심볼의 코인을 시장가/지정가로 사거나 팔도록 명령합니다.
- **요청 데이터(Body)**:
  ```json
  {
    "symbol": "BTC/USDT", // 코인/기축통화
    "type": "limit", // 지정가(limit) vs 시장가(market)
    "side": "buy", // 사기(buy) vs 팔기(sell)
    "amount": 0.5, // 갯수
    "price": 95000 // 지정가의 경우 필수
  }
  ```
- **응답 페이로드**: 거래 성공 시 거래소가 반환하는 주문 체결 고유(`orderId`) 및 성공 여부가 리턴됩니다.
