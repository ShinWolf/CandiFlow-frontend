# CandiFlow — Frontend

Interface web pour la gestion de candidatures, développée en React + TypeScript + Tailwind CSS.

---

## Stack technique

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Axios
- React Router
- Recharts
- Lucide React
- Docker + Nginx

---

## Prérequis

- Node.js 24+
- npm

---

## Installation locale

### 1. Cloner le projet

```bash
git clone https://github.com/ShinWolf/CandiFlow-frontend.git
cd CandiFlow-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'URL de l'API

Par défaut le frontend appelle `http://localhost:8080`. Pour changer l'URL en production, crée un fichier `.env.production` :

```env
VITE_API_URL=https://api.candiflow.ericfief.fr
```

### 4. Lancer en développement

```bash
npm run dev
```

L'app est accessible sur `http://localhost:5173`.

---

## Build production

```bash
npm run build
```

---

## Lancer avec Docker

```bash
docker build -t candiflow-frontend .
docker run -d --name candiflow-frontend -p 3000:80 --restart unless-stopped candiflow-frontend
```

L'app est accessible sur `http://localhost:3000`.

---

## Fonctionnalités

- Authentification JWT (register / login)
- Gestion des candidatures (créer, modifier, supprimer)
- Filtres par statut et recherche par entreprise
- Pagination
- Dashboard avec statistiques et graphique donut
- Profil utilisateur (modifier email, pseudo, mot de passe)
- Mode sombre
- Validation des formulaires
- Gestion des erreurs

---

## Structure du projet

```
src/
├── api/              # Appels HTTP (axios)
│   ├── axiosInstance.ts
│   ├── auth.ts
│   ├── applications.ts
│   ├── dashboard.ts
│   └── user.ts
├── components/       # Composants réutilisables
│   ├── Navbar.tsx
│   ├── ApplicationCard.tsx
│   └── ApplicationModal.tsx
├── context/          # Contextes React
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── pages/            # Pages
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ApplicationsPage.tsx
│   ├── DashboardPage.tsx
│   └── ProfilePage.tsx
├── routes/           # Routes protégées
│   └── ProtectedRoute.tsx
└── types/            # Interfaces TypeScript
    └── index.ts
```

---

## Déploiement

Le projet utilise **GitHub Actions** pour le déploiement automatique sur push sur `main`.

### Secrets GitHub requis

| Secret        | Description     |
| ------------- | --------------- |
| `VPS_HOST`    | IP du VPS       |
| `VPS_USER`    | Utilisateur SSH |
| `VPS_SSH_KEY` | Clé privée SSH  |

### Nginx

Le fichier `nginx.conf` configure le serveur pour servir l'app React en SPA (toutes les routes redirigées vers `index.html`).

---

## Variables d'environnement

| Variable       | Description          | Défaut                  |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | URL de l'API backend | `http://localhost:8080` |
