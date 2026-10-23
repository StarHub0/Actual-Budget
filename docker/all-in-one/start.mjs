import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { processEnvironments } from "./config.mjs";

const envs = processEnvironments(process.env);
const entry = ["/app/app.js", "/app/build/app.js"].find(existsSync);
if (!entry) throw new Error("Actual entrypoint not found in the base image.");

const children = new Set();
let stopping = false;
let forceTimer;

function shutdown(code) {
    if (stopping) return;
    stopping = true;
    process.exitCode = code;
    for (const child of children) child.kill("SIGTERM");
    if (children.size) {
        forceTimer = setTimeout(() => {
            for (const child of children) child.kill("SIGKILL");
        }, 10000);
    }
}

function launch(name, file, cwd, env) {
    const child = spawn(process.execPath, [file], { cwd, env, stdio: "inherit" });
    children.add(child);
    child.once("error", (error) => {
        console.error(`[actual-tweaks] ${name}: ${error.message}`);
        children.delete(child);
        shutdown(1);
    });
    child.once("exit", (code, signal) => {
        children.delete(child);
        if (!stopping) {
            console.error(`[actual-tweaks] ${name} exited (${signal || code}); restarting the whole service is required.`);
            shutdown(1);
        }
        if (!children.size && forceTimer) clearTimeout(forceTimer);
    });
}

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

console.log(`[actual-tweaks] Public port ${envs.tweaks.PORT}; Actual is internal at 127.0.0.1:5006.`);
launch("Actual", entry, "/app", envs.actual);
launch("Tweaks", "/opt/abt/server.js", "/opt/abt", envs.tweaks);
