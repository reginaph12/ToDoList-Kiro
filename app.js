/**
 * Todo List App — app.js
 * Arsitektur: MVC sederhana (Model + View + Controller)
 * Tidak memerlukan build tool — dijalankan langsung dari index.html
 */

// ============================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================

/**
 * @typedef {Object} Task
 * @property {string} id          - UUID v4, unik per task
 * @property {string} description - Deskripsi tugas, 1–200 karakter, non-whitespace
 * @property {boolean} completed  - false = aktif, true = selesai
 * @property {number} createdAt   - Unix timestamp (Date.now()) saat task dibuat
 */

/**
 * @typedef {"all" | "active" | "completed"} FilterType
 */

/**
 * @typedef {Object} AppState
 * @property {Task[]} tasks                  - Daftar semua tugas (urutan: terbaru pertama)
 * @property {FilterType} currentFilter      - Filter yang sedang aktif
 * @property {string | null} editingTaskId   - ID task yang sedang dalam mode edit, atau null
 */

/**
 * @typedef {{ ok: true; value: T } | { ok: false; error: E }} Result
 * @template T, E
 */

/**
 * @typedef {"EMPTY_DESCRIPTION" | "DESCRIPTION_TOO_SHORT" | "DESCRIPTION_TOO_LONG"} ValidationError
 */

/**
 * @typedef {"STORAGE_UNAVAILABLE" | "PARSE_ERROR" | "WRITE_ERROR"} StorageError
 */

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY = "todolist-app-tasks";
const MIN_DESCRIPTION_LENGTH = 3;
const MAX_DESCRIPTION_LENGTH = 50;

// ============================================================
// STATE
// ============================================================

/**
 * Application state — single source of truth.
 * @type {AppState}
 */
const state = {
  tasks: [],
  currentFilter: "all",
  editingTaskId: null,
};

// ============================================================
// STATE ACCESSORS (for testability)
// ============================================================

/**
 * Returns a shallow copy of the current tasks array.
 * @returns {Task[]}
 */
export function getTasks() {
  return [...state.tasks];
}

/**
 * Replaces the tasks array in state (used for testing / init).
 * @param {Task[]} tasks
 */
export function setState(tasks) {
  state.tasks = [...tasks];
}

/**
 * Returns the current filter.
 * @returns {FilterType}
 */
export function getCurrentFilter() {
  return state.currentFilter;
}

// ============================================================
// MODEL — CRUD & VALIDATION
// ============================================================

/**
 * Creates a new Task object (does NOT add to state).
 * @param {string} description
 * @returns {Task}
 */
export function createTask(description) {
  return {
    id: crypto.randomUUID(),
    description: description.trim(),
    completed: false,
    createdAt: Date.now(),
  };
}

/**
 * Validates a description string.
 * @param {string} description
 * @returns {Result<string, ValidationError>}
 */
export function validateDescription(description) {
  if (typeof description !== "string" || description.trim().length === 0) {
    return { ok: false, error: "EMPTY_DESCRIPTION" };
  }
  if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
    return { ok: false, error: "DESCRIPTION_TOO_SHORT" };
  }
  if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return { ok: false, error: "DESCRIPTION_TOO_LONG" };
  }
  return { ok: true, value: description.trim() };
}

/**
 * Adds a new task to state after validation.
 * @param {string} description
 * @returns {Result<Task, ValidationError>}
 */
export function addTask(description) {
  const validation = validateDescription(description);
  if (!validation.ok) {
    return validation;
  }
  const task = createTask(validation.value);
  // Prepend so newest tasks appear first
  state.tasks = [task, ...state.tasks];
  return { ok: true, value: task };
}

/**
 * Toggles the completed status of a task by ID.
 * Uses immutable update (returns new array).
 * @param {string} id
 * @returns {Task | null} The updated task, or null if not found
 */
export function toggleTask(id) {
  let updatedTask = null;
  state.tasks = state.tasks.map((task) => {
    if (task.id === id) {
      updatedTask = { ...task, completed: !task.completed };
      return updatedTask;
    }
    return task;
  });
  return updatedTask;
}

/**
 * Edits the description of an existing task.
 * Preserves id and createdAt.
 * @param {string} id
 * @param {string} newDescription
 * @returns {Result<Task, ValidationError>}
 */
export function editTask(id, newDescription) {
  const validation = validateDescription(newDescription);
  if (!validation.ok) {
    return validation;
  }
  let updatedTask = null;
  state.tasks = state.tasks.map((task) => {
    if (task.id === id) {
      updatedTask = { ...task, description: validation.value };
      return updatedTask;
    }
    return task;
  });
  if (!updatedTask) {
    return { ok: false, error: "EMPTY_DESCRIPTION" }; // task not found
  }
  return { ok: true, value: updatedTask };
}

/**
 * Deletes a task from state by ID.
 * @param {string} id
 */
export function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
}

/**
 * Removes all completed tasks from state.
 */
export function clearCompleted() {
  state.tasks = state.tasks.filter((task) => !task.completed);
}

/**
 * Returns tasks filtered by the given FilterType.
 * @param {FilterType} filter
 * @returns {Task[]}
 */
export function getFilteredTasks(filter) {
  switch (filter) {
    case "active":
      return state.tasks.filter((task) => !task.completed);
    case "completed":
      return state.tasks.filter((task) => task.completed);
    case "all":
    default:
      return [...state.tasks];
  }
}

// ============================================================
// STORAGE
// ============================================================

/**
 * Saves the tasks array to localStorage.
 * @param {Task[]} tasks
 * @returns {Result<void, StorageError>}
 */
export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true, value: undefined };
  } catch (e) {
    showErrorBanner("Gagal menyimpan data. Perubahan mungkin tidak tersimpan.");
    return { ok: false, error: "WRITE_ERROR" };
  }
}

/**
 * Loads tasks from localStorage.
 * @returns {Result<Task[], StorageError>}
 */
export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ok: true, value: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "PARSE_ERROR" };
    }
    return { ok: true, value: parsed };
  } catch (e) {
    return { ok: false, error: "PARSE_ERROR" };
  }
}

// ============================================================
// VIEW — DOM RENDERING
// ============================================================

/**
 * Shows the error banner with a message.
 * @param {string} message
 */
export function showErrorBanner(message) {
  const banner = document.getElementById("error-banner");
  const msgEl = document.getElementById("error-message");
  if (!banner || !msgEl) return;
  msgEl.textContent = message;
  banner.classList.remove("hidden");
}

/**
 * Hides the error banner.
 */
export function hideErrorBanner() {
  const banner = document.getElementById("error-banner");
  if (banner) banner.classList.add("hidden");
}

/**
 * Creates and returns a DOM element for a single task item.
 * @param {Task} task
 * @returns {HTMLLIElement}
 */
export function renderTaskItem(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " completed" : "");
  li.dataset.id = task.id;

  // --- View section (normal mode) ---
  const viewSection = document.createElement("div");
  viewSection.className = "task-view-section";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Tandai "${task.description}" sebagai ${task.completed ? "aktif" : "selesai"}`);
  checkbox.dataset.action = "toggle";
  checkbox.dataset.id = task.id;

  // Description
  const descSpan = document.createElement("span");
  descSpan.className = "task-description";
  descSpan.textContent = task.description;

  // Action buttons
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "task-edit-btn";
  editBtn.textContent = "Edit";
  editBtn.setAttribute("aria-label", `Edit tugas "${task.description}"`);
  editBtn.dataset.action = "edit";
  editBtn.dataset.id = task.id;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete-btn";
  deleteBtn.textContent = "Hapus";
  deleteBtn.setAttribute("aria-label", `Hapus tugas "${task.description}"`);
  deleteBtn.dataset.action = "delete";
  deleteBtn.dataset.id = task.id;

  actionsDiv.appendChild(editBtn);
  actionsDiv.appendChild(deleteBtn);

  viewSection.appendChild(checkbox);
  viewSection.appendChild(descSpan);
  viewSection.appendChild(actionsDiv);

  // --- Edit section (edit mode, hidden by default) ---
  const editSection = document.createElement("div");
  editSection.className = "task-edit-section";

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "task-edit-input";
  editInput.value = task.description;
  editInput.maxLength = MAX_DESCRIPTION_LENGTH;
  editInput.setAttribute("aria-label", "Edit deskripsi tugas");
  editInput.dataset.action = "edit-input";
  editInput.dataset.id = task.id;

  const saveBtn = document.createElement("button");
  saveBtn.className = "task-save-btn";
  saveBtn.textContent = "Simpan";
  saveBtn.setAttribute("aria-label", "Simpan perubahan");
  saveBtn.dataset.action = "save";
  saveBtn.dataset.id = task.id;

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "task-cancel-btn";
  cancelBtn.textContent = "Batal";
  cancelBtn.setAttribute("aria-label", "Batal edit");
  cancelBtn.dataset.action = "cancel";
  cancelBtn.dataset.id = task.id;

  editSection.appendChild(editInput);
  editSection.appendChild(saveBtn);
  editSection.appendChild(cancelBtn);

  li.appendChild(viewSection);
  li.appendChild(editSection);

  return li;
}

/**
 * Re-renders the entire task list in the DOM.
 * @param {Task[]} tasks
 */
export function renderTaskList(tasks) {
  const listEl = document.getElementById("task-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (tasks.length === 0) {
    renderEmptyState(getEmptyMessage());
    return;
  }

  hideEmptyState();
  tasks.forEach((task) => {
    listEl.appendChild(renderTaskItem(task));
  });
}

/**
 * Returns the appropriate empty state message based on current filter.
 * @returns {string}
 */
function getEmptyMessage() {
  switch (state.currentFilter) {
    case "active":
      return "Tidak ada tugas aktif.";
    case "completed":
      return "Tidak ada tugas yang selesai.";
    default:
      return "Belum ada tugas. Tambahkan tugas pertama Anda!";
  }
}

/**
 * Shows the empty state message.
 * @param {string} message
 */
export function renderEmptyState(message) {
  const emptyEl = document.getElementById("empty-state");
  const msgEl = document.getElementById("empty-message");
  if (!emptyEl || !msgEl) return;
  msgEl.textContent = message;
  emptyEl.classList.remove("hidden");
}

/**
 * Hides the empty state element.
 */
function hideEmptyState() {
  const emptyEl = document.getElementById("empty-state");
  if (emptyEl) emptyEl.classList.add("hidden");
}

/**
 * Enables or disables the "Hapus Selesai" button based on completed tasks.
 * @param {Task[]} tasks
 */
export function updateClearButton(tasks) {
  const btn = document.getElementById("clear-completed-btn");
  if (!btn) return;
  const hasCompleted = tasks.some((task) => task.completed);
  btn.disabled = !hasCompleted;
}

/**
 * Updates the active state of filter buttons.
 * @param {FilterType} activeFilter
 */
function updateFilterButtons(activeFilter) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    const isActive = btn.dataset.filter === activeFilter;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
}

/**
 * Full UI re-render based on current state.
 */
function render() {
  const filtered = getFilteredTasks(state.currentFilter);
  renderTaskList(filtered);
  updateClearButton(state.tasks);
  updateFilterButtons(state.currentFilter);
}

// ============================================================
// CONTROLLER — EVENT HANDLING
// ============================================================

/**
 * Shows an inline error below the main input field.
 * @param {string} message
 */
function showInputError(message) {
  const errEl = document.getElementById("input-error");
  if (!errEl) return;
  errEl.textContent = message;
  errEl.classList.remove("hidden");
}

/**
 * Hides the inline input error.
 */
function hideInputError() {
  const errEl = document.getElementById("input-error");
  if (errEl) errEl.classList.add("hidden");
}

/**
 * Handles adding a new task from the input field.
 */
function handleAddTask() {
  const input = document.getElementById("task-input");
  if (!input) return;
  const description = input.value;
  const result = addTask(description);
  if (!result.ok) {
    const msg =
      result.error === "DESCRIPTION_TOO_LONG"
        ? `Deskripsi terlalu panjang (maksimal ${MAX_DESCRIPTION_LENGTH} karakter).`
        : result.error === "DESCRIPTION_TOO_SHORT"
        ? `Deskripsi terlalu pendek (minimal ${MIN_DESCRIPTION_LENGTH} karakter).`
        : "Deskripsi tugas tidak boleh kosong.";
    showInputError(msg);
    return;
  }
  hideInputError();
  saveTasks(state.tasks);
  render();
  input.value = "";
  input.focus();
}

/**
 * Activates edit mode on a task item element.
 * @param {string} id
 */
function activateEditMode(id) {
  // Deactivate any currently editing task first
  if (state.editingTaskId) {
    deactivateEditMode(state.editingTaskId);
  }
  state.editingTaskId = id;
  const li = document.querySelector(`.task-item[data-id="${id}"]`);
  if (!li) return;
  li.classList.add("editing");
  const editInput = li.querySelector(".task-edit-input");
  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

/**
 * Deactivates edit mode on a task item element.
 * @param {string} id
 */
function deactivateEditMode(id) {
  state.editingTaskId = null;
  const li = document.querySelector(`.task-item[data-id="${id}"]`);
  if (!li) return;
  li.classList.remove("editing");
}

/**
 * Handles saving an edited task.
 * @param {string} id
 */
function handleSaveEdit(id) {
  const li = document.querySelector(`.task-item[data-id="${id}"]`);
  if (!li) return;
  const editInput = li.querySelector(".task-edit-input");
  if (!editInput) return;
  const result = editTask(id, editInput.value);
  if (!result.ok) {
    // Show error inline within the task item
    let errEl = li.querySelector(".task-edit-error");
    if (!errEl) {
      errEl = document.createElement("p");
      errEl.className = "task-edit-error";
      li.querySelector(".task-edit-section").appendChild(errEl);
    }
    errEl.textContent = "Deskripsi tidak boleh kosong.";
    errEl.style.display = "block";
    return;
  }
  saveTasks(state.tasks);
  state.editingTaskId = null;
  render();
}

/**
 * Sets up all event listeners for the application.
 */
function setupEventListeners() {
  // Add task — button click
  const addBtn = document.getElementById("add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", handleAddTask);
  }

  // Add task — Enter key on input
  const taskInput = document.getElementById("task-input");
  if (taskInput) {
    taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleAddTask();
    });
    taskInput.addEventListener("input", hideInputError);
  }

  // Task list — event delegation for toggle, edit, delete, save, cancel
  const taskList = document.getElementById("task-list");
  if (taskList) {
    taskList.addEventListener("click", (e) => {
      const target = e.target;
      const action = target.dataset.action;
      const id = target.dataset.id;
      if (!action || !id) return;

      switch (action) {
        case "toggle":
          toggleTask(id);
          saveTasks(state.tasks);
          render();
          break;
        case "edit":
          activateEditMode(id);
          break;
        case "delete":
          deleteTask(id);
          saveTasks(state.tasks);
          render();
          break;
        case "save":
          handleSaveEdit(id);
          break;
        case "cancel":
          deactivateEditMode(id);
          break;
      }
    });

    // Edit input — Enter to save, Escape to cancel
    taskList.addEventListener("keydown", (e) => {
      const target = e.target;
      if (!target.classList.contains("task-edit-input")) return;
      const id = target.dataset.id;
      if (!id) return;
      if (e.key === "Enter") handleSaveEdit(id);
      if (e.key === "Escape") deactivateEditMode(id);
    });
  }

  // Filter buttons
  const filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      const filter = btn.dataset.filter;
      if (filter) {
        state.currentFilter = /** @type {FilterType} */ (filter);
        render();
      }
    });
  }

  // Clear completed button
  const clearBtn = document.getElementById("clear-completed-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearCompleted();
      saveTasks(state.tasks);
      render();
    });
  }

  // Error banner close button
  const errorClose = document.getElementById("error-close");
  if (errorClose) {
    errorClose.addEventListener("click", hideErrorBanner);
  }
}

// ============================================================
// INIT
// ============================================================

/**
 * Initializes the application.
 * Loads data from localStorage and renders the initial UI.
 */
export function init() {
  const result = loadTasks();
  if (result.ok) {
    state.tasks = result.value;
  } else {
    showErrorBanner("Gagal memuat data. Memulai dengan daftar kosong.");
    state.tasks = [];
  }
  state.currentFilter = "all";
  state.editingTaskId = null;

  setupEventListeners();
  render();
}

// ============================================================
// BOOTSTRAP — only run in browser context
// ============================================================

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
