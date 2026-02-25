# Configuration du projet MISSPO Frontend

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Pusher Configuration (for WebSocket)
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key_here
NEXT_PUBLIC_PUSHER_APP_CLUSTER=eu

# Realtime Configuration
NEXT_PUBLIC_POLLING_INTERVAL=60000
NEXT_PUBLIC_STATUS_CHECK_INTERVAL=300000
```

## Problèmes résolus

### 1. Hydratation React
- Ajout de `suppressHydrationWarning` sur le `<body>` pour éviter les erreurs d'hydratation

### 2. Carrousel mobile
- Ajout de `touch-action: pan-y` pour permettre le swipe horizontal
- Amélioration de la transition avec `ease-in-out`
- Ajout de `willChange: transform` pour de meilleures performances

### 3. URL API
- Correction de l'URL API avec fallback vers `http://localhost:8000/api`
- Configuration des variables d'environnement

## Démarrage

```bash
npm install
npm run dev
```

Le serveur de développement démarre sur `http://localhost:3000`
