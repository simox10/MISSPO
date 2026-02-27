# Guide de Test - Back/Forward Cache (bfcache)

## Comment tester la solution hybride WebSocket + Polling

---

## Test 1 : Vérification bfcache dans Chrome DevTools

### Étapes
1. Ouvrir Chrome DevTools (F12)
2. Aller dans l'onglet **Application**
3. Dans le menu de gauche, cliquer sur **Back/forward cache**
4. Naviguer sur le site MISSPO
5. Aller sur une autre page
6. Utiliser le bouton "Retour" du navigateur
7. Vérifier le statut dans DevTools

### Résultat attendu
✅ **"Restored from bfcache"** doit apparaître  
✅ Aucune raison de blocage ne doit être listée pour les pages publiques  
❌ Les pages admin (`/adminmisspo/*`) doivent être bloquées (sécurité)

---

## Test 2 : Console JavaScript

### Code à exécuter dans la console
```javascript
// Ajouter ce code dans la console avant de naviguer
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    console.log('✅ Page restaurée depuis bfcache')
  } else {
    console.log('❌ Page chargée normalement (pas de bfcache)')
  }
})

window.addEventListener('pagehide', (event) => {
  console.log('🔄 Page en cours de masquage')
})
```

### Étapes
1. Ouvrir la console (F12)
2. Coller le code ci-dessus
3. Naviguer vers une autre page
4. Utiliser le bouton "Retour"
5. Observer les messages dans la console

### Résultat attendu
```
🔄 Page en cours de masquage
✅ Page restaurée depuis bfcache
[RealtimeManager] Page restored from bfcache - switching to polling
```

---

## Test 3 : Indicateur de Statut Temps Réel

### Étapes
1. Ouvrir le site MISSPO
2. Observer l'indicateur en bas à droite de l'écran
3. Vérifier qu'il affiche **"Temps réel"** avec une icône verte 🟢
4. Naviguer vers une autre page (ex: Services)
5. Utiliser le bouton "Retour" du navigateur
6. Observer l'indicateur

### Résultat attendu
- Avant navigation : 🟢 **"Temps réel"**
- Après retour : 🟠 **"Polling (60s)"** avec compte à rebours
- Message : **"Page restaurée - Cliquez pour reconnecter"**
- Après clic : 🟢 **"Temps réel"** (reconnexion automatique)

---

## Test 4 : Reconnexion WebSocket

### Étapes
1. Ouvrir le site avec l'indicateur visible
2. Naviguer arrière/avant pour déclencher le mode polling
3. Effectuer une des actions suivantes :
   - Cliquer n'importe où sur la page
   - Toucher l'écran (mobile)
   - Appuyer sur une touche du clavier
   - Scroller la page

### Résultat attendu
```
[RealtimeManager] User interaction detected - reconnecting WebSocket
[RealtimeManager] Reconnected WebSocket
```
L'indicateur doit repasser à 🟢 **"Temps réel"**

---

## Test 5 : Headers HTTP

### Avec curl
```bash
# Page publique (doit permettre bfcache)
curl -I http://localhost:3000/

# Vérifier : Cache-Control: private, max-age=0, must-revalidate
```

```bash
# Page admin (doit bloquer bfcache)
curl -I http://localhost:3000/adminmisspo/dashboard

# Vérifier : Cache-Control: private, no-cache, no-store, must-revalidate
```

### Avec Chrome DevTools
1. Ouvrir DevTools (F12)
2. Onglet **Network**
3. Recharger la page
4. Cliquer sur le document HTML principal
5. Onglet **Headers**
6. Vérifier **Response Headers** → **Cache-Control**

### Résultat attendu
- Pages publiques : `private, max-age=0, must-revalidate`
- Pages admin : `private, no-cache, no-store, must-revalidate`
- Assets statiques : `public, max-age=31536000, immutable`

---

## Test 6 : Performance de Navigation

### Avec Chrome DevTools Performance
1. Ouvrir DevTools (F12)
2. Onglet **Performance**
3. Cliquer sur **Record** (⚫)
4. Naviguer vers une autre page
5. Utiliser le bouton "Retour"
6. Arrêter l'enregistrement

### Résultat attendu
- **Avec bfcache** : Temps de navigation < 100ms
- **Sans bfcache** : Temps de navigation > 500ms

---

## Test 7 : Lighthouse

### Commande
```bash
npx lighthouse http://localhost:3000 --view --preset=mobile
```

### Section à vérifier
Chercher : **"Page prevented back/forward cache restoration"**

### Résultat attendu
✅ Cette section ne doit PAS apparaître dans le rapport  
✅ Ou afficher : **"0 failure reasons"**

---

## Test 8 : Test Mobile Réel

### Étapes (sur smartphone)
1. Ouvrir le site MISSPO
2. Naviguer vers "Services"
3. Utiliser le geste "retour" du navigateur
4. Observer la vitesse de restauration

### Résultat attendu
- Restauration instantanée (< 100ms)
- Pas de flash blanc
- Pas de rechargement visible
- Indicateur passe en mode "Polling"

---

## Test 9 : Vérification des Logs

### Dans la console du navigateur
```javascript
// Activer les logs détaillés
localStorage.setItem('debug', 'RealtimeManager:*')
```

### Logs attendus lors de la navigation
```
[RealtimeManager] Page hiding - closing WebSocket for bfcache
[RealtimeManager] Disconnected WebSocket
[RealtimeManager] Page restored from bfcache - switching to polling
[RealtimeManager] Stopped polling
[RealtimeManager] Starting polling (interval: 60000ms)
```

### Logs attendus lors de la reconnexion
```
[RealtimeManager] User interaction detected - reconnecting WebSocket
[RealtimeManager] Stopped polling
[RealtimeManager] Reconnected WebSocket
```

---

## Test 10 : Test de Régression Admin

### Étapes
1. Se connecter à `/adminmisspo/login`
2. Accéder au dashboard
3. Naviguer vers une autre page admin
4. Utiliser le bouton "Retour"

### Résultat attendu
❌ La page admin ne doit PAS être restaurée depuis bfcache (sécurité)  
✅ La page doit se recharger complètement  
✅ L'authentification doit être vérifiée à chaque chargement

---

## Checklist Complète

### Fonctionnalités
- [ ] bfcache actif sur pages publiques
- [ ] bfcache désactivé sur pages admin
- [ ] WebSocket se ferme proprement sur `pagehide`
- [ ] Mode polling activé après restauration bfcache
- [ ] Reconnexion WebSocket sur interaction utilisateur
- [ ] Indicateur de statut affiche le bon mode
- [ ] Compte à rebours du polling fonctionnel

### Performance
- [ ] Navigation arrière/avant < 100ms
- [ ] Pas de forced reflow lors de la restauration
- [ ] Pas de rechargement JavaScript
- [ ] Pas de requêtes réseau inutiles

### Sécurité
- [ ] Pages admin non cachées
- [ ] Authentification vérifiée à chaque chargement admin
- [ ] Pas de données sensibles dans le cache

---

## Dépannage

### Problème : bfcache ne fonctionne pas

**Causes possibles** :
1. WebSocket encore ouvert → Vérifier les logs `pagehide`
2. Cache-Control incorrect → Vérifier les headers HTTP
3. Extension de navigateur → Tester en mode incognito
4. Unload listeners → Vérifier qu'il n'y a pas de `beforeunload`

**Solution** :
```javascript
// Vérifier dans la console
window.addEventListener('pagehide', () => {
  console.log('WebSocket state:', echo?.connector?.socket?.readyState)
})
```

### Problème : Reconnexion ne fonctionne pas

**Causes possibles** :
1. Event listeners non attachés
2. Flag `isRestoredFromBfcache` non défini
3. Erreur dans `setupReconnectOnInteraction()`

**Solution** :
```javascript
// Forcer la reconnexion manuellement
const manager = getRealtimeManager()
manager.switchMode('websocket', 'manual_reconnect')
```

### Problème : Indicateur ne s'affiche pas

**Causes possibles** :
1. Composant `RealtimeStatus` non monté
2. Z-index trop bas
3. CSS non chargé

**Solution** :
Vérifier que le composant est bien importé dans le layout principal.

---

## Ressources

- [MDN - Back/forward cache](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#back_forward_cache)
- [web.dev - bfcache](https://web.dev/bfcache/)
- [Chrome DevTools - bfcache testing](https://developer.chrome.com/docs/devtools/application/back-forward-cache/)

---

**Date de création** : Février 2026  
**Version** : 1.0  
**Statut** : ✅ Prêt pour les tests
