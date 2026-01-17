
// import { loadNotes, deleteNote } from "/src/storage.js";
// import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

// let warningDialog;
// let warningText;
// let warningOk;

// function showWarning(message) {
//   console.log("Menu warning:", message);
//   warningText.textContent = message;
//   warningDialog.showModal();

//   warningOk.onclick = () => {
//     warningDialog.close();
//   };
// }

// const listEl = document.getElementById("notes-list");

// function formatDate(ts) {
//   return new Date(ts).toLocaleString();
// }

// async function renderNotes() {
//   const notes = await loadNotes();
//   notes.sort((a, b) => b.lastOpenedAt - a.lastOpenedAt);

//   listEl.innerHTML = "";

//   if (!notes.length) {
//     listEl.innerHTML = "<p>No notes yet.</p>";
//     return;
//   }

//   for (const note of notes) {
//     const item = document.createElement("div");
//     item.className = "note-item";

//     const icons =
//       `${note.favorite ? "❤️ " : ""}${note.priority ? "⭐ " : ""}`;

//     item.innerHTML = `
//       <div class="note-main">
//         <div class="note-preview">
//           ${icons}${(note.content || "(empty)").slice(0, 50)}
//         </div>
//         <div class="note-date">${formatDate(note.lastOpenedAt)}</div>
//       </div>

//       <div class="note-actions">
//         <button class="note-delete">🗑️</button>
//       </div>
//     `;

//     // Open note
//     item.addEventListener("click", () => openNote(note.id));

//     // Delete
//     const deleteBtn = item.querySelector(".note-delete");
//     deleteBtn.addEventListener("click", async (e) => {
//       e.stopPropagation();

//       if (note.favorite) {
//         showWarning("Unmark this note as favorite before deleting.");
//         return;
//       }

//       const ok = confirm("Delete this note?");
//       if (!ok) return;

//       await deleteNote(note.id);
//       await renderNotes();
//     });

//     listEl.appendChild(item);
//   }
// }

// function openNote(noteId) {
//   const win = new WebviewWindow(noteId, {
//     url: "/note.html",
//     width: 300,
//     height: 300,
//     resizable: false,
//     fullscreen: false,
//     maximizable: false,
//     title: "Sticky Note"
//   });

//   win.once("tauri://created", () => win.show());
// }

// // Refresh when menu regains focus
// window.addEventListener("focus", renderNotes);

// // Wire dialog AFTER DOM exists
// window.addEventListener("DOMContentLoaded", () => {
//   warningDialog = document.getElementById("delete-warning");
//   warningText = document.getElementById("delete-warning-text");
//   warningOk = document.getElementById("delete-warning-ok");

//   if (!warningDialog || !warningText || !warningOk) {
//     console.error("Menu dialog elements not found");
//   }

//   renderNotes();
// });

import { loadNotes, deleteNote } from "/src/storage.js";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

let warningDialog;
let warningText;
let warningOk;

function showWarning(message) {
  warningText.textContent = message;
  warningDialog.showModal();

  warningOk.onclick = () => warningDialog.close();
}

const recentListEl = document.getElementById("recent-notes");
const favoriteListEl = document.getElementById("favorite-notes");


function formatDate(ts) {
  return new Date(ts).toLocaleString();
}

function createNoteItem(note) {
  const item = document.createElement("div");
  item.className = "note-item";

  const icons =
    `${note.priority ? "⭐ " : ""}${note.favorite ? "❤️ " : ""}`;

  item.innerHTML = `
    <div class="note-main">
      <div class="note-preview">
        ${icons}${(note.content || "(empty)").slice(0, 50)}
      </div>
      <div class="note-date">${formatDate(note.lastOpenedAt)}</div>
    </div>

    <div class="note-actions">
      <button class="note-delete">🗑️</button>
    </div>
  `;

  // Open note
  item.addEventListener("click", () => openNote(note.id));

  // Delete logic
  const deleteBtn = item.querySelector(".note-delete");
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation();

    if (note.favorite) {
      showWarning("Unmark this note as favorite before deleting.");
      return;
    }

    const ok = confirm("Delete this note?");
    if (!ok) return;

    await deleteNote(note.id);
    await renderNotes();
  });

  return item;
}

async function renderNotes() {
  const notes = await loadNotes();

  recentListEl.innerHTML = "";
  favoriteListEl.innerHTML = "";

  if (!notes.length) {
    recentListEl.innerHTML = "<p>No notes yet.</p>";
    return;
  }

  // Sort ALL notes by last opened
  const sortedByRecent = [...notes].sort(
    (a, b) => b.lastOpenedAt - a.lastOpenedAt
  );

  // Render recent (all notes)
  for (const note of sortedByRecent) {
    recentListEl.appendChild(createNoteItem(note));
  }

  // Filter favorites
  const favoriteNotes = sortedByRecent.filter(n => n.favorite);

  if (!favoriteNotes.length) {
    favoriteListEl.innerHTML = "<p>No favorite notes.</p>";
    return;
  }

  for (const note of favoriteNotes) {
    favoriteListEl.appendChild(createNoteItem(note));
  }
}


function openNote(noteId) {
  const win = new WebviewWindow(noteId, {
    url: "/note.html",
    width: 300,
    height: 300,
    resizable: false,
    maximizable: false,
    title: "Sticky Note"
  });

  win.once("tauri://created", () => win.show());
}

// Refresh when menu regains focus
window.addEventListener("focus", renderNotes);

// Wire dialog AFTER DOM exists
window.addEventListener("DOMContentLoaded", () => {
  warningDialog = document.getElementById("delete-warning");
  warningText = document.getElementById("delete-warning-text");
  warningOk = document.getElementById("delete-warning-ok");

  renderNotes();
});
