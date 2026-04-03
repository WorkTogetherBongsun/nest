# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# 빌드할 앱 이름을 외부 인자(ARG)로 받음 (기본값 설정)
ARG APP_NAME=mesapphub
ENV APP_NAME=${APP_NAME}

# 패키지 매니저 파일 복사 및 설치 (캐시 활용)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
# 지정된 앱만 선택적으로 빌드
RUN npx nest build ${APP_NAME}

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app
ARG APP_NAME=mesapphub
ENV APP_NAME=${APP_NAME}

# 프로덕션 의존성만 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# builder에서 빌드된 특정 앱의 결과물만 복사
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}

# EXPOSE는 문서화 용도로, 현재 각 앱에 할당된 3개의 포트를 모두 적어둡니다.
EXPOSE 5107 5108 5109
# 선택된 앱 실행 (명령어는 환경변수가 반영된 런타임 셸 실행)
CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main"]
