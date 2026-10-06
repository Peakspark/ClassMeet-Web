// backend structure
1. User database model        ← NEXT
2. Authentication
   ├── Signup
   ├── Login
   ├── Logout
   ├── JWT + HTTP-only cookie
   └── Password reset

3. Authorization
   ├── Manager
   ├── Supervisor
   └── Team Member

4. Workspace
   ├── Create workspace
   ├── Members
   └── Roles

5. Rooms
   ├── Create/join rooms
   └── Presence

6. Messaging
   ├── Individual chat
   ├── Team/group chat
   └── File sharing

7. Socket.IO
   └── Real-time communication

8. WebRTC signaling
   └── Video/audio

9. Meetings
   ├── Schedule
   └── Join

10. Project management
    ├── To-do
    ├── In progress
    └── Completed

11. Polls / feedback

12. Analytics

13. Security testing

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
