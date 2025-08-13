# 构建阶段
FROM node:20-alpine AS builder

# 安装pnpm（指定版本可提高稳定性）
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# 复制pnpm依赖配置文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用frozen-lockfile确保依赖版本一致）
RUN pnpm install --prod --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine

# 安装pnpm（生产环境可能需要执行pnpm命令）
RUN npm install -g pnpm@8.15.6

WORKDIR /app

# 从构建阶段复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# 暴露应用端口
EXPOSE 3000

# 启动应用（使用pnpm执行生产启动命令）
CMD ["pnpm", "start:prod"]
