import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { htmlToMarkdown } from "./markdown.js";

describe("htmlToMarkdown", () => {
  it("strips tags and keeps text", () => {
    const md = htmlToMarkdown("<p>Hello <strong>world</strong></p>");
    assert.match(md, /Hello/);
    assert.match(md, /world/);
    assert.equal(md.includes("<"), false);
  });
});
