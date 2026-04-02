# 환경 변수 및 컨피그 팩토리 (@nestjs/config)

## 개요
로컬 개발 환경(`.env` 파일 제어)과 `staging`/`production`(K8s Kustomize의 직접 env 주입)의 배포 환경을 지능적으로 병행하여 운영할 수 있도록 NestJS 공식 모듈인 `@nestjs/config`를 도입했습니다.

## 핵심 분기 로직 지원
각 앱의 루트 모듈(`app.module.ts`, `oms-api.module.ts` 등)에서 **`ConfigModule`** 이 셋업될 때 현재 배포 노드 환경(`NODE_ENV`)을 동적으로 파악합니다.

```typescript
ConfigModule.forRoot({
  isGlobal: true, // 한 번 로드 시 모듈을 import 안해도 전역에서 주입 가능
  envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
  // ⭐️ 핵심 기능: staging/production 환경일 경우 .env 텍스트 파일을 아예 읽지 않고 차단함.
  ignoreEnvFile: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
})
```

## 동작 시나리오 비교
1. **[로컬 (개발 환경)]**  
   - K8s의 터치가 없는 로컬에선 `NODE_ENV`가 없거나 `development` 입니다. 
   - 따라서 `.env.development`라는 파일 안에서 데이터베이스 주소, JWT 시크릿 등을 꺼내와 작동시킵니다.
   - 💡 **[추가 사항]** 포트 30012번 개방 및 `npm run start:dev:docker` 실행 시 등 도커 연동 사항은 [6-local_development_setup.md](./6-local_development_setup.md) 를 참고해 주세요.
   
2. **[서버 배포 (K8s Kustomize 환경)]**  
   - 파드(Pod)에서 직접 메모리 환경 변수(`env` key)를 내려꽂으므로 텍스트 파일 로드를 건너뜁니다.
   - 쿠버네티스의 `Secret`이나 `ConfigMap`을 온전히 신뢰하여 매우 보안상 안전한 설정이 가능해집니다.

### 사용법 요약
모든 서비스(Service) 파일에서 `import { ConfigService }`을 생성자에 주입받은 후 `this.configService.get<string>('DB_URL')`의 형태로 안전하게 환경 변수를 꺼내와 앱의 모든 동작을 제어합니다.
