Task Flow, a full-stack board and task management app.
It's a Trello-style board manager with:
• JWT authentication with route guards on both client and server
• Role-based access control across 4 levels — viewer, editor, contributor, admin — each with a different permission surface
• Real-time board sync via Socket.IO — drag a task to a new column and everyone else viewing that board sees it move instantly
• Optimistic UI updates with automatic rollback if the server rejects a change
• A separate admin panel for user management
Stack: React 18 + Vite on the frontend, Express + MongoDB (Mongoose) on the backend, Tailwind CSS + SCSS for styling, Socket.IO for realtime sync.
The piece I spent the most time getting right was the task-move flow: the UI reorders instantly on drag, a socket event broadcasts the move to everyone else in that board's room, and the actual API call fires right behind it — with a rollback if the request fails. Small detail, but it's the difference between an app that feels instant and one that feels laggy.
It's live with a working demo — log in as viewer, editor, contributor, or admin to see how the permission model actually changes what you can do:
🔗 Live demo: <https://lnkd.in/eqSq8ivt>
💻 Code: <https://lnkd.in/eS3CCb7E>
