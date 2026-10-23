import assert from "node:assert/strict";
import test from "node:test";
import { processEnvironments } from "./config.mjs";

test("Actual and Tweaks use separate ports and local HTTP, even with stale Railway variables", () => {
    const env = { PORT: "8080", ACTUAL_PORT: "8080", ACTUAL_ORIGIN: "https://old.example.com", ACTUAL_HOSTNAME: "::", ACTUAL_USER_FILES: "/data/custom" };
    const config = processEnvironments(env);
    assert.equal(config.actual.PORT, "5006");
    assert.equal(config.actual.ACTUAL_PORT, "5006");
    assert.equal(config.actual.ACTUAL_HOSTNAME, "127.0.0.1");
    assert.equal(config.actual.ACTUAL_USER_FILES, "/data/custom");
    assert.equal(config.tweaks.PORT, "8080");
    assert.equal(config.tweaks.ACTUAL_ORIGIN, "http://127.0.0.1:5006");
    assert.equal(env.ACTUAL_ORIGIN, "https://old.example.com");
});

test("defaults work without Railway-specific settings", () => {
    assert.equal(processEnvironments({}).tweaks.PORT, "3005");
});

test("invalid public ports and conflicts fail before starting services", () => {
    for (const port of ["5006", "0", "65536", "-1", "abc", "3.5"]) {
        assert.throws(() => processEnvironments({ PORT: port }), /PORT must/);
    }
});
