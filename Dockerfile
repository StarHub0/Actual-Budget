# Build the Tweaks UI from this fork.
FROM --platform=$BUILDPLATFORM node:22-alpine AS tweaks
WORKDIR /repo
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile && pnpm build

# Keep Actual's native modules and runtime together.
FROM actualbudget/actual-server:26.10.0
LABEL org.opencontainers.image.source="https://github.com/StarHub0/Actual-Budget"
LABEL org.opencontainers.image.description="Actual Budget with Actual Budget Tweaks in one service"
USER root
COPY --from=tweaks /repo/.output/chrome-mv3 /opt/abt/assets
COPY --from=tweaks /repo/docker/server.js /repo/docker/browser-shim.js /repo/package.json /opt/abt/
COPY --from=tweaks /repo/LICENSE /opt/abt/LICENSE
COPY docker/all-in-one/ /opt/actual-tweaks/
ENV PORT=3005 \
    ACTUAL_DATA_DIR=/data \
    ACTUAL_SERVER_FILES=/data/server-files \
    ACTUAL_USER_FILES=/data/user-files
EXPOSE 3005
VOLUME ["/data"]
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=3 \
    CMD ["node", "/opt/actual-tweaks/healthcheck.mjs"]
# Retain the official image's tini entrypoint for signal forwarding/reaping.
CMD ["node", "/opt/actual-tweaks/start.mjs"]
