import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { createNoteController } from "/src/noteState.js";


let menuWindow = null;

const newBtn = document.getElementById("new");
const menuBtn = document.getElementById("menu");
const textarea = document.getElementById("content");
const editBtn = document.getElementById("edit");


//NEW NOTE BUTTON
newBtn.addEventListener("click", async () => {
  const label = `note-${Date.now()}`;

  console.log("Creating window:", label);

  const win = new WebviewWindow(label, {
    url: "/note.html",
    width: 300,
    height: 300,
    title: "Sticky Note",
    resizable: false,
    fullscreen: false,
    visible: true   // 👈 explicitly make it visible
  });

  // VERY IMPORTANT: wait for it to be created
  win.once("tauri://created", () => {
    console.log("Window created:", label);
    win.show(); // 👈 force show
  });

  win.once("tauri://error", (e) => {
    console.error("Failed to create window:", e);
  });


});

//MENU BUTTON
menuBtn.addEventListener("click", () => {
  if (menuWindow) {
    menuWindow.show();
    menuWindow.setFocus();
    return;
  }

  menuWindow = new WebviewWindow("menu", {
    url: "/menu.html",
    width: 400,
    height: 700,
    title: "Sticky Notes Menu",
    visible: true,
    resizable: false,
    fullscreen: false,
    maximizable: false
    
  });

  menuWindow.once("tauri://created", () => {
    menuWindow.show();
  });

  menuWindow.once("tauri://close-requested", () => {
    menuWindow = null;
  });

  menuWindow.once("tauri://error", (e) => {
    console.error("Menu window error:", e);
    menuWindow = null;
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("content");
  const editBtn = document.getElementById("edit");
  createNoteController(textarea, editBtn);
});
