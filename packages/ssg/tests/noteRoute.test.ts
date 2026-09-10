import { describe, expect, it } from "vitest";

import {
  canonicalNoteRoute,
  parseNoteSlug,
  resolveNotePath,
  resolveNoteSlug,
} from "../src/noteRoute";

const notes = [
  { index: "0001", id: "10000000-0000-4000-8000-000000000001" },
  { index: "0002" },
];

describe("note URL aliases", () => {
  it("uses unpadded index as the canonical route", () => {
    expect(canonicalNoteRoute("0001")).toBe("/notes/1");
    expect(canonicalNoteRoute("0010")).toBe("/notes/10");
  });

  it("parses index, padded index, stale title, and uuid slugs", () => {
    expect(parseNoteSlug("1")).toEqual({ kind: "index", index: "0001" });
    expect(parseNoteSlug("0001")).toEqual({ kind: "index", index: "0001" });
    expect(parseNoteSlug("0001. 欢迎")).toEqual({
      kind: "index",
      index: "0001",
    });
    expect(parseNoteSlug("0001.%20%E6%AC%A2%E8%BF%8E%E6%AC%A2%E8%BF%8E")).toEqual({
      kind: "index",
      index: "0001",
    });
    expect(parseNoteSlug("10000000-0000-4000-8000-000000000001")).toEqual({
      kind: "uuid",
      id: "10000000-0000-4000-8000-000000000001",
    });
  });

  it("resolves every alias of note 0001 to /notes/1", () => {
    for (const slug of [
      "1",
      "0001",
      "0001. 欢迎",
      "0001. 欢迎欢迎",
      "10000000-0000-4000-8000-000000000001",
    ]) {
      expect(resolveNoteSlug(slug, notes)).toBe("/notes/1");
    }
  });

  it("resolves paths under a site base", () => {
    expect(
      resolveNotePath(
        "/fixture/notes/0001.%20%E6%AC%A2%E8%BF%8E",
        notes,
        "/fixture/",
      ),
    ).toBe("/notes/1");
    expect(resolveNotePath("/fixture/notes/1", notes, "/fixture/")).toBe(
      "/notes/1",
    );
  });

  it("does not invent notes that are not in the catalog", () => {
    expect(resolveNoteSlug("9", notes)).toBeNull();
    expect(resolveNoteSlug("not-a-note", notes)).toBeNull();
  });
});
