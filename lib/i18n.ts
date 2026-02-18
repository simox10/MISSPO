export type Locale = "fr" | "ar"

export const translations = {
  fr: {
    // Nav
    nav: {
      home: "Accueil",
      services: "Nos Services",
      about: "Qui Sommes-nous",
      contact: "Contact",
      booking: "Prendre Rendez-vous",
    },
    // Hero
    hero: {
      title: "Misspo",
      subtitle: "Sp\u00e9cialiste du traitement anti-poux",
      description: "Intervention professionnelle en milieu scolaire et \u00e0 domicile. Une m\u00e9thode douce, efficace et rassurante.",
      cta: "Prendre Rendez-vous",
      phone: "0622945571",
    },
    // Badges
    badges: {
      guarantee: "Garantie",
      hygiene: "Hygi\u00e8ne Certifi\u00e9e",
      team: "\u00c9quipe Form\u00e9e",
      method: "M\u00e9thode Douce",
    },
    // Presentation
    presentation: {
      title: "Qui est MISSPO ?",
      description: "MISSPO est votre sp\u00e9cialiste du traitement anti-poux \u00e0 Casablanca. Nous proposons une solution professionnelle, douce et efficace pour \u00e9liminer les poux et les lentes sans produits chimiques agressifs.",
      weIntervene: "Nous intervenons :",
      school: "Dans les \u00e9coles",
      home: "\u00c0 domicile",
      trainedTeam: "Avec une \u00e9quipe form\u00e9e",
      proEquipment: "\u00c0 l'aide de mat\u00e9riel professionnel",
      keyMessage: "Une solution efficace, douce et rassurante pour les parents et les \u00e9tablissements",
    },
    // Services Preview
    servicesPreview: {
      title: "Nos Services",
      subtitle: "Deux solutions adapt\u00e9es \u00e0 vos besoins",
      discoverBtn: "D\u00e9couvrir nos services",
    },
    // Pack details
    packs: {
      school: {
        title: "Pack \u00c9cole",
        subtitle: "Intervention professionnelle en milieu scolaire",
        description: "Diagnostic + Aspirateur anti-poux + Peigne",
        features: [
          "Diagnostic pr\u00e9cis",
          "Aspirateur professionnel",
          "Intervention discr\u00e8te",
          "Autorisation parentale",
        ],
        price: "Sur Devis",
        cta: "Demander un Devis",
      },
      home: {
        title: "Pack Domicile",
        subtitle: "Traitement complet \u00e0 votre domicile",
        description: "Traitement complet \u00e0 domicile",
        features: [
          "Diagnostic complet",
          "Traitement professionnel",
          "Conseils personnalis\u00e9s",
          "Intervention rapide",
        ],
        price: "250 DH",
        cta: "R\u00e9server Maintenant",
      },
    },
    // Values
    values: {
      title: "Nos Valeurs",
      subtitle: "Ce qui nous distingue",
      valueLabel: "Valeur",
      hygiene: "Hygi\u00e8ne irr\u00e9prochable",
      safety: "S\u00e9curit\u00e9 des enfants",
      discretion: "Discr\u00e9tion absolue",
      efficiency: "Efficacit\u00e9 garantie",
      respect: "Respect du cuir chevelu",
      hoverText: "Hover pour plus d'informations",
      hygieneDesc: "Matériel désinfecté après chaque intervention. Protocole strict d'hygiène pour garantir votre sécurité.",
      safetyDesc: "Méthode douce et non traumatisante adaptée aux enfants. Votre enfant est entre de bonnes mains.",
      discretionDesc: "Intervention discrète et respectueuse. Confidentialité totale garantie pour préserver la dignité de chacun.",
      efficiencyDesc: "Résultats visibles dès la première séance. Élimination complète des poux et lentes garantie.",
      respectDesc: "Techniques douces sans produits chimiques agressifs. Respect total du cuir chevelu sensible des enfants.",
    },
    // CTA Section
    ctaSection: {
      title: "Pr\u00eat \u00e0 Commencer ?",
      description: "Prenez rendez-vous d\u00e8s maintenant pour un traitement professionnel et efficace",
      cta: "Prendre Rendez-vous",
    },
    // Protocol
    protocol: {
      title: "Notre Protocole",
      subtitle: "En 4 \u00c9tapes",
      description: "Une m\u00e9thode professionnelle pour une efficacit\u00e9 maximale",
      steps: [
        {
          title: "Diagnostic",
          description: "V\u00e9rification minutieuse du cuir chevelu",
        },
        {
          title: "Traitement",
          description: "Aspirateur professionnel et peigne sp\u00e9cialis\u00e9",
        },
        {
          title: "Hygi\u00e8ne",
          description: "Mat\u00e9riel d\u00e9sinfect\u00e9 apr\u00e8s chaque enfant",
        },
        {
          title: "Pr\u00e9vention",
          description: "Conseils personnalis\u00e9s aux parents",
        },
      ],
      message: "M\u00e9thode 100% m\u00e9canique et douce, sans produits agressifs",
    },
    // Pricing Table
    pricingTable: {
      title: "Tableau R\u00e9capitulatif",
      service: "Service",
      content: "Contenu",
      price: "Prix",
      note: "Tarifs pr\u00e9f\u00e9rentiels pour les \u00e9coles et groupes",
    },
    // About
    about: {
      title: "Qui sommes-nous ?",
      intro: "Misspo est n\u00e9e d'un besoin r\u00e9el : proposer une alternative professionnelle, propre et s\u00e9curis\u00e9e au traitement des poux chez les enfants.",
      accompany: "Nous accompagnons les \u00e9coles, les parents et les enfants avec une approche bienveillante et non traumatisante.",
      approachTitle: "Notre Approche",
      approachDescription: "Notre équipe qualifiée utilise du matériel professionnel de pointe afin d'assurer un traitement efficace et sans douleur. Chaque intervention respecte un protocole strict d'hygiène et de sécurité pour garantir une prise en charge fiable et sécurisée. Nous veillons au bien-être de chaque enfant en offrant un service professionnel, rassurant et adapté.",
    },
    // FAQ
    faq: {
      title: "Questions Fréquentes",
      subtitle: "Tout ce que vous devez savoir",
      questions: [
        {
          q: "Histoire de pou",
          a: "Le pou est une espèce de parasite datant de bien des millénaires. Le pou a commencé par infester les dinosaures (certaines races comme le dinosaure oiseau), puis les gorilles et pour finir leur route sur la tête des humains. À l'époque, ce parasite avait diverses significations selon les pays, il pouvait être perçu comme un signe de richesse ou bien comme un manque d'hygiène. Toutefois, au fil des années et malgré les préjugés, nous nous sommes rendus compte que le pou avait quelques préférences et exigences. Il préfère davantage un cheveu propre, même si cela reste qu'une préférence. Il aime et a besoin de chaleur, d'obscurité et d'humidité. Comme tout être vivant, le pou a une espérance de vie. La femelle va vivre entre 30 et 40 jours, le mâle lui vivra seulement 15 à 20 jours. Peu importe le sexe, le pou vivra seulement 48h hors du cuir chevelu. La femelle à la capacité de pondre 10 lentes environ par 24h. À l'inverse de tout ce que l'on peut trouver sur le pou, il est important de savoir qu'il ne vole pas, il se déplace uniquement à l'aide de ses 6 pattes. Il se nourrit exclusivement de sang, et restera sur l'être humain.",
        },
        {
          q: "Comment être sûr que mon enfant a des poux ?",
          a: "Le symptôme le plus évident est la démangeaison. L'envie de se gratter est une réaction allergique à la salive que le pou injecte dans le sang pour le fluidité. La salive s'accumule, les symptômes de démangeaison apparaissent. Toutefois, certaines personnes n'ont pas cette réaction allergique. 50% des individus n'ont jamais de démangeaisons. Le meilleur moyen de confirmer une infestation est de bien vérifier la tête. Des traces de lentes à la base du cou et derrière les oreilles sont de bons indicateurs. Passer un peigne cranté dans les cheveux est révélateur. Les vérifications régulières aident à contrôler ce problème. Une bonne pratique serait de passer le peigne cranté une fois par semaine. Le but est de l'intégrer à la routine d'hygiène.",
        },
        {
          q: "Comment les attrape-t-on ?",
          a: "Dans la plupart des cas les poux s'attrapent par contact direct tête contre tête. Ils peuvent toutefois se transmettre par contact indirect avec des objets comme : les brosses à cheveux, les casquettes, les sièges de voiture… ou des activités extra-scolaires comme la natation, l'équitation, l'escrime et les sports de contact. En moyenne, on observe que les infestations ont majoritairement lieu chez les 3-12 ans. Toutefois, des recherches plus récentes ont démontré que la norme a changé pour atteindre surtout les 9-16 ans. Cette évolution est due aux changements sociaux des adolescents, résultant de plus en plus de contacts tête contre tête (portables, selfies, activités extra-scolaire, les sports tels que la natation, l'équitation, l'escrime et les sports de contact…) Dans cette tranche d'âge, les filles sont généralement plus affectées à cause de leur masse de cheveux (un environnement plus sombre et plus chaud) mais aussi par leur longueur (les cheveux longs offrent un moyen de transport plus facile d'une tête à l'autre).",
        },
        {
          q: "Y-a-t-il des profils plus propices que d'autres ?",
          a: "Oui, il y a des personnes qui sont plus propices que d'autres. La cause de cette fragilité est notre odeur corporelle, qui n'est pas perceptible avec notre odorat, mais dont le pou est très sensible. Tout comme son grand ami le moustique. Une personne qui a tendance à se faire souvent piquer par les moustiques, sera une personne qui attire plus les poux. Lors d'une infestation, le pou dépose ses excréments sur le cuir chevelu. Leur odeur est persistante et attire d'autres poux. Ainsi, quelqu'un qui a une « tête à poux » subit souvent une récidive. Les complexes d'huiles essentielles de nos produits permettent d'enlever cette odeur.",
        },
        {
          q: "Seuls les enfants peuvent les attraper ?",
          a: "Absolument pas ! Même s'il est plus commun chez l'enfant, les adultes ne sont pas immunisés. Les poux sont toujours à la recherche de nourriture, surtout si la tête de son hôte devient surpeuplée. Les adultes au contact d'un enfant infesté, ont autant de risques d'en attraper.",
        },
        {
          q: "Pourquoi moi ?",
          a: "Il s'avère que certaines personnes les attirent. Si vous êtes une de ces personnes qui offre un terrain favorable aux poux, faites attention ! Toutefois, certains éléments attirent les poux plus vers une tête plutôt qu'une autre. Le groupe sanguin, par exemple, est un facteur dominant. Les recherches démontrent que les poux évitent les groupes sanguins incompatibles, à moins d'y être contraints. En effet, ils risquent une rupture intestinale en cas d'ingestion d'un sang qu'ils ne tolèrent pas.",
        },
        {
          q: "Existe-t-il une période plus propice aux infestations ?",
          a: "Non, les poux sont présents toute l'année. La période scolaire représente un facteur important. L'été ou encore l'environnement dans lequel nous sommes peut en effet jouer, car le pou aime la chaleur et l'humidité.",
        },
        {
          q: "Une infestation est-elle le signe d'une mauvaise hygiène ?",
          a: "Au contraire ! Le pou aime les cheveux propres où il pourra solidement accrocher ses lentes. Le sébum, la saleté rend les cheveux plus glissants. Cependant, ne pas les laver ne permet pas d'éradiquer l'infestation. La transmission de poux se produit par le contact et non à cause de l'hygiène. Ils se déplacent plus facilement sur un cheveu propre que sur un cheveu sale.",
        },
      ],
    },
    // Contact
    contact: {
      title: "Contactez-Nous",
      subtitle: "Nous sommes \u00e0 votre \u00e9coute",
      location: "Casablanca, Maroc",
      phone: "0622945571",
      email: "wafaaoubouali91@gmail.com",
      locationLabel: "Localisation",
      phoneLabel: "T\u00e9l\u00e9phone",
      emailLabel: "Email",
      formTitle: "Envoyez-nous un Message",
      lastNameField: "Nom",
      firstNameField: "Prénom",
      phoneField: "T\u00e9l\u00e9phone",
      emailField: "Email",
      messageField: "Votre message",
      sendBtn: "Envoyer",
      callBtn: "Appeler maintenant",
      whatsappBtn: "WhatsApp",
      emailBtn: "Envoyer un email",
      successMessage: "Votre message a \u00e9t\u00e9 envoy\u00e9 avec succ\u00e8s !",
    },
    // Booking
    booking: {
      title: "Prendre Rendez-vous",
      subtitle: "R\u00e9servez votre s\u00e9ance de traitement",
      packChoice: "Choix du Pack",
      packSchool: "Pack \u00c9cole",
      packHome: "Pack Domicile",
      priceQuote: "Sur devis",
      priceHome: "250 DH",
      clientInfo: "Informations Client",
      nameField: "Nom complet",
      phoneField: "T\u00e9l\u00e9phone",
      emailField: "Email",
      addressField: "Adresse compl\u00e8te",
      schoolField: "Nom de l'\u00e9cole",
      dateTime: "Date et Heure",
      selectDate: "S\u00e9lectionnez une date",
      selectTime: "S\u00e9lectionnez un cr\u00e9neau",
      notes: "Message / Notes",
      notesPlaceholder: "Pr\u00e9cisions suppl\u00e9mentaires (optionnel)",
      submitBtn: "Envoyer la demande",
      whatsappBtn: "Contacter via WhatsApp",
      successTitle: "Demande envoy\u00e9e !",
      successMessage: "Votre demande a \u00e9t\u00e9 envoy\u00e9e avec succ\u00e8s. Nous vous contacterons rapidement pour confirmer votre rendez-vous.",
      required: "Requis",
      invalidEmail: "Email invalide",
      invalidPhone: "Format: 06XXXXXXXX ou 07XXXXXXXX",
      minChars: "Minimum {n} caract\u00e8res",
      futureDateRequired: "La date doit \u00eatre dans le futur",
      morning: "Matin",
      afternoon: "Apr\u00e8s-midi",
      closed: "Ferm\u00e9",
      unavailable: "Indisponible",
    },
    // Treatment Process
    treatmentProcess: {
      title: "Notre Processus",
      subtitle: "Un traitement en 3 étapes simples",
      step1: {
        title: "Diagnostic Précis",
        description: "Nous passons notre machine brevetée sur l'ensemble de la chevelure afin d'éradiquer les poux. Cette étape est sans douleur et n'abîme pas les cheveux.",
      },
      step2: {
        title: "Application de la Lotion",
        description: "Nous appliquons notre lotion traitante 100% naturelle et efficace sans insecticides chimiques. La lotion est aussi adaptée aux bébés et femmes enceintes. À la fin du traitement les cheveux sont propres et secs.",
      },
      step3: {
        title: "Vérification au Peigne Fin",
        description: "Nous vérifions mèche par mèche que rien ne subsiste afin de vous garantir 100% d'efficacité. Vous pouvez, si vous le souhaitez à la fin du traitement, voir la petite récolte :)",
      },
    },
    // Mission
    mission: {
      title: "Notre Mission",
      subtitle: "Protéger les enfants avec une méthode douce et naturelle",
      description: "Notre méthode vous débarrasse des poux et des lentes en une seule fois. Le temps de traitement varie de 30m à 1H en fonction de la longueur des cheveux et de la contamination. Équipés d'un matériel professionnel dernier cri, nous disposons de l'aspirateur à poux et l'efficacité de notre lotion aux actifs naturels est garantie. Notre équipe de professionnelles est à votre écoute pour vous accompagner dans cette épreuve avec bienveillance et expertise.",
      cta: "Découvrir nos services",
    },
    // Footer
    footer: {
      description: "Sp\u00e9cialiste du traitement anti-poux professionnel \u00e0 Casablanca.",
      quickLinks: "Liens",
      contactInfo: "Contact",
      rights: "\u00a9 2026 MISSPO. Tous droits r\u00e9serv\u00e9s.",
    },
    // Language
    lang: {
      fr: "Fran\u00e7ais",
      ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    },
  },
  ar: {
    nav: {
      home: "\u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629",
      services: "\u062e\u062f\u0645\u0627\u062a\u0646\u0627",
      about: "\u0645\u0646 \u0646\u062d\u0646",
      contact: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627",
      booking: "\u062d\u062c\u0632 \u0645\u0648\u0639\u062f",
    },
    hero: {
      title: "Misspo",
      subtitle: "\u0645\u062a\u062e\u0635\u0635\u0648\u0646 \u0641\u064a \u0639\u0644\u0627\u062c \u0627\u0644\u0642\u0645\u0644",
      description: "\u062a\u062f\u062e\u0644 \u0645\u0647\u0646\u064a \u0641\u064a \u0627\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0641\u064a \u0627\u0644\u0645\u0646\u0632\u0644. \u0637\u0631\u064a\u0642\u0629 \u0644\u0637\u064a\u0641\u0629 \u0648\u0641\u0639\u0627\u0644\u0629 \u0648\u0645\u0637\u0645\u0626\u0646\u0629.",
      cta: "\u062d\u062c\u0632 \u0645\u0648\u0639\u062f",
      phone: "0622945571",
    },
    badges: {
      guarantee: "\u0636\u0645\u0627\u0646",
      hygiene: "\u0646\u0638\u0627\u0641\u0629 \u0645\u0639\u062a\u0645\u062f\u0629",
      team: "\u0641\u0631\u064a\u0642 \u0645\u062f\u0631\u0628",
      method: "\u0637\u0631\u064a\u0642\u0629 \u0644\u0637\u064a\u0641\u0629",
    },
    presentation: {
      title: "\u0645\u0646 \u0647\u064a MISSPO\u061f",
      description: "MISSPO \u0647\u064a \u0645\u062a\u062e\u0635\u0635\u0643\u0645 \u0641\u064a \u0639\u0644\u0627\u062c \u0627\u0644\u0642\u0645\u0644 \u0628\u0627\u0644\u062f\u0627\u0631 \u0627\u0644\u0628\u064a\u0636\u0627\u0621. \u0646\u0642\u062f\u0645 \u062d\u0644\u0627 \u0645\u0647\u0646\u064a\u0627 \u0648\u0644\u0637\u064a\u0641\u0627 \u0648\u0641\u0639\u0627\u0644\u0627 \u0644\u0644\u0642\u0636\u0627\u0621 \u0639\u0644\u0649 \u0627\u0644\u0642\u0645\u0644 \u0648\u0627\u0644\u0635\u0626\u0628\u0627\u0646 \u062f\u0648\u0646 \u0645\u0648\u0627\u062f \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629.",
      weIntervene: "\u0646\u062a\u062f\u062e\u0644 \u0641\u064a:",
      school: "\u0641\u064a \u0627\u0644\u0645\u062f\u0627\u0631\u0633",
      home: "\u0641\u064a \u0627\u0644\u0645\u0646\u0632\u0644",
      trainedTeam: "\u0641\u0631\u064a\u0642 \u0645\u062f\u0631\u0628",
      proEquipment: "\u0628\u0645\u0639\u062f\u0627\u062a \u0645\u0647\u0646\u064a\u0629",
      keyMessage: "\u062d\u0644 \u0641\u0639\u0627\u0644 \u0648\u0644\u0637\u064a\u0641 \u0648\u0645\u0637\u0645\u0626\u0646 \u0644\u0644\u0622\u0628\u0627\u0621 \u0648\u0627\u0644\u0645\u0624\u0633\u0633\u0627\u062a",
    },
    servicesPreview: {
      title: "\u062e\u062f\u0645\u0627\u062a\u0646\u0627",
      subtitle: "\u062d\u0644\u0648\u0644 \u0645\u0643\u064a\u0641\u0629 \u0644\u0627\u062d\u062a\u064a\u0627\u062c\u0627\u062a\u0643\u0645",
      discoverBtn: "\u0627\u0643\u062a\u0634\u0641 \u062e\u062f\u0645\u0627\u062a\u0646\u0627",
    },
    packs: {
      school: {
        title: "\u0628\u0627\u0643 \u0627\u0644\u0645\u062f\u0631\u0633\u0629",
        subtitle: "\u062a\u062f\u062e\u0644 \u0645\u0647\u0646\u064a \u0641\u064a \u0627\u0644\u0645\u062f\u0627\u0631\u0633",
        description: "\u062a\u0634\u062e\u064a\u0635 + \u0634\u0641\u0627\u0637 \u0645\u0636\u0627\u062f \u0644\u0644\u0642\u0645\u0644 + \u0645\u0634\u0637",
        features: [
          "\u062a\u0634\u062e\u064a\u0635 \u062f\u0642\u064a\u0642",
          "\u0634\u0641\u0627\u0637 \u0645\u0647\u0646\u064a",
          "\u062a\u062f\u062e\u0644 \u0633\u0631\u064a",
          "\u0625\u0630\u0646 \u0627\u0644\u0648\u0627\u0644\u062f\u064a\u0646",
        ],
        price: "\u062d\u0633\u0628 \u0627\u0644\u0637\u0644\u0628",
        cta: "\u0637\u0644\u0628 \u0639\u0631\u0636 \u0633\u0639\u0631",
      },
      home: {
        title: "\u0628\u0627\u0643 \u0627\u0644\u0645\u0646\u0632\u0644",
        subtitle: "\u0639\u0644\u0627\u062c \u0643\u0627\u0645\u0644 \u0641\u064a \u0645\u0646\u0632\u0644\u0643",
        description: "\u0639\u0644\u0627\u062c \u0643\u0627\u0645\u0644 \u0641\u064a \u0627\u0644\u0645\u0646\u0632\u0644",
        features: [
          "\u062a\u0634\u062e\u064a\u0635 \u0643\u0627\u0645\u0644",
          "\u0639\u0644\u0627\u062c \u0645\u0647\u0646\u064a",
          "\u0646\u0635\u0627\u0626\u062d \u0634\u062e\u0635\u064a\u0629",
          "\u062a\u062f\u062e\u0644 \u0633\u0631\u064a\u0639",
        ],
        price: "250 \u062f\u0631\u0647\u0645",
        cta: "\u0627\u062d\u062c\u0632 \u0627\u0644\u0622\u0646",
      },
    },
    values: {
      title: "\u0642\u064a\u0645\u0646\u0627",
      subtitle: "\u0645\u0627 \u064a\u0645\u064a\u0632\u0646\u0627",
      valueLabel: "قيمة",
      hygiene: "\u0646\u0638\u0627\u0641\u0629 \u0644\u0627 \u062a\u0634\u0648\u0628\u0647\u0627 \u0634\u0627\u0626\u0628\u0629",
      safety: "\u0633\u0644\u0627\u0645\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644",
      discretion: "\u0633\u0631\u064a\u0629 \u062a\u0627\u0645\u0629",
      efficiency: "\u0641\u0639\u0627\u0644\u064a\u0629 \u0645\u0636\u0645\u0648\u0646\u0629",
      respect: "\u0627\u062d\u062a\u0631\u0627\u0645 \u0641\u0631\u0648\u0629 \u0627\u0644\u0631\u0623\u0633",
      hoverText: "مرر للمزيد من المعلومات",
      hygieneDesc: "تعقيم المعدات بعد كل تدخل. بروتوكول صارم للنظافة لضمان سلامتكم.",
      safetyDesc: "طريقة لطيفة وغير مؤلمة مناسبة للأطفال. طفلك في أيدٍ أمينة.",
      discretionDesc: "تدخل سري ومحترم. سرية تامة مضمونة للحفاظ على كرامة الجميع.",
      efficiencyDesc: "نتائج مرئية من الجلسة الأولى. القضاء الكامل على القمل والصئبان مضمون.",
      respectDesc: "تقنيات لطيفة بدون مواد كيميائية قاسية. احترام تام لفروة رأس الأطفال الحساسة.",
    },
    ctaSection: {
      title: "\u0647\u0644 \u0623\u0646\u062a\u0645 \u0645\u0633\u062a\u0639\u062f\u0648\u0646\u061f",
      description: "\u0627\u062d\u062c\u0632\u0648\u0627 \u0645\u0648\u0639\u062f\u0643\u0645 \u0627\u0644\u0622\u0646 \u0644\u0639\u0644\u0627\u062c \u0645\u0647\u0646\u064a \u0648\u0641\u0639\u0627\u0644",
      cta: "\u062d\u062c\u0632 \u0645\u0648\u0639\u062f",
    },
    protocol: {
      title: "\u0628\u0631\u0648\u062a\u0648\u0643\u0648\u0644\u0646\u0627",
      subtitle: "\u0641\u064a 4 \u062e\u0637\u0648\u0627\u062a",
      description: "\u0637\u0631\u064a\u0642\u0629 \u0645\u0647\u0646\u064a\u0629 \u0644\u0641\u0639\u0627\u0644\u064a\u0629 \u0642\u0635\u0648\u0649",
      steps: [
        {
          title: "\u0627\u0644\u062a\u0634\u062e\u064a\u0635",
          description: "\u0641\u062d\u0635 \u062f\u0642\u064a\u0642 \u0644\u0641\u0631\u0648\u0629 \u0627\u0644\u0631\u0623\u0633",
        },
        {
          title: "\u0627\u0644\u0639\u0644\u0627\u062c",
          description: "\u0634\u0641\u0627\u0637 \u0645\u0647\u0646\u064a \u0648\u0645\u0634\u0637 \u0645\u062a\u062e\u0635\u0635",
        },
        {
          title: "\u0627\u0644\u0646\u0638\u0627\u0641\u0629",
          description: "\u062a\u0639\u0642\u064a\u0645 \u0627\u0644\u0645\u0639\u062f\u0627\u062a \u0628\u0639\u062f \u0643\u0644 \u0637\u0641\u0644",
        },
        {
          title: "\u0627\u0644\u0648\u0642\u0627\u064a\u0629",
          description: "\u0646\u0635\u0627\u0626\u062d \u0634\u062e\u0635\u064a\u0629 \u0644\u0644\u0648\u0627\u0644\u062f\u064a\u0646",
        },
      ],
      message: "\u0637\u0631\u064a\u0642\u0629 \u0645\u064a\u0643\u0627\u0646\u064a\u0643\u064a\u0629 100% \u0648\u0644\u0637\u064a\u0641\u0629\u060c \u0628\u062f\u0648\u0646 \u0645\u0648\u0627\u062f \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629",
    },
    pricingTable: {
      title: "\u062c\u062f\u0648\u0644 \u0627\u0644\u0623\u0633\u0639\u0627\u0631",
      service: "\u0627\u0644\u062e\u062f\u0645\u0629",
      content: "\u0627\u0644\u0645\u062d\u062a\u0648\u0649",
      price: "\u0627\u0644\u0633\u0639\u0631",
      note: "\u0623\u0633\u0639\u0627\u0631 \u062a\u0641\u0636\u064a\u0644\u064a\u0629 \u0644\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a",
    },
    about: {
      title: "\u0645\u0646 \u0646\u062d\u0646\u061f",
      intro: "\u0648\u0644\u062f\u062a Misspo \u0645\u0646 \u062d\u0627\u062c\u0629 \u062d\u0642\u064a\u0642\u064a\u0629: \u062a\u0642\u062f\u064a\u0645 \u0628\u062f\u064a\u0644 \u0645\u0647\u0646\u064a \u0648\u0646\u0638\u064a\u0641 \u0648\u0622\u0645\u0646 \u0644\u0639\u0644\u0627\u062c \u0627\u0644\u0642\u0645\u0644 \u0639\u0646\u062f \u0627\u0644\u0623\u0637\u0641\u0627\u0644.",
      accompany: "\u0646\u0631\u0627\u0641\u0642 \u0627\u0644\u0645\u062f\u0627\u0631\u0633 \u0648\u0627\u0644\u0622\u0628\u0627\u0621 \u0648\u0627\u0644\u0623\u0637\u0641\u0627\u0644 \u0628\u0645\u0646\u0647\u062c \u0644\u0637\u064a\u0641 \u0648\u063a\u064a\u0631 \u0645\u0624\u0644\u0645.",
      approachTitle: "\u0645\u0646\u0647\u062c\u0646\u0627",
      approachDescription: "\u064a\u0633\u062a\u062e\u062f\u0645 \u0641\u0631\u064a\u0642\u0646\u0627 \u0627\u0644\u0645\u062f\u0631\u0628 \u0645\u0639\u062f\u0627\u062a \u0645\u0647\u0646\u064a\u0629 \u0645\u062a\u0637\u0648\u0631\u0629 \u0644\u0636\u0645\u0627\u0646 \u0639\u0644\u0627\u062c \u0641\u0639\u0627\u0644 \u0648\u0628\u062f\u0648\u0646 \u0623\u0644\u0645. \u0643\u0644 \u062a\u062f\u062e\u0644 \u064a\u062a\u0628\u0639 \u0628\u0631\u0648\u062a\u0648\u0643\u0648\u0644 \u0635\u0627\u0631\u0645 \u0644\u0644\u0646\u0638\u0627\u0641\u0629 \u0648\u0627\u0644\u0633\u0644\u0627\u0645\u0629.",
    },
    faq: {
      title: "\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629",
      subtitle: "\u0643\u0644 \u0645\u0627 \u062a\u062d\u062a\u0627\u062c\u0648\u0646 \u0645\u0639\u0631\u0641\u062a\u0647",
      questions: [
        {
          q: "تاريخ القمل",
          a: "القمل هو نوع من الطفيليات يعود تاريخه إلى آلاف السنين. بدأ القمل بإصابة الديناصورات (بعض الأنواع مثل الديناصور الطائر)، ثم الغوريلا وأخيراً انتقل إلى رؤوس البشر. في ذلك الوقت، كان لهذا الطفيلي معانٍ مختلفة حسب البلدان، فقد يُنظر إليه كعلامة على الثراء أو كدليل على قلة النظافة. ومع ذلك، مع مرور السنين وعلى الرغم من الأحكام المسبقة، أدركنا أن القمل له بعض التفضيلات والمتطلبات. فهو يفضل الشعر النظيف أكثر، حتى لو كان ذلك مجرد تفضيل. يحب ويحتاج إلى الدفء والظلام والرطوبة. مثل أي كائن حي، للقمل عمر افتراضي. تعيش الأنثى بين 30 و40 يوماً، بينما يعيش الذكر فقط من 15 إلى 20 يوماً. بغض النظر عن الجنس، يعيش القمل فقط 48 ساعة خارج فروة الرأس. تستطيع الأنثى وضع حوالي 10 صئبان كل 24 ساعة. على عكس كل ما يمكن العثور عليه عن القمل، من المهم معرفة أنه لا يطير، بل يتحرك فقط بمساعدة أرجله الستة. يتغذى حصرياً على الدم، ويبقى على الإنسان.",
        },
        {
          q: "كيف أتأكد من أن طفلي مصاب بالقمل؟",
          a: "العرض الأكثر وضوحاً هو الحكة. الرغبة في الحك هي رد فعل تحسسي للعاب الذي يحقنه القمل في الدم لجعله سائلاً. يتراكم اللعاب، وتظهر أعراض الحكة. ومع ذلك، بعض الأشخاص ليس لديهم هذا التفاعل التحسسي. 50% من الأفراد لا يشعرون بالحكة أبداً. أفضل طريقة لتأكيد الإصابة هي فحص الرأس جيداً. آثار الصئبان في قاعدة الرقبة وخلف الأذنين هي مؤشرات جيدة. تمرير مشط مسنن في الشعر يكشف الإصابة. الفحوصات المنتظمة تساعد في السيطرة على هذه المشكلة. الممارسة الجيدة هي تمرير المشط المسنن مرة واحدة في الأسبوع. الهدف هو دمجه في روتين النظافة.",
        },
        {
          q: "كيف ينتقل القمل؟",
          a: "في معظم الحالات، ينتقل القمل عن طريق الاتصال المباشر رأساً برأس. ومع ذلك، يمكن أن ينتقل عن طريق الاتصال غير المباشر مع أشياء مثل: فرش الشعر، القبعات، مقاعد السيارة... أو الأنشطة اللامنهجية مثل السباحة، ركوب الخيل، المبارزة والرياضات التلامسية. في المتوسط، نلاحظ أن الإصابات تحدث بشكل رئيسي عند الأطفال من 3 إلى 12 سنة. ومع ذلك، أظهرت الأبحاث الحديثة أن المعيار تغير ليصل بشكل خاص إلى الفئة العمرية من 9 إلى 16 سنة. هذا التطور يرجع إلى التغيرات الاجتماعية للمراهقين، مما يؤدي إلى المزيد من الاتصالات رأساً برأس (الهواتف المحمولة، السيلفي، الأنشطة اللامنهجية، الرياضات مثل السباحة، ركوب الخيل، المبارزة والرياضات التلامسية...) في هذه الفئة العمرية، الفتيات عادة أكثر تأثراً بسبب كثافة شعرهن (بيئة أكثر ظلاماً ودفئاً) ولكن أيضاً بسبب طوله (الشعر الطويل يوفر وسيلة نقل أسهل من رأس إلى آخر).",
        },
        {
          q: "هل هناك أشخاص أكثر عرضة من غيرهم؟",
          a: "نعم، هناك أشخاص أكثر عرضة من غيرهم. سبب هذا الضعف هو رائحة جسمنا، التي لا يمكن إدراكها بحاسة الشم لدينا، لكن القمل حساس جداً لها. تماماً مثل صديقه الكبير البعوض. الشخص الذي يميل إلى التعرض للدغ البعوض كثيراً، سيكون شخصاً يجذب القمل أكثر. أثناء الإصابة، يترك القمل فضلاته على فروة الرأس. رائحتها مستمرة وتجذب المزيد من القمل. وبالتالي، فإن الشخص الذي لديه 'رأس للقمل' غالباً ما يعاني من الانتكاس. مركبات الزيوت الأساسية في منتجاتنا تسمح بإزالة هذه الرائحة.",
        },
        {
          q: "هل الأطفال فقط يمكنهم الإصابة بالقمل؟",
          a: "بالتأكيد لا! حتى لو كان أكثر شيوعاً عند الأطفال، فإن البالغين ليسوا محصنين. القمل دائماً يبحث عن الطعام، خاصة إذا أصبح رأس مضيفه مكتظاً. البالغون الذين يتصلون بطفل مصاب، لديهم نفس مخاطر الإصابة.",
        },
        {
          q: "لماذا أنا؟",
          a: "اتضح أن بعض الأشخاص يجذبونهم. إذا كنت أحد هؤلاء الأشخاص الذين يوفرون أرضاً خصبة للقمل، كن حذراً! ومع ذلك، بعض العناصر تجذب القمل أكثر نحو رأس بدلاً من آخر. فصيلة الدم، على سبيل المثال، هي عامل مهيمن. تظهر الأبحاث أن القمل يتجنب فصائل الدم غير المتوافقة، ما لم يُجبر على ذلك. في الواقع، يخاطرون بتمزق الأمعاء في حالة ابتلاع دم لا يتحملونه.",
        },
        {
          q: "هل هناك فترة أكثر ملاءمة للإصابات؟",
          a: "لا، القمل موجود طوال العام. الفترة المدرسية تمثل عاملاً مهماً. الصيف أو البيئة التي نحن فيها يمكن أن تلعب دوراً، لأن القمل يحب الدفء والرطوبة.",
        },
        {
          q: "هل الإصابة علامة على سوء النظافة؟",
          a: "على العكس! القمل يحب الشعر النظيف حيث يمكنه تثبيت صئبانه بقوة. الزهم والأوساخ تجعل الشعر أكثر انزلاقاً. ومع ذلك، عدم غسلها لا يسمح بالقضاء على الإصابة. انتقال القمل يحدث عن طريق الاتصال وليس بسبب النظافة. ينتقلون بسهولة أكبر على الشعر النظيف من الشعر المتسخ.",
        },
      ],
    },
    contact: {
      title: "\u0627\u062a\u0635\u0644\u0648\u0627 \u0628\u0646\u0627",
      subtitle: "\u0646\u062d\u0646 \u0641\u064a \u062e\u062f\u0645\u062a\u0643\u0645",
      location: "\u0627\u0644\u062f\u0627\u0631 \u0627\u0644\u0628\u064a\u0636\u0627\u0621\u060c \u0627\u0644\u0645\u063a\u0631\u0628",
      phone: "0622945571",
      email: "wafaaoubouali91@gmail.com",
      locationLabel: "\u0627\u0644\u0645\u0648\u0642\u0639",
      phoneLabel: "\u0627\u0644\u0647\u0627\u062a\u0641",
      emailLabel: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      formTitle: "\u0623\u0631\u0633\u0644\u0648\u0627 \u0644\u0646\u0627 \u0631\u0633\u0627\u0644\u0629",
      lastNameField: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0639\u0627\u0626\u0644\u064a",
      firstNameField: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0634\u062e\u0635\u064a",
      phoneField: "\u0627\u0644\u0647\u0627\u062a\u0641",
      emailField: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      messageField: "\u0631\u0633\u0627\u0644\u062a\u0643\u0645",
      sendBtn: "\u0625\u0631\u0633\u0627\u0644",
      callBtn: "\u0627\u062a\u0635\u0644 \u0627\u0644\u0622\u0646",
      whatsappBtn: "\u0648\u0627\u062a\u0633\u0627\u0628",
      emailBtn: "\u0625\u0631\u0633\u0627\u0644 \u0628\u0631\u064a\u062f",
      successMessage: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0631\u0633\u0627\u0644\u062a\u0643\u0645 \u0628\u0646\u062c\u0627\u062d!",
    },
    booking: {
      title: "\u062d\u062c\u0632 \u0645\u0648\u0639\u062f",
      subtitle: "\u0627\u062d\u062c\u0632\u0648\u0627 \u062c\u0644\u0633\u0629 \u0627\u0644\u0639\u0644\u0627\u062c",
      packChoice: "\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0628\u0627\u0643",
      packSchool: "\u0628\u0627\u0643 \u0627\u0644\u0645\u062f\u0631\u0633\u0629",
      packHome: "\u0628\u0627\u0643 \u0627\u0644\u0645\u0646\u0632\u0644",
      priceQuote: "\u062d\u0633\u0628 \u0627\u0644\u0637\u0644\u0628",
      priceHome: "250 \u062f\u0631\u0647\u0645",
      clientInfo: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0639\u0645\u064a\u0644",
      nameField: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644",
      phoneField: "\u0627\u0644\u0647\u0627\u062a\u0641",
      emailField: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
      addressField: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0643\u0627\u0645\u0644",
      schoolField: "\u0627\u0633\u0645 \u0627\u0644\u0645\u062f\u0631\u0633\u0629",
      dateTime: "\u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0648\u0627\u0644\u0648\u0642\u062a",
      selectDate: "\u0627\u062e\u062a\u0627\u0631\u0648\u0627 \u062a\u0627\u0631\u064a\u062e\u0627",
      selectTime: "\u0627\u062e\u062a\u0627\u0631\u0648\u0627 \u0648\u0642\u062a\u0627",
      notes: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a",
      notesPlaceholder: "\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0625\u0636\u0627\u0641\u064a\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
      submitBtn: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
      whatsappBtn: "\u062a\u0648\u0627\u0635\u0644 \u0639\u0628\u0631 \u0648\u0627\u062a\u0633\u0627\u0628",
      successTitle: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628!",
      successMessage: "\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0637\u0644\u0628\u0643\u0645 \u0628\u0646\u062c\u0627\u062d. \u0633\u0646\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643\u0645 \u0642\u0631\u064a\u0628\u0627 \u0644\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0645\u0648\u0639\u062f.",
      required: "\u0645\u0637\u0644\u0648\u0628",
      invalidEmail: "\u0628\u0631\u064a\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d",
      invalidPhone: "\u0627\u0644\u0635\u064a\u063a\u0629: 06XXXXXXXX \u0623\u0648 07XXXXXXXX",
      minChars: "\u0627\u0644\u062d\u062f \u0627\u0644\u0623\u062f\u0646\u0649 {n} \u0623\u062d\u0631\u0641",
      futureDateRequired: "\u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0641\u064a \u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644",
      morning: "\u0627\u0644\u0635\u0628\u0627\u062d",
      afternoon: "\u0628\u0639\u062f \u0627\u0644\u0638\u0647\u0631",
      closed: "\u0645\u063a\u0644\u0642",
      unavailable: "\u063a\u064a\u0631 \u0645\u062a\u0627\u062d",
    },
    // Treatment Process
    treatmentProcess: {
      title: "\u0639\u0645\u0644\u064a\u062a\u0646\u0627",
      subtitle: "\u0639\u0644\u0627\u062c \u0641\u064a 3 \u062e\u0637\u0648\u0627\u062a \u0628\u0633\u064a\u0637\u0629",
      step1: {
        title: "\u062a\u0634\u062e\u064a\u0635 \u062f\u0642\u064a\u0642",
        description: "\u0646\u0645\u0631\u0631 \u0622\u0644\u062a\u0646\u0627 \u0627\u0644\u0645\u0633\u062c\u0644\u0629 \u0639\u0644\u0649 \u0643\u0627\u0645\u0644 \u0627\u0644\u0634\u0639\u0631 \u0644\u0644\u0642\u0636\u0627\u0621 \u0639\u0644\u0649 \u0627\u0644\u0642\u0645\u0644. \u0647\u0630\u0647 \u0627\u0644\u062e\u0637\u0648\u0629 \u063a\u064a\u0631 \u0645\u0624\u0644\u0645\u0629 \u0648\u0644\u0627 \u062a\u0636\u0631 \u0627\u0644\u0634\u0639\u0631.",
      },
      step2: {
        title: "\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0644\u0648\u0634\u0646",
        description: "\u0646\u0637\u0628\u0642 \u0644\u0648\u0634\u0646\u0646\u0627 \u0627\u0644\u0639\u0644\u0627\u062c\u064a 100% \u0637\u0628\u064a\u0639\u064a \u0648\u0641\u0639\u0627\u0644 \u0628\u062f\u0648\u0646 \u0645\u0628\u064a\u062f\u0627\u062a \u062d\u0634\u0631\u064a\u0629. \u0645\u0646\u0627\u0633\u0628 \u0644\u0644\u0631\u0636\u0639 \u0648\u0627\u0644\u062d\u0648\u0627\u0645\u0644. \u0641\u064a \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0639\u0644\u0627\u062c \u064a\u0643\u0648\u0646 \u0627\u0644\u0634\u0639\u0631 \u0646\u0638\u064a\u0641\u0627 \u0648\u062c\u0627\u0641\u0627.",
      },
      step3: {
        title: "\u0627\u0644\u062a\u062d\u0642\u0642 \u0628\u0627\u0644\u0645\u0634\u0637 \u0627\u0644\u062f\u0642\u064a\u0642",
        description: "\u0646\u062a\u062d\u0642\u0642 \u062e\u0635\u0644\u0629 \u0628\u062e\u0635\u0644\u0629 \u0644\u0636\u0645\u0627\u0646 100% \u0641\u0639\u0627\u0644\u064a\u0629. \u064a\u0645\u0643\u0646\u0643\u0645 \u0631\u0624\u064a\u0629 \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0641\u064a \u0646\u0647\u0627\u064a\u0629 \u0627\u0644\u0639\u0644\u0627\u062c :)",
      },
    },
    // Mission
    mission: {
      title: "\u0645\u0647\u0645\u062a\u0646\u0627",
      subtitle: "\u062d\u0645\u0627\u064a\u0629 \u0627\u0644\u0623\u0637\u0641\u0627\u0644 \u0628\u0637\u0631\u064a\u0642\u0629 \u0644\u0637\u064a\u0641\u0629 \u0648\u0637\u0628\u064a\u0639\u064a\u0629",
      description: "\u0637\u0631\u064a\u0642\u062a\u0646\u0627 \u062a\u062a\u062e\u0644\u0635 \u0645\u0646 \u0627\u0644\u0642\u0645\u0644 \u0648\u0627\u0644\u0635\u0626\u0628\u0627\u0646 \u0641\u064a \u062c\u0644\u0633\u0629 \u0648\u0627\u062d\u062f\u0629. \u064a\u062a\u0631\u0627\u0648\u062d \u0648\u0642\u062a \u0627\u0644\u0639\u0644\u0627\u062c \u0628\u064a\u0646 30 \u062f\u0642\u064a\u0642\u0629 \u0648\u0633\u0627\u0639\u0629 \u062d\u0633\u0628 \u0637\u0648\u0644 \u0627\u0644\u0634\u0639\u0631 \u0648\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0625\u0635\u0627\u0628\u0629. \u0645\u062c\u0647\u0632\u0648\u0646 \u0628\u0645\u0639\u062f\u0627\u062a \u0645\u0647\u0646\u064a\u0629 \u062d\u062f\u064a\u062b\u0629\u060c \u0646\u0645\u062a\u0644\u0643 \u0634\u0641\u0627\u0637 \u0627\u0644\u0642\u0645\u0644 \u0648\u0641\u0639\u0627\u0644\u064a\u0629 \u0644\u0648\u0634\u0646\u0646\u0627 \u0627\u0644\u0637\u0628\u064a\u0639\u064a \u0645\u0636\u0645\u0648\u0646\u0629. \u0641\u0631\u064a\u0642\u0646\u0627 \u0627\u0644\u0645\u062d\u062a\u0631\u0641 \u0641\u064a \u062e\u062f\u0645\u062a\u0643\u0645.",
      cta: "\u0627\u0643\u062a\u0634\u0641 \u062e\u062f\u0645\u0627\u062a\u0646\u0627",
    },
    footer: {
      description: "\u0645\u062a\u062e\u0635\u0635 \u0641\u064a \u0639\u0644\u0627\u062c \u0627\u0644\u0642\u0645\u0644 \u0627\u0644\u0645\u0647\u0646\u064a \u0628\u0627\u0644\u062f\u0627\u0631 \u0627\u0644\u0628\u064a\u0636\u0627\u0621.",
      quickLinks: "\u0627\u0644\u0631\u0648\u0627\u0628\u0637",
      contactInfo: "\u0627\u062a\u0635\u0644 \u0628\u0646\u0627",
      rights: "\u00a9 2026 MISSPO. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629.",
    },
    lang: {
      fr: "Fran\u00e7ais",
      ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    },
  },
} as const

export type TranslationKey = typeof translations.fr
