import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { findBannedPhrases } from "./banned-phrases.js";

describe("findBannedPhrases", () => {
  it("flags verdict language", () => {
    const hits = findBannedPhrases({
      summary: "This is fake news in our opinion.",
    });
    assert.ok(hits.length >= 1);
  });

  it("allows explainable AI signal language", () => {
    const hits = findBannedPhrases({
      summary:
        "High fluency with thin sourcing — worth checking primary evidence.",
      signals: {
        ai: {
          explanation: "Structure resembles generic templates; verify facts.",
        },
      },
    });
    assert.equal(hits.length, 0);
  });

  it("flags AI-generated verdicts", () => {
    const hits = findBannedPhrases({
      reasons: [{ summary: "This is AI-generated content." }],
    });
    assert.ok(hits.length >= 1);
  });
});
