# 构建阶段
FROM node:20-alpine AS builder

# 1. 设置国内镜像源加速 APK 安装
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 2. 安装编译工具（精简版）
RUN apk add --no-cache --virtual .build-deps \
    python3 \
    make \
    g++

# 3. 启用 corepack 并设置 pnpm 版本
RUN corepack enable && corepack prepare pnpm@8.15.6 --activate

RUN pnpm config set registry https://registry.npmmirror.com

# 4. 设置工作目录
WORKDIR /app

# 5. 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 6. 关键修复：添加详细的调试信息
RUN \
    echo "当前目录内容:" && ls -la && \
    echo "PNPM 版本:" && pnpm -v && \
    echo "Node 版本:" && node -v && \
    echo "开始安装依赖..." && \
    pnpm install --reporter append-only || \
    ( \
        echo "依赖安装失败！错误信息如下:" && \
        cat $(find /root/.local/share/pnpm/store -name debug.log -print -quit) && \
        echo "Lockfile 内容:" && \
        cat pnpm-lock.yaml && \
        echo "package.json 内容:" && \
        cat package.json && \
        exit 1 \
    )

# 7. 复制源代码
COPY . .

# 8. 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine

# 1. 启用 corepack
RUN corepack enable

# 2. 设置工作目录
WORKDIR /app

# 3. 复制构建产物
COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# 4. 暴露端口
EXPOSE 3000

# 5. 启动应用
CMD ["pnpm", "start:prod"]