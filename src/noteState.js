import { loadNotes, saveNotes, deleteNote } from "/src/storage.js";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

console.log("noteState.js loaded");

export function createNoteController(textarea, editBtn) {
  let isEditing = false;
  let isDirty = false;
  let noteId = null;

  // DOM elements
  const favBtn = document.getElementById("fav");
  const priorityBtn = document.getElementById("priority");
  const deleteBtn = document.getElementById("delete");

const warningDialog = document.getElementById("delete-warning");
const warningText = document.getElementById("delete-warning-text");
const warningOk = document.getElementById("delete-warning-ok");

if (!warningDialog || !warningText || !warningOk) {
  console.error("Dialog elements not found");
}

function showWarning(message) {
  console.log("Showing dialog:", message);
  warningText.textContent = message;
  warningDialog.showModal();

  warningOk.onclick = () => {
    warningDialog.close();
  };
}


if (!favBtn || !priorityBtn || !deleteBtn) {
  console.error("One or more buttons not found");
  return;
}

  // --- DEFAULT: READ MODE ---
  textarea.disabled = true;
  editBtn.textContent = "Edit";

  // --- Helpers ---
  function updateFlagsUI(note) {
    favBtn.textContent = note.favorite ? "❤️" : "🤍";
    priorityBtn.textContent = note.priority ? "⭐" : "☆";
  }

  // --- Load existing note (or init new one) ---
  async function loadExistingNote() {
    const win = getCurrentWebviewWindow();
    const label = win.label;

    const notes = await loadNotes();
    let existing = notes.find(n => n.id === label);

    if (existing) {
      noteId = existing.id;

      existing.favorite ??= false;
      existing.priority ??= false;

      textarea.value = existing.content;
      existing.lastOpenedAt = Date.now();

      await saveNotes(notes);
      updateFlagsUI(existing);
    } else {
      // New note
      noteId = label === "main" ? `note-${Date.now()}` : label;
      updateFlagsUI({ favorite: false, priority: false });
    }
  }

  loadExistingNote();

  // --- Favorite toggle ---
  favBtn.addEventListener("click", async () => {
    const notes = await loadNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    note.favorite = !note.favorite;
    await saveNotes(notes);
    updateFlagsUI(note);
  });

  // --- Priority toggle ---
  priorityBtn.addEventListener("click", async () => {
    const notes = await loadNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    note.priority = !note.priority;
    await saveNotes(notes);
    updateFlagsUI(note);
  });

  // --- Track unsaved changes ---
  textarea.addEventListener("input", () => {
    if (isEditing) isDirty = true;
  });

  // --- Delete note ---
  deleteBtn.addEventListener("click", async () => {
    const notes = await loadNotes();
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    if (note.favorite) {
      showWarning("Unmark this note as favorite before deleting.");
      return;
    }

    const confirmed = confirm("Delete this note?");
    if (!confirmed) return;

    await deleteNote(noteId);

    const win = getCurrentWebviewWindow();
    await win.close();
  });

  // --- Edit / Save toggle ---
  editBtn.addEventListener("click", async () => {
    if (!isEditing) {
      // ENTER EDIT MODE
      isEditing = true;
      isDirty = false;
      textarea.disabled = false;
      textarea.focus();
      editBtn.textContent = "Save";
      return;
    }

    
    // SAVE
    isEditing = false;
    textarea.disabled = true;
    editBtn.textContent = "Edit";

    if (!isDirty) return;

    const now = Date.now();
    const notes = await loadNotes();
    const existing = notes.find(n => n.id === noteId);

    if (existing) {
      existing.content = textarea.value;
      existing.updatedAt = now;
      existing.lastOpenedAt = now;
    } else {
      notes.push({
        id: noteId,
        content: textarea.value,
        createdAt: now,
        updatedAt: now,
        lastOpenedAt: now,
        favorite: false,
        priority: false
      });
    }

    await saveNotes(notes);
    isDirty = false;
  });
}
