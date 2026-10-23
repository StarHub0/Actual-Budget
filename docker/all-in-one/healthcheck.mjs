const origin = `http://127.0.0.1:${process.env.PORT || 3005}`;
try {
    const page = await fetch(origin, { signal: AbortSignal.timeout(4000) });
    if (!page.ok || !(await page.text()).includes("/abt/browser-shim.js")) {
        throw new Error("Actual page or Tweaks injection is unavailable");
    }
    const asset = await fetch(origin + "/abt/content-scripts/content.js", {
        signal: AbortSignal.timeout(4000),
    });
    if (!asset.ok) throw new Error("Tweaks assets are unavailable");
    await asset.body.cancel();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
