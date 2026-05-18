import { describe, expect, it } from "vitest";
import {
  isMyContentRepository,
  shouldUseClientMcqPagination,
} from "./studyPlanNavigation";

describe("isMyContentRepository", () => {
  it("treats undefined as bank", () => {
    expect(isMyContentRepository(undefined)).toBe(false);
  });
  it("recognizes my_content", () => {
    expect(isMyContentRepository("my_content")).toBe(true);
    expect(isMyContentRepository("bank")).toBe(false);
  });
});

describe("shouldUseClientMcqPagination", () => {
  it("matches my_content only", () => {
    expect(shouldUseClientMcqPagination("my_content")).toBe(true);
    expect(shouldUseClientMcqPagination("bank")).toBe(false);
  });
});
