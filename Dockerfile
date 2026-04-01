# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# 패키지 매니저 파일 복사 및 설치 (캐시 활용)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# 프로덕션 의존성만 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 빌드 내용 복사
COPY --from=builder /app/dist ./dist

EXPOSE 5107

# 앱 실행
CMD ["npm", "run", "start:prod"]
