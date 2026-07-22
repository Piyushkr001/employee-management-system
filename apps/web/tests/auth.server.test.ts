import { expect, test, describe, mock, spyOn, beforeEach, afterEach } from "bun:test";
import { getCurrentUserServer } from "../features/auth/auth.server";
import * as nextHeaders from "next/headers";
import * as nextNavigation from "next/navigation";
import * as apiUtils from "../lib/api-utils";

describe("getCurrentUserServer", () => {
  let fetchMock: ReturnType<typeof spyOn>;
  let redirectMock: ReturnType<typeof spyOn>;
  let cookiesMock: ReturnType<typeof spyOn>;

  beforeEach(() => {
    cookiesMock = spyOn(nextHeaders, "cookies").mockImplementation(async () => {
      return {
        get: () => ({ value: "test-token" })
      } as any;
    });

    redirectMock = spyOn(nextNavigation, "redirect").mockImplementation((url: string) => {
      throw new Error(`REDIRECT_TO_${url}`);
    });

    spyOn(apiUtils, "getInternalApiUrl").mockReturnValue("http://localhost:5001/api");
    
    fetchMock = spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    mock.restore();
  });

  test("returns null on 401", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 401,
      ok: false,
    } as any);

    const user = await getCurrentUserServer();
    expect(user).toBeNull();
  });

  test("redirects to inactive on 403 with ACCOUNT_INACTIVE", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 403,
      ok: false,
      json: async () => ({ error: { code: "ACCOUNT_INACTIVE" } })
    } as any);

    expect(getCurrentUserServer()).rejects.toThrow("REDIRECT_TO_/login?reason=inactive");
  });

  test("redirects to unauthorized on 403 FORBIDDEN", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 403,
      ok: false,
      json: async () => ({ error: { code: "FORBIDDEN" } })
    } as any);

    expect(getCurrentUserServer()).rejects.toThrow("REDIRECT_TO_/unauthorized");
  });

  test("throws on 500", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 500,
      ok: false,
    } as any);

    expect(getCurrentUserServer()).rejects.toThrow("Authentication service is unavailable");
  });

  test("throws on 503", async () => {
    fetchMock.mockResolvedValueOnce({
      status: 503,
      ok: false,
    } as any);

    expect(getCurrentUserServer()).rejects.toThrow("Authentication service is unavailable");
  });
});
