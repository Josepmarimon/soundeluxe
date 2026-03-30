export type Lang = 'ca' | 'es' | 'en'

const translations: Record<string, Record<Lang, string>> = {
  // Expired
  expiredTitle: {
    ca: 'Enllaç Caducat',
    es: 'Enlace Caducado',
    en: 'Link Expired',
  },
  expiredText: {
    ca: 'Aquesta proposta comercial ha caducat. Contacta amb nosaltres a',
    es: 'Esta propuesta comercial ha caducado. Contacta con nosotros en',
    en: 'This commercial proposal has expired. Contact us at',
  },
  expiredRequestNew: {
    ca: 'per sol·licitar-ne una de nova.',
    es: 'para solicitar una nueva.',
    en: 'to request a new one.',
  },

  // Header
  commercialProposal: {
    ca: 'Proposta Comercial',
    es: 'Propuesta Comercial',
    en: 'Commercial Proposal',
  },

  // Hero
  heroHello: { ca: 'Benvolgut/da,', es: 'Estimado/a,', en: 'Dear,' },
  heroFrom: { ca: 'de', es: 'de', en: 'from' },
  heroIntro: {
    ca: 'Us presentem Sound Deluxe, una experiència única d\'escolta d\'alta fidelitat a Barcelona.',
    es: 'Le presentamos Sound Deluxe, una experiencia única de escucha en alta fidelidad en Barcelona.',
    en: 'We present Sound Deluxe, a unique high-fidelity listening experience in Barcelona.',
  },

  // What We Do
  whatWeDoTitle: {
    ca: 'Què és Sound Deluxe?',
    es: '¿Qué es Sound Deluxe?',
    en: 'What is Sound Deluxe?',
  },
  whatWeDoDescription: {
    ca: 'Organitzem sessions exclusives d\'escolta en alta fidelitat. Melòmans i audiòfils es reuneixen en espais íntims per gaudir de música en vinil i bobina oberta, reproduïda amb equips d\'alta gamma.',
    es: 'Organizamos sesiones exclusivas de escucha en alta fidelidad. Melómanos y audiófilos se reúnen en espacios íntimos para disfrutar de música en vinilo y bobina abierta, reproducida con equipos de alta gama.',
    en: 'We organize exclusive high-fidelity listening sessions. Music lovers and audiophiles gather in intimate spaces to enjoy vinyl and reel-to-reel music on high-end equipment.',
  },

  // Format
  formatTitle: {
    ca: 'El Nostre Format',
    es: 'Nuestro Formato',
    en: 'Our Format',
  },
  formatVinyl: { ca: 'Vinil', es: 'Vinilo', en: 'Vinyl' },
  formatVinylDesc: {
    ca: 'Edicions originals i audiòfiles en disc de vinil',
    es: 'Ediciones originales y audiófilas en disco de vinilo',
    en: 'Original and audiophile editions on vinyl record',
  },
  formatReel: { ca: 'Bobina Oberta', es: 'Bobina Abierta', en: 'Reel-to-Reel' },
  formatReelDesc: {
    ca: 'Cintes master i còpies d\'alta qualitat en format analògic',
    es: 'Cintas master y copias de alta calidad en formato analógico',
    en: 'Master tapes and high-quality copies in analog format',
  },
  formatEquipment: { ca: 'Equips High-End', es: 'Equipos High-End', en: 'High-End Equipment' },
  formatEquipmentDesc: {
    ca: 'Cadena de reproducció d\'alta gamma seleccionada amb cura',
    es: 'Cadena de reproducción de alta gama seleccionada con cuidado',
    en: 'Carefully selected high-end playback chain',
  },

  // Audience
  audienceTitle: {
    ca: 'La Nostra Audiència',
    es: 'Nuestra Audiencia',
    en: 'Our Audience',
  },
  audienceUsers: { ca: 'Usuaris registrats', es: 'Usuarios registrados', en: 'Registered users' },
  audienceSessions: { ca: 'Sessions realitzades', es: 'Sesiones realizadas', en: 'Sessions held' },
  audienceReservas: { ca: 'Reserves confirmades', es: 'Reservas confirmadas', en: 'Confirmed bookings' },
  audienceAlbums: { ca: 'Àlbums al catàleg', es: 'Álbumes en catálogo', en: 'Albums in catalog' },
  audienceRessenyes: { ca: 'Ressenyes', es: 'Reseñas', en: 'Reviews' },
  audienceRating: { ca: 'Valoració mitjana', es: 'Valoración media', en: 'Average rating' },

  // Collaboration
  collabTitle: {
    ca: 'Oportunitats de Col·laboració',
    es: 'Oportunidades de Colaboración',
    en: 'Collaboration Opportunities',
  },
  collabSponsoring: { ca: 'Patrocini de sessions', es: 'Patrocinio de sesiones', en: 'Session sponsoring' },
  collabSponsoringDesc: {
    ca: 'Associa la teva marca a una experiència premium davant d\'un públic seleccionat',
    es: 'Asocia tu marca a una experiencia premium ante un público seleccionado',
    en: 'Associate your brand with a premium experience in front of a selected audience',
  },
  collabEquipment: { ca: 'Equipament en sessions', es: 'Equipamiento en sesiones', en: 'Equipment in sessions' },
  collabEquipmentDesc: {
    ca: 'Presenta els teus productes en el context ideal: una escolta real amb audiòfils',
    es: 'Presenta tus productos en el contexto ideal: una escucha real con audiófilos',
    en: 'Showcase your products in the ideal context: real listening with audiophiles',
  },
  collabContent: { ca: 'Contingut conjunt', es: 'Contenido conjunto', en: 'Joint content' },
  collabContentDesc: {
    ca: 'Creació de contingut audiovisual sobre les sessions i els equips utilitzats',
    es: 'Creación de contenido audiovisual sobre las sesiones y equipos utilizados',
    en: 'Creation of audiovisual content about sessions and equipment used',
  },
  collabEvents: { ca: 'Esdeveniments especials', es: 'Eventos especiales', en: 'Special events' },
  collabEventsDesc: {
    ca: 'Sessions temàtiques o exclusives amb la teva marca com a protagonista',
    es: 'Sesiones temáticas o exclusivas con tu marca como protagonista',
    en: 'Themed or exclusive sessions featuring your brand',
  },

  // CTA
  ctaTitle: {
    ca: 'Parlem?',
    es: '¿Hablamos?',
    en: 'Shall we talk?',
  },
  ctaDescription: {
    ca: 'Estem oberts a explorar col·laboracions que beneficiïn ambdues parts. Contacta\'ns per concretar els detalls.',
    es: 'Estamos abiertos a explorar colaboraciones que beneficien a ambas partes. Contáctanos para concretar los detalles.',
    en: 'We are open to exploring collaborations that benefit both parties. Contact us to discuss the details.',
  },
  ctaButton: {
    ca: 'Contactar',
    es: 'Contactar',
    en: 'Contact Us',
  },
  ctaEmail: {
    ca: 'O escriu-nos a',
    es: 'O escríbenos a',
    en: 'Or write to us at',
  },

  // Footer
  footerConfidential: {
    ca: 'Aquesta proposta és confidencial i personalitzada.',
    es: 'Esta propuesta es confidencial y personalizada.',
    en: 'This proposal is confidential and personalized.',
  },
}

export function t(key: string, lang: Lang): string {
  return translations[key]?.[lang] || translations[key]?.ca || key
}
