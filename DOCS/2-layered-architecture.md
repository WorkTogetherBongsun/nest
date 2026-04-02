# 레이어드 아키텍처 (Layered Architecture & DIP)

## 개요
각 API 앱들의 도메인(예: `uses`, `members`)의 응집도를 높이고 추후 데이터베이스(PostgreSQL, MongoDB 등) 변경 시에도 비즈니스 로직(Service)의 수정이 없도록 하는 **3계층 구조와 의존성 역전 원칙(DIP)**을 채택했습니다.

## 계층의 분리 구조
NestJS의 정석적인 폴더 구조에 기반하여 아래와 같이 역할을 나눴습니다.

1. **프리젠테이션 계층 (Controller)**
   - `*.controller.ts` 파일.
   - HTTP 통신(`GET`, `POST`)과 응답(Response), 그리고 파라미터(`Param`, `Query`) 수령 임무만 전담합니다.
   
2. **비즈니스 계층 (Service)**
   - `*.service.ts` 파일.
   - HTTP 문맥(req, res)을 전혀 몰라야 하는 순수한 비즈니스 규칙(도메인 정책 검사, 핵심 흐름 판단)을 판단하는 "두뇌" 역할을 합니다.
   
3. **규약 인터페이스 계층 (Interfaces)**
   - `interfaces/i-*.repository.ts` 파일.
   - Service와 Repository를 끊어주는 완충재(인터페이스) 역할을 합니다.
   
4. **데이터 액세스 계층 (Repository)**
   - `*.repository.ts` 파일.
   - 직접적인 데이터베이스(`TypeORM`, 쿼리 빌더)에 접근하여 데이터를 퍼오거나 저장하는 등 실제 "손·발" 역할만을 수행합니다.

## DIP (의존성 역전 원칙) 적용
일반적으로 서비스(Service)가 리포지토리(Repository)에 직접 의존하면 결합력이 매우 높아지게 됩니다. 
이를 방지하기 위해 각 모듈(예: `MembersModule`) 안에서 `Provide`를 통해 **Symbol(Token)** 에 실제 파일(구현체)을 주입(`useClass`)하도록 설정했습니다.
이를 통해 향후 DB 기술 스택 스왑(Swap) 시 손상 없는 확장이 가능합니다.
