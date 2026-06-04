export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("node:dns");
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log("[instrumentation] DNS servers set:", dns.getServers());
  }
}
