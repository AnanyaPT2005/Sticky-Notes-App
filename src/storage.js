// console.log("storage.js loaded");
// const FILE_NAME = "notes.json";

// /**
//  * Dynamically load the Tauri FS API (v2-safe)
//  */
// async function fsApi() {
//   return await import("@tauri-apps/api/fs");
// }

// /**
//  * Ensure notes.json exists
//  */
// async function ensureFile() {
//   const { exists, writeTextFile, BaseDirectory } = await fsApi();

//   const fileExists = await exists(FILE_NAME, {
//     dir: BaseDirectory.AppData
//   });

//   if (!fileExists) {
//     await writeTextFile(
//       FILE_NAME,
//       JSON.stringify({ notes: [] }, null, 2),
//       { dir: BaseDirectory.AppData }
//     );
//   }
// }

// /**
//  * Load all notes
//  */
// export async function loadNotes() {
//   const { readTextFile, BaseDirectory } = await fsApi();

//   await ensureFile();

//   const content = await readTextFile(FILE_NAME, {
//     dir: BaseDirectory.AppData
//   });

//   return JSON.parse(content).notes;
// }

// /**
//  * Save all notes
//  */
// export async function saveNotes(notes) {
//   const { writeTextFile, BaseDirectory } = await fsApi();

//   await writeTextFile(
//     FILE_NAME,
//     JSON.stringify({ notes }, null, 2),
//     { dir: BaseDirectory.AppData }
//   );
// }

console.log("storage.js loaded");

import {
  readTextFile,
  writeTextFile,
  exists,
  BaseDirectory
} from "@tauri-apps/plugin-fs";

const FILE_NAME = "notes.json";

async function ensureFile() {
  const fileExists = await exists(FILE_NAME, {
    baseDir: BaseDirectory.AppData
  });

  if (!fileExists) {
    await writeTextFile(
      FILE_NAME,
      JSON.stringify({ notes: [] }, null, 2),
      { baseDir: BaseDirectory.AppData }
    );
  }
}

export async function loadNotes() {
  await ensureFile();

  const content = await readTextFile(FILE_NAME, {
    baseDir: BaseDirectory.AppData
  });

  return JSON.parse(content).notes;
}

export async function saveNotes(notes) {
  await writeTextFile(
    FILE_NAME,
    JSON.stringify({ notes }, null, 2),
    { baseDir: BaseDirectory.AppData }
  );
}

export async function deleteNote(noteId) {
  const notes = await loadNotes();
  const before = notes.length;
  const updated = notes.filter(n => n.id !== noteId);

  if (before === updated.length) {
    console.warn("Delete failed: note not found", noteId);
  }

  await saveNotes(updated);
}

