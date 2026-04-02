# Swagger 연동 가이드 및 자동 리다이렉트 (Swagger UI)

## 개요
모든 API 앱은 `configureSharedCore`를 통해 부트스트랩 단계에서 강력한 **Swagger Document**를 자동으로 탑재받습니다. API 문서 관리의 번거로움을 위해 별도의 페이지를 찾지 않도록, 개발 및 QA의 편의성을 위한 라우트 리다이렉션을 지원합니다.

## 주요 특징
- **Auto Redirect:** 애플리케이션의 루트 URL (`GET /`)에 접속하면 즉시 `@Redirect('/swagger', 302)` 기능을 통해 문서를 띄워줍니다.
- **문서 최적화:** 루트 URL 리다이렉트를 담당하는 엔드포인트 자체는 문서(Swagger UI)에 등장하지 않도록 `@ApiExcludeEndpoint()` 데코레이터를 붙여 목록에서 숨겼습니다.
- **App 템플릿:** 각 앱별 `main.ts` 설정에 따라 문서의 제목(`Title`)과 설명(`Description`)이 각각 `mesapphub`, `oms-api`, `intos-api`의 성격에 맞게 동적으로 반영됩니다.
