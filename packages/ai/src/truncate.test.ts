import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { truncateMarkdown } from "./truncate.js";

describe("truncateMarkdown", () => {
  it("leaves short content unchanged", () => {
    const result = truncateMarkdown("hello", 100);
    assert.equal(result.truncated, false);
    assert.equal(result.coverageRatio, 1);
    assert.equal(result.markdown, "hello");
  });

  it("truncates long content and reports coverage", () => {
    const markdown = "a".repeat(1000);
    const result = truncateMarkdown(markdown, 100);
    assert.equal(result.truncated, true);
    assert.ok(result.markdown.length <= 100);
    assert.ok(result.coverageRatio < 1);
  });
});
