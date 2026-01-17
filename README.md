# 🗒️ Sticky Notes Desktop App

A lightweight **desktop Sticky Notes application** built using **Tauri v2** and **Vite (HTML/CSS/JavaScript)**.  
The app focuses on **fast note access**, **multiple windows**, and a **clean, distraction-free UX**, while keeping everything stored locally on your system.

This project is designed as a real desktop app — not just a wrapped web page.

---

## What This App Does

- Lets you create and manage **multiple sticky notes**, each in its own window
- Notes persist locally, so they’re available every time you reopen the app
- A dedicated **Menu window** helps you quickly find recent and favorite notes
- Designed to be simple and fast.

---

## 🚀 Features

### 🪟 Note Windows
- Multiple sticky note windows
- Fixed size (300 × 300), non-resizable
- Each note opens in its own native window
- Read mode and Edit mode.

### 📋 Menu Window
- Central menu to manage all notes
- Notes sorted by **most recently opened**
- Separate **Favorites** section for quick access
- Live updates when notes are opened or deleted

### ❤️ Favorites & ⭐ Priority
- Notes can be marked as:
  - **Favorite (❤️)**
  - **Priority (⭐)**
- A note can be both favorite and priority
- Favorite notes are protected from accidental deletion

### 🛡️ Safe Deletion
- Deleting a favorite note is blocked
- Shows a native `<dialog>` warning before deletion
- Delete actions available from both:
  - Note window
  - Menu window

### 💾 Persistence
- All notes are stored locally in a `notes.json` file
- Stored using Tauri’s **AppData** directory
- No cloud, no accounts, no tracking

### 🎨 UX Details
- Clean sticky-note inspired UI
- Custom scrollbar styling
- Native dialog usage for better desktop feel
- No unnecessary animations or clutter

---

## 🧠 Design Goals

- Fast access to recent notes
- Desktop-first UX (not mobile-first)
- Clear separation between note content and note management
- Simple, readable code structure

---

## 🛠️ Tech Stack

### Frontend
- **HTML**
- **CSS**
- **JavaScript (ES Modules)**
- **Vite** – fast development and bundling

### Desktop Framework
- **Tauri v2**
  - Native window management
  - Secure filesystem access
  - Lightweight binary compared to Electron

### Storage
- Local JSON storage (`notes.json`)
- Managed via Tauri filesystem APIs

## 📌 Future Improvements (Planned / Ideas)

- Search across notes
- Keyboard shortcuts for power users
- Collapsible menu sections
- Better visual indicators for priority notes
- Theming / dark mode
