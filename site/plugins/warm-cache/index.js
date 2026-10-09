module.exports = {
  async onSuccess() {
    const { warmCache } = await import("../../scripts/warm-cache.mjs");
    await warmCache();
  },
};
