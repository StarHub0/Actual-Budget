export function processEnvironments(env) {
    const port = Number(env.PORT || 3005);
    if (!Number.isInteger(port) || port < 1 || port > 65535 || port === 5006) {
        throw new Error("PORT must be 1..65535 and different from Actual's internal port 5006.");
    }
    return {
        actual: {
            ...env,
            PORT: "5006",
            ACTUAL_PORT: "5006",
            ACTUAL_HOSTNAME: "127.0.0.1",
            ACTUAL_TRUSTED_PROXIES: env.ACTUAL_TRUSTED_PROXIES || "127.0.0.1/32,::1/128",
        },
        tweaks: {
            ...env,
            PORT: String(port),
            ACTUAL_ORIGIN: "http://127.0.0.1:5006",
            ASSETS_DIR: "/opt/abt/assets",
            PACKAGE_JSON_PATH: "/opt/abt/package.json",
        },
    };
}
