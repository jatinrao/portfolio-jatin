import { describe, it, expect, vi, afterEach } from "vitest";
import { InMemoryCache } from "@/lib/resume/cache";

describe("InMemoryCache", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined for a key that was never set", async () => {
    const cache = new InMemoryCache<string>();
    expect(await cache.get("missing")).toBeUndefined();
  });

  it("returns a value before its TTL elapses", async () => {
    const cache = new InMemoryCache<string>();
    await cache.set("key", "value", 1000);
    expect(await cache.get("key")).toBe("value");
  });

  it("expires a value once its TTL has elapsed", async () => {
    vi.useFakeTimers();
    const cache = new InMemoryCache<string>();
    await cache.set("key", "value", 1000);
    vi.advanceTimersByTime(1001);
    expect(await cache.get("key")).toBeUndefined();
  });

  it("delete removes a value immediately", async () => {
    const cache = new InMemoryCache<string>();
    await cache.set("key", "value", 60_000);
    await cache.delete("key");
    expect(await cache.get("key")).toBeUndefined();
  });
});
