# boon-edam-project

Front-end: React + Vite (JavaScript), in deze map.
Backend: PHP (Slim) met MySQL, in de map `backend/`.

De interface volgt Atomic Design: kleine bouwstenen onderaan, pagina's bovenaan. Een onderdeel importeert alleen uit dezelfde laag of een lagere laag.

```text
src/
├── components/
│   ├── atoms/          kleine, losse bouwstenen
│   ├── molecules/      combinatie van atoms met één taak
│   └── organisms/      groter interface-onderdeel
├── templates/          gedeelde pagina-indeling
├── pages/              concrete schermen
├── hooks/              gedeelde logica
├── data/               voorbeeldgegevens
├── styles/
│   ├── global.css      basisstijl voor de hele app
│   └── dashboard.css   stijl van het dashboard
├── assets/
├── App.jsx
└── main.jsx
```

```bash
npm install
npm run dev
```

## Front-end en backend samen starten

Start ze in twee aparte terminals.

**Backend** (PHP 8.5 of nieuwer, MySQL bijvoorbeeld via XAMPP):

```bash
cd backend/public
php -S localhost:3333 index.php
```

**Front-end:**

```bash
npm install
npm run dev
```

In de React-code roep je de backend aan via `/api/...`, bijvoorbeeld `fetch("/api/employees")`. Vite stuurt dat door naar `http://localhost:3333/employees` (zie `vite.config.js`).

