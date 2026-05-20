/**
 * Smoke tests for Task 1 — verifies core data types and state initialization.
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  getTasks,
  setState,
  getCurrentFilter,
  createTask,
  validateDescription,
  addTask,
} from "./app.js";

describe("Task 1 — Core data types and initial state", () => {
  beforeEach(() => {
    setState([]);
  });

  it("initial tasks array is empty", () => {
    setState([]);
    expect(getTasks()).toEqual([]);
  });

  it("initial filter is 'all'", () => {
    expect(getCurrentFilter()).toBe("all");
  });

  it("createTask returns a Task with correct shape", () => {
    const task = createTask("Belajar JavaScript");
    expect(task).toMatchObject({
      description: "Belajar JavaScript",
      completed: false,
    });
    expect(typeof task.id).toBe("string");
    expect(task.id.length).toBeGreaterThan(0);
    expect(typeof task.createdAt).toBe("number");
  });

  it("validateDescription rejects empty string", () => {
    const result = validateDescription("");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("EMPTY_DESCRIPTION");
  });

  it("validateDescription rejects whitespace-only string", () => {
    const result = validateDescription("   ");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("EMPTY_DESCRIPTION");
  });

  it("validateDescription rejects description shorter than 3 chars", () => {
    const result = validateDescription("ab");
    expect(result.ok).toBe(false);
    expect(result.error).toBe("DESCRIPTION_TOO_SHORT");
  });

  it("validateDescription rejects description over 50 chars", () => {
    const result = validateDescription("a".repeat(51));
    expect(result.ok).toBe(false);
    expect(result.error).toBe("DESCRIPTION_TOO_LONG");
  });

  it("validateDescription accepts valid description", () => {
    const result = validateDescription("Tugas valid");
    expect(result.ok).toBe(true);
    expect(result.value).toBe("Tugas valid");
  });

  it("addTask adds a task to state", () => {
    const result = addTask("Tugas pertama");
    expect(result.ok).toBe(true);
    expect(getTasks().length).toBe(1);
    expect(getTasks()[0].description).toBe("Tugas pertama");
  });

  it("addTask returns Result<Task, ValidationError>", () => {
    const ok = addTask("Valid task");
    expect(ok.ok).toBe(true);
    if (ok.ok) expect(ok.value.description).toBe("Valid task");

    const fail = addTask("");
    expect(fail.ok).toBe(false);
    if (!fail.ok) expect(fail.error).toBe("EMPTY_DESCRIPTION");
  });
});
