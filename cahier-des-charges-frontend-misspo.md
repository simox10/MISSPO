# Cahier des Charges Frontend - MISSPO
## Application Web de Réservation Anti-Poux

**Version:** 1.0 Frontend  
**Date:** 15 Février 2026  
**Objectif:** Créer l'interface client (site public) avec v0/Lovable

---

## 1. PRÉSENTATION DU PROJET

**MISSPO** est un service professionnel de traitement anti-poux intervenant dans les écoles et à domicile à Casablanca.

**Objectif du site:**
- Présenter les services de manière professionnelle et rassurante
- Permettre aux clients de prendre rendez-vous facilement
- Interface bilingue (Français/Arabe)

---

## 2. PAGES DU SITE CLIENT

### 2.1. Page d'Accueil

**Hero Section:**
- Titre: "Misspo – Spécialiste du traitement anti-poux"
- Sous-titre: "Intervention en milieu scolaire & à domicile"
- Bouton CTA: "Prendre Rendez-vous"
- Image/illustration professionnelle

**Section Présentation:**
- Description courte de MISSPO
- Points clés avec icônes:
  - 🏫 Interventions dans les écoles
  - 🏠 Interventions à domicile
  - 👩‍⚕️ Équipe formée
  - 🪮 Matériel professionnel

**Section Services (Aperçu):**
- 2 cartes visuelles pour les packs
- Bouton "Découvrir nos services"

**Section Valeurs:**
- ✅ Hygiène irréprochable
- ✅ Sécurité des enfants
- ✅ Discrétion
- ✅ Efficacité
- ✅ Respect du cuir chevelu

**Footer:**
- Liens navigation
- Informations contact
- Sélecteur de langue (FR/AR)

---

### 2.2. Page "Nos Services"

**Pack 1: 🏫 Pack École**
- Titre: "Pack École - Diagnostic + Aspirateur anti-poux + Peigne"
- Description:
  - Diagnostic précis
  - Aspirateur anti-poux professionnel
  - Élimination mécanique des poux et lentes
  - Intervention discrète en établissement
  - Autorisation parentale obligatoire
- Tarif: "Sur devis selon le nombre d'enfants"
- Bouton: "Demander un devis"

**Pack 2: 🏠 Pack Domicile**
- Titre: "Pack Domicile - Traitement complet à domicile"
- Description:
  - Diagnostic complet
  - Traitement anti-poux
  - Aspirateur + peigne
  - Conseils de prévention
- Tarif: "250 DH"
- Bouton: "Prendre Rendez-vous"

**Section Protocole:**
- 1️⃣ Diagnostic: Vérification minutieuse
- 2️⃣ Traitement: Aspirateur + Peigne spécial
- 3️⃣ Hygiène: Matériel désinfecté
- 4️⃣ Prévention: Conseils personnalisés
- Message: "Aucun produit agressif – méthode douce et efficace"

**Tableau Récapitulatif:**
```
┌─────────────────┬──────────────────────────────────┬─────────────┐
│ Service         │ Contenu                          │ Prix        │
├─────────────────┼──────────────────────────────────┼─────────────┤
│ Pack École      │ Diagnostic + Aspirateur + Peigne │ Sur devis   │
│ Pack Domicile   │ Traitement complet à domicile    │ 250 DH      │
└─────────────────┴──────────────────────────────────┴─────────────┘
```

---

### 2.3. Page "Qui Sommes-nous"

**Section À propos:**
- Présentation de MISSPO
- Mission et approche bienveillante
- Accompagnement des écoles, parents et enfants

**Section Valeurs:**
- Liste des 5 valeurs principales

**Section FAQ (Accordéon):**

Questions essentielles:

1. **Le traitement est-il douloureux pour l'enfant?**
   - Non, méthode douce et non traumatisante, sans produits chimiques agressifs

2. **Combien de temps dure une séance?**
   - [Durée selon le pack]

3. **Intervenez-vous dans toutes les écoles?**
   - Oui, dans les écoles de Casablanca avec autorisation parentale obligatoire

4. **Le traitement est-il efficace dès la première séance?**
   - Oui, élimination dès la première intervention + conseils de prévention

5. **Quels sont vos horaires d'intervention?**
   - [Horaires dynamiques selon config admin]

6. **Comment prendre rendez-vous?**
   - Formulaire en ligne, téléphone 0622945571, ou WhatsApp

7. **Le paiement se fait comment?**
   - En espèces sur place après la séance

8. **Faut-il préparer quelque chose avant l'intervention?**
   - Non, nous apportons tout. Pour domicile: cheveux secs

---

### 2.4. Page "Contact"

**Informations de Contact:**
- 📍 Ville: Casablanca
- 📞 Téléphone/WhatsApp: 0622945571
- 📧 Email: wafaaoubouali91@gmail.com

**Formulaire de Contact:**
- Nom complet (requis)
- Téléphone (requis)
- Email (requis)
- Message (optionnel)
- Bouton "Envoyer"

**Boutons d'Action Rapide:**
- "Appeler maintenant" (tel:)
- "WhatsApp" (lien direct)
- "Envoyer un email" (mailto:)

---

### 2.5. Formulaire de Prise de Rendez-vous

**Modal/Page dédiée accessible depuis:**
- Bouton "Prendre Rendez-vous" (header, accueil, services)

**Champs du Formulaire:**

1. **Choix du Pack** (requis):
   - Radio: Pack École / Pack Domicile
   - Affichage du prix

2. **Informations Client** (requis):
   - Nom complet
   - Téléphone
   - Email
   - Adresse (si Pack Domicile)
   - Nom de l'école (si Pack École)

3. **Sélection Date et Heure** (requis):
   - Calendrier interactif
   - Créneaux disponibles affichés
   - Durée selon le pack

4. **Message/Notes** (optionnel):
   - Zone de texte libre

5. **Validation:**
   - Bouton "Envoyer la demande"
   - Message de confirmation après envoi

**Validation Frontend:**
- Tous les champs requis remplis
- Format email valide
- Format téléphone valide (06XXXXXXXX ou 07XXXXXXXX)
- Date/heure dans le futur
- Créneau disponible

---

## 3. DESIGN & IDENTITÉ VISUELLE

### 3.1. Palette de Couleurs MISSPO

**Couleurs Principales (Roses):**
- `#ED7A97` - Petal Rouge (boutons principaux, CTA)
- `#F29CB1` - Pink Mist (hover, accents)
- `#F6BDCB` - Soft Blossom (backgrounds légers)
- `#FBDEE5` - Petal Frost (sections, cards)

**Couleur Neutre:**
- `#FFFFFF` - White (backgrounds principaux)

**Couleurs Complémentaires (Bleus):**
- `#E5F4F9` - Azure Mist (backgrounds légers)
- `#CBE8F2` - Pale Sky (cards, bordures)
- `#96D0E5` - Sky Blue Light (accents, liens)
- `#2DA1CA` - Blue Green (liens, icônes)

**Texte:**
- `#333333` - Gris foncé (texte principal)
- `#4B5563` - Gris moyen (texte secondaire)

### 3.2. Typographie

**Polices:**
- Titres: Poppins (600-700)
- Corps: Inter (400-500)

**Hiérarchie:**
- H1: 48px (mobile: 32px) - Poppins Bold
- H2: 36px (mobile: 28px) - Poppins Semi-Bold
- H3: 28px (mobile: 24px) - Poppins Semi-Bold
- Body: 16px - Inter Regular

### 3.3. Composants UI

**Boutons:**
- Primaire: Fond `#ED7A97`, texte blanc, hover `#F29CB1`
- Secondaire: Fond `#2DA1CA`, texte blanc, hover `#96D0E5`
- Border radius: 8px
- Padding: 12px 24px

**Cards:**
- Fond: `#FFFFFF`
- Bordure: `#CBE8F2`
- Border radius: 12px
- Padding: 24px
- Hover: Bordure `#ED7A97` + ombre

**Sections:**
- Alternance: Blanc / `#E5F4F9` / `#FBDEE5`
- Espacement entre sections: 64px (desktop), 48px (mobile)

### 3.4. Animations

**Transitions:**
- Durée standard: 300ms
- Easing: ease-in-out
- Hover boutons: scale(1.05) + ombre
- Scroll animations: fade-in, slide-up

---

## 4. FONCTIONNALITÉS TRANSVERSALES

### 4.1. Multilingue (FR/AR)

**Implémentation:**
- Sélecteur de langue dans header/footer
- Langue par défaut: Français
- Traduction complète de tous les textes
- Adaptation RTL pour l'arabe
- Stockage préférence (localStorage)

**Éléments à traduire:**
- Navigation
- Tous les textes des pages
- Formulaires et labels
- Messages d'erreur/succès
- FAQ
- Footer

### 4.2. Navigation

**Menu Principal:**
- Accueil
- Nos Services
- Qui Sommes-nous
- Contact
- Bouton "Prendre Rendez-vous" (mis en évidence)
- Sélecteur de langue

**Menu Mobile:**
- Hamburger menu
- Animation fluide
- Même structure adaptée

### 4.3. Responsive Design

**Breakpoints:**
- Mobile: 320px - 767px
- Tablette: 768px - 1023px
- Desktop: 1024px+

**Priorités:**
- Mobile-first
- Touch-friendly
- Images responsive
- Formulaires adaptés

---

## 5. EXIGENCES TECHNIQUES

### 5.1. Performance

- Temps de chargement < 3 secondes
- Lazy loading des images
- Images optimisées (WebP)
- Code minifié

### 5.2. Accessibilité

- Contraste WCAG AA minimum
- Textes alternatifs pour images
- Navigation au clavier
- Labels ARIA
- Taille police minimum 16px

### 5.3. SEO

- Meta tags optimisés
- Structure HTML sémantique
- URLs propres
- Balises alt sur images

### 5.4. Compatibilité

**Navigateurs:**
- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

**Mobile:**
- Safari iOS
- Chrome Android

---

## 6. INTÉGRATION BACKEND (À PRÉVOIR)

### 6.1. API Endpoints Nécessaires

**Pour le site client:**

```
GET  /api/packs
     → Liste des packs actifs (Pack École, Pack Domicile)

GET  /api/appointments/available-slots
     → Créneaux disponibles selon date et pack
     Params: date, pack_id

POST /api/appointments
     → Créer une demande de rendez-vous
     Body: {
       pack_id, client_name, client_phone, 
       client_email, client_address, school_name,
       appointment_date, appointment_time, notes
     }

GET  /api/faqs
     → Liste des FAQ actives

POST /api/contact
     → Envoyer un message de contact
```

### 6.2. Format des Réponses API

**Exemple - Liste des packs:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_fr": "Pack École",
      "name_ar": "باقة المدرسة",
      "description_fr": "...",
      "description_ar": "...",
      "price": null,
      "price_text_fr": "Sur devis",
      "price_text_ar": "حسب الطلب",
      "duration": 45
    },
    {
      "id": 2,
      "name_fr": "Pack Domicile",
      "name_ar": "باقة المنزل",
      "description_fr": "...",
      "description_ar": "...",
      "price": 250,
      "price_text_fr": "250 DH",
      "price_text_ar": "250 درهم",
      "duration": 60
    }
  ]
}
```

**Exemple - Créneaux disponibles:**
```json
{
  "success": true,
  "data": {
    "date": "2026-02-20",
    "slots": [
      "09:00", "09:30", "10:00", "10:30",
      "14:00", "14:30", "15:00", "15:30"
    ]
  }
}
```

---

## 7. PANEL ADMIN (APERÇU)

**Note:** Le panel admin sera développé séparément en backend.

**Fonctionnalités principales:**
- Gestion des rendez-vous (liste, détails, changement de statut)
- Vue calendrier des rendez-vous
- Inbox pour nouvelles demandes
- Gestion des horaires de travail
- Gestion des fermetures exceptionnelles
- Gestion du contenu (services, FAQ)
- Statistiques basiques

**Statuts des rendez-vous:**
- 🟡 En attente (nouvelle demande)
- 🟢 Confirmé (validé par admin)
- 🔵 Terminé (séance effectuée)
- 🔴 Refusé (demande refusée)

---

## 8. LIVRABLES FRONTEND

### 8.1. Code Source

- Code React/Next.js propre et commenté
- Composants réutilisables
- Structure de dossiers organisée
- Configuration Tailwind CSS
- Fichiers de traduction (FR/AR)

### 8.2. Assets

- Logo MISSPO (SVG, PNG)
- Images optimisées
- Icônes
- Polices (Poppins, Inter)

### 8.3. Documentation

- README avec instructions d'installation
- Guide de déploiement
- Documentation des composants
- Variables d'environnement (.env.example)

---

## 9. CHECKLIST DE DÉVELOPPEMENT

### Phase 1: Setup
- [ ] Initialiser le projet (Next.js + React)
- [ ] Configurer Tailwind CSS
- [ ] Configurer i18next (multilingue)
- [ ] Créer la structure de dossiers
- [ ] Intégrer les polices (Poppins, Inter)

### Phase 2: Composants de Base
- [ ] Header avec navigation
- [ ] Footer
- [ ] Sélecteur de langue
- [ ] Boutons (primaire, secondaire)
- [ ] Cards
- [ ] Modal

### Phase 3: Pages
- [ ] Page d'accueil
- [ ] Page "Nos Services"
- [ ] Page "Qui Sommes-nous" (avec FAQ accordéon)
- [ ] Page "Contact"

### Phase 4: Formulaire de Réservation
- [ ] Interface du formulaire
- [ ] Validation frontend
- [ ] Calendrier interactif
- [ ] Affichage des créneaux disponibles
- [ ] Messages de confirmation/erreur

### Phase 5: Multilingue
- [ ] Fichiers de traduction FR
- [ ] Fichiers de traduction AR
- [ ] Adaptation RTL pour l'arabe
- [ ] Test de toutes les pages en FR/AR

### Phase 6: Responsive
- [ ] Test mobile (320px, 375px, 414px)
- [ ] Test tablette (768px)
- [ ] Test desktop (1024px, 1440px, 1920px)

### Phase 7: Optimisation
- [ ] Optimisation des images
- [ ] Lazy loading
- [ ] Animations fluides
- [ ] Performance (Lighthouse)
- [ ] Accessibilité (WCAG AA)

### Phase 8: Tests
- [ ] Test de tous les formulaires
- [ ] Test de navigation
- [ ] Test multilingue
- [ ] Test responsive
- [ ] Test compatibilité navigateurs

---

## 10. RESSOURCES

### 10.1. Liens Utiles

- **v0.dev:** https://v0.dev
- **Lovable:** https://lovable.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Heroicons:** https://heroicons.com
- **Google Fonts:** https://fonts.google.com

### 10.2. Bibliothèques Recommandées

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "framer-motion": "^10.0.0",
    "react-hook-form": "^7.0.0",
    "axios": "^1.0.0",
    "react-i18next": "^13.0.0",
    "i18next": "^23.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

---

## 11. CONTACT

**Client:** MISSPO  
**Téléphone:** 0622945571  
**Email:** wafaaoubouali91@gmail.com  
**Ville:** Casablanca

---

**Document créé le:** 15 Février 2026  
**Version:** 1.0 Frontend  
**Statut:** Prêt pour développement avec v0/Lovable

---

## NOTES IMPORTANTES

1. **Focus Frontend:** Ce document se concentre sur l'interface client uniquement
2. **Backend à prévoir:** Les endpoints API devront être développés séparément
3. **Mock Data:** Utiliser des données fictives pour le développement initial
4. **Responsive First:** Priorité au mobile-first design
5. **Accessibilité:** Respecter les normes WCAG AA minimum
6. **Performance:** Optimiser pour un chargement rapide
7. **Multilingue:** Prévoir dès le début la structure FR/AR

**Bon développement! 🚀**
