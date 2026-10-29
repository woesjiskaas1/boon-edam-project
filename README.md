# boon-edam-project

React + Vite (JavaScript).

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
