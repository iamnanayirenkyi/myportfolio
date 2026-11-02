# Nana Yirenkyi Portfolio

A portfolio for Andrews Yirenkyi: software developer by day, **Nana Yirenkyi** the poet and spoken word artist on stage.

- **Front end:** React + Vite (a Dev / Poet switch changes the mood of the whole site)
- **Back end:** Node.js + Express (serves the page content, handles uploads)
- **Admin security:** Firebase Authentication. The server checks every save against Firebase and an allow-list of emails.

## 1. Install

```bash
npm run setup
```

## 2. Set up Firebase (about 5 minutes)

1. Create a project at https://console.firebase.google.com.
2. **Build > Authentication > Sign-in method:** enable **Email/Password**, then add yourself under the **Users** tab.
3. **Project settings > General:** add a Web app and copy its config into `client/.env` (copy `client/.env.example`).
4. **Project settings > Service accounts > Generate new private key.** Save the file as `server/firebase-service-account.json`.
5. Copy `server/.env.example` to `server/.env` and set `ADMIN_EMAILS` to the email you added in step 2.

## 3. Run it

```bash
npm run dev
```

Open http://localhost:5173. The admin desk is at http://localhost:5173/admin (there is also a small "Admin" link in the footer).

## 4. Fill in your content

Sign in at `/admin`, then:

- upload your **profile picture** and **CV** (the CV button in the top bar downloads it)
- edit bios, skills, stages, **YouTube videos** (paste any YouTube link), past work, upcoming events and social links
- press **Save changes**

## Going live

```bash
npm run build
npm start
```

Express then serves the built site and the API together on one port. Host it anywhere that runs Node, and keep `server/data/` and `server/uploads/` on persistent storage because that is where your content and files live.
