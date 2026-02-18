export type Reservation = {
  id: number
  date: string
  heure: string
  nom: string
  prenom: string
  telephone: string
  email: string
  pack: "École" | "Domicile"
  adresse?: string
  ecole?: string
  statut: "Confirmée" | "En attente" | "Annulée"
  notes?: string
}

export const reservations: Reservation[] = [
  {
    id: 1,
    date: "2026-02-20",
    heure: "10:00",
    nom: "Alami",
    prenom: "Sara",
    telephone: "0612345678",
    email: "sara.alami@email.com",
    pack: "Domicile",
    adresse: "Casablanca, Maarif, Rue 12",
    statut: "Confirmée",
    notes: "Préfère le matin"
  },
  {
    id: 2,
    date: "2026-02-21",
    heure: "14:00",
    nom: "Bennani",
    prenom: "Ahmed",
    telephone: "0623456789",
    email: "ahmed.bennani@email.com",
    pack: "École",
    ecole: "École Al Madina",
    statut: "En attente",
    notes: ""
  },
  {
    id: 3,
    date: "2026-02-22",
    heure: "09:30",
    nom: "El Fassi",
    prenom: "Fatima",
    telephone: "0634567890",
    email: "fatima.elfassi@email.com",
    pack: "Domicile",
    adresse: "Casablanca, Anfa, Avenue Hassan II",
    statut: "Confirmée",
    notes: "2 enfants"
  },
  {
    id: 4,
    date: "2026-02-23",
    heure: "11:00",
    nom: "Tazi",
    prenom: "Karim",
    telephone: "0645678901",
    email: "karim.tazi@email.com",
    pack: "École",
    ecole: "Groupe Scolaire La Résidence",
    statut: "Confirmée",
    notes: ""
  },
  {
    id: 5,
    date: "2026-02-24",
    heure: "15:30",
    nom: "Idrissi",
    prenom: "Amina",
    telephone: "0656789012",
    email: "amina.idrissi@email.com",
    pack: "Domicile",
    adresse: "Casablanca, Bourgogne, Rue des Roses",
    statut: "Annulée",
    notes: "Client a annulé"
  },
  {
    id: 6,
    date: "2026-02-25",
    heure: "10:30",
    nom: "Berrada",
    prenom: "Youssef",
    telephone: "0667890123",
    email: "youssef.berrada@email.com",
    pack: "École",
    ecole: "École Internationale de Casablanca",
    statut: "En attente",
    notes: ""
  },
  {
    id: 7,
    date: "2026-02-26",
    heure: "13:00",
    nom: "Lahlou",
    prenom: "Nadia",
    telephone: "0678901234",
    email: "nadia.lahlou@email.com",
    pack: "Domicile",
    adresse: "Casablanca, Californie, Boulevard Zerktouni",
    statut: "Confirmée",
    notes: "Urgence"
  },
  {
    id: 8,
    date: "2026-02-27",
    heure: "16:00",
    nom: "Chakir",
    prenom: "Hassan",
    telephone: "0689012345",
    email: "hassan.chakir@email.com",
    pack: "École",
    ecole: "Lycée Lyautey",
    statut: "Confirmée",
    notes: ""
  },
]
