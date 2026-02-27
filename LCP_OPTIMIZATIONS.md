# Optimisations LCP (Largest Contentful Paint) - MISSPO

## Problème identifié : LCP = 4,620ms

### Breakdown du problème
| Métrique | Durée | % du total | Statut |
|----------|-------|------------|--------|
| Element Render Delay | 3,880ms | 84% | 🔴 CRITIQUE |
| Time to First Byte (TTFB) | 540ms | 12% | 🟡 À améliorer |
| Resource Load Duration | 170ms | 4% | 🟢 Acceptable |
| Resource Load Delay | 30ms | <1% | 🟢 Bon |

## Solutions appliquées

### 🔴 Priorité 1 : Réduction Element Render Delay (3,880ms → <500ms)

#### 1. Suppression de Parallax sur l'image LCP
**Avant :**
```jsx
<Parallax speed={-15} className="absolute inset-0">
  <Image src="/oncom.png" priority />
</Parallax>
```

**Après :**
```jsx
<div className="absolute inset-0">
  <Image src="/oncom.png" priority fetchPriority="high" />
</div>
```
**Gain estimé : -2,000ms**

#### 2. Suppression des animations bloquantes (SplitText, BlurText)
**Avant :**
```jsx
<SplitText text={t.hero.title} delay={0.10} />
<BlurText text={t.hero.subtitle2} delay={150} />
```

**Après :**
```jsx
<span>{t.hero.title}</span>
<span>{t.hero.subtitle2}</span>
```
**Gain estimé : -1,000ms**

#### 3. Preload de l'image critique
**Ajouté dans layout.tsx :**
```jsx
<link
  rel="preload"
  as="image"
  href="/oncom.png"
  fetchPriority="high"
/>
```
**Gain estimé : -500ms**

#### 4. Optimisation des fonts
**Ajouté :**
```typescript
const poppins = Poppins({
  display: "swap",  // Évite le blocage du rendu
  preload: true,
})
```
**Gain estimé : -300ms**

### 🟡 Priorité 2 : Amélioration TTFB (540ms → <200ms)

#### 1. Headers de cache (middleware.ts)
```typescript
response.headers.set(
  'Cache-Control',
  'public, max-age=31536000, immutable'
)
```

#### 2. Configuration Vercel (vercel.json)
- Cache statique : 1 an
- Cache images : 1 an
- Headers de sécurité

#### 3. Next.js optimizations (next.config.mjs)
```javascript
{
  compress: true,
  swcMinify: true,
  output: 'standalone',
}
```

**Gain estimé : -200ms**

### 🟢 Priorité 3 : Optimisation continue

#### 1. Composant LazyAnimation
Pour charger les animations après le LCP :
```jsx
<LazyAnimation delay={100}>
  <SplitText text="..." />
</LazyAnimation>
```

#### 2. Formats d'image modernes
- AVIF (meilleur compression)
- WebP (fallback)
- Qualité optimisée : 65%

## Fichiers modifiés

### Components
- ✅ `components/home/hero-section.tsx` - Suppression Parallax + animations
- ✅ `app/layout.tsx` - Preload image + fonts optimisées

### Configuration
- ✅ `next.config.mjs` - Optimisations performance
- ✅ `middleware.ts` - Headers de cache
- ✅ `vercel.json` - Configuration hébergement

### Nouveaux utilitaires
- ✅ `components/lazy-animations.tsx` - Lazy load animations

## Résultats attendus

### Avant optimisation
```
LCP: 4,620ms
├─ Element Render Delay: 3,880ms (84%)
├─ TTFB: 540ms (12%)
├─ Resource Load: 170ms (4%)
└─ Resource Delay: 30ms (<1%)
```

### Après optimisation (estimé)
```
LCP: 1,200ms (-74%)
├─ Element Render Delay: 400ms (-90%)
├─ TTFB: 300ms (-44%)
├─ Resource Load: 170ms (=)
└─ Resource Delay: 30ms (=)
```

### Impact sur les Core Web Vitals
| Métrique | Avant | Après | Objectif |
|----------|-------|-------|----------|
| LCP | 4,620ms | ~1,200ms | <2,500ms ✅ |
| FID | - | - | <100ms |
| CLS | - | - | <0.1 |
| Performance Score | 68 | ~90 | >90 ✅ |

## Checklist de déploiement

### Avant le déploiement
- [ ] Tester en local avec `npm run build && npm start`
- [ ] Vérifier Lighthouse en mode production
- [ ] Tester sur mobile et desktop
- [ ] Vérifier que les images s'affichent correctement

### Après le déploiement
- [ ] Vérifier LCP avec Chrome DevTools
- [ ] Tester sur PageSpeed Insights
- [ ] Monitorer avec Vercel Analytics
- [ ] Vérifier les Core Web Vitals dans Search Console

## Monitoring continu

### Outils recommandés
1. **Chrome DevTools** - Performance tab
2. **Lighthouse** - Audits automatiques
3. **PageSpeed Insights** - Données réelles
4. **Vercel Analytics** - Monitoring en production
5. **Google Search Console** - Core Web Vitals

### Métriques à surveiller
- LCP < 2.5s (Good)
- FID < 100ms (Good)
- CLS < 0.1 (Good)
- TTFB < 200ms
- Performance Score > 90

## Prochaines optimisations

### Court terme
- [ ] Compresser davantage oncom.png (TinyPNG, Squoosh)
- [ ] Utiliser un CDN (Cloudflare, Vercel Edge)
- [ ] Lazy load des sections hors viewport

### Moyen terme
- [ ] Code splitting agressif
- [ ] Service Worker pour cache offline
- [ ] Preconnect aux domaines externes
- [ ] Critical CSS inline

### Long terme
- [ ] Migration vers App Router complet
- [ ] Server Components pour réduire JS
- [ ] Streaming SSR
- [ ] Edge Functions pour TTFB optimal
