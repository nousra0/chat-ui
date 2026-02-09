# Chat UI

A frontend-only chat interface built with **Nuxt 3** and **Bootstrap 5**. No backend or real API—all data is mocked and state is local.

## Features

- **Layout**: Sidebar with conversation list + main chat area (similar to modern messaging apps)
- **Sidebar**: App logo/title, search, conversation list (avatar, name, last message, unread badge)
- **Chat area**: Header (user info + actions), scrollable messages, input with send button
- **Messages**: Sent vs received bubbles, timestamps, optional read status (✓ / ✓✓)
- **Responsive**: Desktop and mobile (sidebar becomes overlay on small screens)
- **UX**: Hover states, message bubble animation, typing indicator (mock), dark mode toggle

## Tech Stack

- Nuxt 3 (Composition API)
- Vue 3
- Bootstrap 5 (utility classes + minimal custom CSS)
- TypeScript

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

- `pages/index.vue` – Main chat page (sidebar + chat window, mobile behavior)
- `layouts/default.vue` – App layout and dark mode toggle
- `components/ChatSidebar.vue` – Left sidebar (search, conversation list)
- `components/ChatWindow.vue` – Main chat (header, messages, input, typing indicator)
- `components/MessageBubble.vue` – Single message bubble (sent/received, time, read)
- `composables/useChat.ts` – Reactive chat state (conversations, selection, send message)
- `data/mockChat.ts` – Mock conversations and messages
- `types/chat.ts` – TypeScript types for User, Message, Conversation

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
