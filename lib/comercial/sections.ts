// Registry of all available sections with default trilingual content
// Content is organized by section key and recipient type where applicable

import type { SectionDefinition, CommercialRecipientType, Lang, SectionContent } from './types'

// ============================================
// COMMON SECTIONS (shared across all types)
// ============================================

const heroSection: SectionDefinition = {
  key: 'hero',
  name: { ca: 'Salutació', es: 'Saludo', en: 'Greeting' },
  category: 'common',
  component: 'SectionHero',
  supportsRecipientInterpolation: true,
  defaultImage: '/images/comercial/lounge-barcelona.jpg',
  defaultContent: {
    ca: {
      title: 'SOUND DELUXE',
      body: '<p>Us presentem Sound Deluxe, una experiència única d\'escolta d\'alta fidelitat a Barcelona.</p>',
    },
    es: {
      title: 'SOUND DELUXE',
      body: '<p>Le presentamos Sound Deluxe, una experiencia única de escucha en alta fidelidad en Barcelona.</p>',
    },
    en: {
      title: 'SOUND DELUXE',
      body: '<p>We present Sound Deluxe, a unique high-fidelity listening experience in Barcelona.</p>',
    },
  },
}

const aboutSection: SectionDefinition = {
  key: 'about',
  name: { ca: 'Què és Sound Deluxe', es: 'Qué es Sound Deluxe', en: 'What is Sound Deluxe' },
  category: 'common',
  component: 'SectionText',
  defaultImage: '/images/comercial/vinyl-collection.jpg',
  defaultContent: {
    ca: {
      title: 'Què és Sound Deluxe?',
      body: `<p>Sound Deluxe és un projecte d'experiències musicals curades: sessions d'escolta de vinil en format exclusiu, en espais acústicament preparats amb equip Hi-Fi vintage d'alta gamma.</p>
<p>No és un esdeveniment. No és un concert. És una experiència immersiva, íntima i emocional. L'enfocament combina curadoria musical, equips vintage d'alta gamma i una posada en escena minimalista que maximitza el silenci i la immersió.</p>
<p>La reivindicació de l'escolta conscient i profunda és essencial en un món saturat de sorolls digitals. Convidem a reconnectar amb la música i a redescobrir el seu poder emocional i cultural.</p>
<p><strong>La nostra visió:</strong> Recuperar la manera d'escoltar música. Convertint cada sessió en un moment únic, gairebé cinematogràfic. Atenció, qualitat i emoció.</p>`,
    },
    es: {
      title: '¿Qué es Sound Deluxe?',
      body: `<p>Sound Deluxe es un proyecto de experiencias musicales curadas: sesiones de escucha de vinilo en formato exclusivo, en espacios acústicamente preparados con equipo Hi-Fi vintage de alta gama.</p>
<p>No es un evento. No es un concierto. Es una experiencia inmersiva, íntima y emocional. El enfoque combina curaduría musical, equipos vintage de alta gama y una puesta en escena minimalista que maximiza el silencio y la inmersión.</p>
<p>La reivindicación de la escucha consciente y profunda es esencial en un mundo saturado de ruidos digitales. Invitamos a reconectar con la música y a redescubrir su poder emocional y cultural.</p>
<p><strong>Nuestra visión:</strong> Recuperar la manera de escuchar música. Convirtiendo cada sesión en un momento único, casi cinematográfico. Atención, calidad y emoción.</p>`,
    },
    en: {
      title: 'What is Sound Deluxe?',
      body: `<p>Sound Deluxe is a curated musical experience project: exclusive vinyl listening sessions in acoustically prepared spaces with high-end vintage Hi-Fi equipment.</p>
<p>It's not an event. It's not a concert. It's an immersive, intimate and emotional experience. The approach combines musical curation, high-end vintage equipment and a minimalist staging that maximizes silence and immersion.</p>
<p>The reclamation of conscious and deep listening is essential in a world saturated with digital noise. We invite you to reconnect with music and rediscover its emotional and cultural power.</p>
<p><strong>Our vision:</strong> Reclaiming the way we listen to music. Turning each session into a unique, almost cinematic moment. Attention, quality and emotion.</p>`,
    },
  },
}

const contextSection: SectionDefinition = {
  key: 'context',
  name: { ca: 'Context i tendències', es: 'Contexto y tendencias', en: 'Context and trends' },
  category: 'common',
  component: 'SectionCards',
  defaultImage: '/images/comercial/session-turntable.jpg',
  defaultContent: {
    ca: {
      title: 'Context global: tendències que ho impulsen',
      body: '<p>Sound Deluxe no és una moda: és part d\'un canvi cultural.</p>',
      items: [
        { title: 'Slow Listening', description: 'Arreu del món creixen els listening bars i les sessions d\'escolta completa. El moviment global que reivindica l\'escolta activa i conscient.', icon: 'Headphones' },
        { title: 'Retorn a l\'analògic', description: 'Les vendes de vinil creixen un +40% a Europa en 5 anys (IFPI 2025). El vinil creix per 18è any consecutiu a nivell global.', icon: 'Disc3' },
        { title: 'Economia de l\'experiència', description: 'El públic premium prefereix experiències exclusives i irrepetibles als esdeveniments multitudinaris. La innovació en "fan experiences" és un vector de creixement.', icon: 'Sparkles' },
        { title: 'Cultura premium', description: 'La qualitat per sobre de la quantitat. Audiòfils i melòmans com a consumidors d\'alt valor en el sector de l\'oci i la cultura.', icon: 'Star' },
      ],
    },
    es: {
      title: 'Contexto global: tendencias que lo impulsan',
      body: '<p>Sound Deluxe no es una moda: es parte de un cambio cultural.</p>',
      items: [
        { title: 'Slow Listening', description: 'En todo el mundo crecen los listening bars y las sesiones de escucha completa. El movimiento global que reivindica la escucha activa y consciente.', icon: 'Headphones' },
        { title: 'Retorno a lo analógico', description: 'Las ventas de vinilo crecen un +40% en Europa en 5 años (IFPI 2025). El vinilo crece por 18º año consecutivo a nivel global.', icon: 'Disc3' },
        { title: 'Economía de la experiencia', description: 'El público premium prefiere experiencias exclusivas e irrepetibles a los eventos multitudinarios. La innovación en "fan experiences" es un vector de crecimiento.', icon: 'Sparkles' },
        { title: 'Cultura premium', description: 'La calidad por encima de la cantidad. Audiófilos y melómanos como consumidores de alto valor en el sector del ocio y la cultura.', icon: 'Star' },
      ],
    },
    en: {
      title: 'Global context: trends driving this',
      body: '<p>Sound Deluxe is not a fad: it\'s part of a cultural shift.</p>',
      items: [
        { title: 'Slow Listening', description: 'Listening bars and full-album sessions are growing worldwide. A global movement reclaiming active and conscious listening.', icon: 'Headphones' },
        { title: 'Return to analog', description: 'Vinyl sales have grown +40% in Europe in 5 years (IFPI 2025). Vinyl has been growing globally for 18 consecutive years.', icon: 'Disc3' },
        { title: 'Experience economy', description: 'Premium audiences prefer exclusive, unrepeatable experiences over mass events. Innovation in "fan experiences" is a growth vector.', icon: 'Sparkles' },
        { title: 'Premium culture', description: 'Quality over quantity. Audiophiles and music lovers as high-value consumers in the leisure and culture sector.', icon: 'Star' },
      ],
    },
  },
}

const teamCommunitySection: SectionDefinition = {
  key: 'team-community',
  name: { ca: 'Equip i comunitat', es: 'Equipo y comunidad', en: 'Team and community' },
  category: 'common',
  component: 'SectionCommunity',
  defaultImage: '/images/comercial/txell-castello.jpg',
  defaultContent: {
    ca: {
      title: 'L\'equip i la comunitat',
      body: `<p><strong>Txell Castelló</strong> — Fundadora i Directora de Sound Deluxe.</p>
<p><strong>Josep Maria Marimon</strong> — Partner Estratègic. Fundador de HiFiCafé. President del Club d'Audiòfils i Melòmans d'Espanya.</p>
<p>Sound Deluxe és partner del Club d'Audiòfils i Melòmans d'Espanya, comunitat de referència articulada a través de HiFiCafe.org, YouTube i Instagram HiFiCafe Barcelona.</p>`,
      items: [
        { title: 'HiFiCafe.org', description: 'Xarxa social i portal de referència per a audiòfils hispanoparlants. Fòrums, crítiques, grups locals i internacionals.', icon: 'Globe' },
        { title: 'YouTube Hi-Fi', description: 'Canal de divulgació sobre alta fidelitat, vinil i equips vintage. 18K subscriptors, 1.8M visualitzacions.', icon: 'Youtube' },
        { title: 'Instagram @hificafe.barcelona', description: 'Referent estètic de la cultura audiòfila. Comunitat visual activa i creixent.', icon: 'Instagram' },
        { title: 'Podcast & Newsletter', description: 'Comentaris de sessions, entrevistes i recomanacions. Amplificador del missatge Sound Deluxe.', icon: 'Mic' },
      ],
    },
    es: {
      title: 'El equipo y la comunidad',
      body: `<p><strong>Txell Castelló</strong> — Fundadora y Directora de Sound Deluxe.</p>
<p><strong>Josep Maria Marimon</strong> — Partner Estratégico. Fundador de HiFiCafé. Presidente del Club de Audiófilos y Melómanos de España.</p>
<p>Sound Deluxe es partner del Club de Audiófilos y Melómanos de España, comunidad de referencia articulada a través de HiFiCafe.org, YouTube e Instagram HiFiCafe Barcelona.</p>`,
      items: [
        { title: 'HiFiCafe.org', description: 'Red social y portal de referencia para audiófilos hispanohablantes. Foros, críticas, grupos locales e internacionales.', icon: 'Globe' },
        { title: 'YouTube Hi-Fi', description: 'Canal de divulgación sobre alta fidelidad, vinilo y equipos vintage. 18K suscriptores, 1.8M visualizaciones.', icon: 'Youtube' },
        { title: 'Instagram @hificafe.barcelona', description: 'Referente estético de la cultura audiófila. Comunidad visual activa y creciente.', icon: 'Instagram' },
        { title: 'Podcast & Newsletter', description: 'Comentarios de sesiones, entrevistas y recomendaciones. Amplificador del mensaje Sound Deluxe.', icon: 'Mic' },
      ],
    },
    en: {
      title: 'Team and community',
      body: `<p><strong>Txell Castelló</strong> — Founder and Director of Sound Deluxe.</p>
<p><strong>Josep Maria Marimon</strong> — Strategic Partner. Founder of HiFiCafé. President of the Spanish Audiophiles and Music Lovers Club.</p>
<p>Sound Deluxe is a partner of the Spanish Audiophiles and Music Lovers Club, a reference community articulated through HiFiCafe.org, YouTube and Instagram HiFiCafe Barcelona.</p>`,
      items: [
        { title: 'HiFiCafe.org', description: 'Social network and reference portal for Spanish-speaking audiophiles. Forums, reviews, local and international groups.', icon: 'Globe' },
        { title: 'YouTube Hi-Fi', description: 'High-fidelity, vinyl and vintage equipment channel. 18K subscribers, 1.8M views.', icon: 'Youtube' },
        { title: 'Instagram @hificafe.barcelona', description: 'Aesthetic reference of audiophile culture. Active and growing visual community.', icon: 'Instagram' },
        { title: 'Podcast & Newsletter', description: 'Session reviews, interviews and recommendations. Sound Deluxe message amplifier.', icon: 'Mic' },
      ],
    },
  },
}

const equipmentSection: SectionDefinition = {
  key: 'equipment',
  name: { ca: 'Equipament Hi-Fi', es: 'Equipamiento Hi-Fi', en: 'Hi-Fi Equipment' },
  category: 'common',
  component: 'SectionText',
  defaultImage: '/images/comercial/mcintosh-275.jpg',
  defaultContent: {
    ca: {
      title: 'Equipament: alta fidelitat extrema',
      body: `<p>Sessions d'escolta crítica de música en alta fidelitat extrema. Cintes màster originals i vinils de primera edició.</p>
<p><em>Music First, Gear Second</em> — Equips Hi-Fi vintage d'alta gamma propis. La cultura del vinil proporciona una experiència sonora autèntica, fascinant i rica en matisos.</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px">
<img src="/images/comercial/marantz-vintage.jpg" alt="Marantz vintage" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/revox-reel.jpg" alt="Revox bobina oberta" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/turntable-sra.jpg" alt="Giradiscos SRA" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
</div>`,
    },
    es: {
      title: 'Equipamiento: alta fidelidad extrema',
      body: `<p>Sesiones de escucha crítica de música en alta fidelidad extrema. Cintas máster originales y vinilos de primera edición.</p>
<p><em>Music First, Gear Second</em> — Equipos Hi-Fi vintage de alta gama propios. La cultura del vinilo proporciona una experiencia sonora auténtica, fascinante y rica en matices.</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px">
<img src="/images/comercial/marantz-vintage.jpg" alt="Marantz vintage" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/revox-reel.jpg" alt="Revox bobina abierta" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/turntable-sra.jpg" alt="Giradiscos SRA" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
</div>`,
    },
    en: {
      title: 'Equipment: extreme high fidelity',
      body: `<p>Critical listening sessions in extreme high fidelity. Original master tapes and first-edition vinyl records.</p>
<p><em>Music First, Gear Second</em> — Our own high-end vintage Hi-Fi equipment. Vinyl culture provides an authentic, fascinating and nuanced sonic experience.</p>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px">
<img src="/images/comercial/marantz-vintage.jpg" alt="Marantz vintage" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/revox-reel.jpg" alt="Revox reel-to-reel" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
<img src="/images/comercial/turntable-sra.jpg" alt="SRA turntable" style="border-radius:12px;width:100%;height:160px;object-fit:cover" />
</div>`,
    },
  },
}

const platformMetricsSection: SectionDefinition = {
  key: 'platform-metrics',
  name: { ca: 'Mètriques en viu', es: 'Métricas en vivo', en: 'Live metrics' },
  category: 'common',
  component: 'SectionMetrics',
  supportsMetrics: true,
  defaultContent: {
    ca: { title: 'La nostra plataforma', body: '<p>Dades en temps real de soundeluxe.es</p>' },
    es: { title: 'Nuestra plataforma', body: '<p>Datos en tiempo real de soundeluxe.es</p>' },
    en: { title: 'Our platform', body: '<p>Real-time data from soundeluxe.es</p>' },
  },
}

// ============================================
// TYPE-SPECIFIC SECTIONS (different defaults per recipient type)
// ============================================

// Audience section — different value proposition per type
const audienceDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: {
      title: 'El nostre públic: premium, global i fidel',
      body: '<p>L\'audiòfil modern és un consumidor de luxe que cerca experiències úniques, no simplement productes.</p>',
      items: [
        { title: 'Perfil professional', description: 'Perfil professional liberal i executiu. Renda alta, consumidor de luxe experiencial.', icon: 'UserCheck' },
        { title: 'Mentalitat internacional', description: 'Viatger freqüent, present a xarxes d\'audiòfils mundials. Afinitat amb clubs socials premium.', icon: 'Globe' },
        { title: 'Alta fidelitat', description: 'Melòman actiu, col·leccionista de vinil, inversor en equips Hi-Fi d\'alta gamma.', icon: 'Headphones' },
        { title: 'Prescriptor actiu', description: 'Fidelitat elevada als espais i marques. Prescripció activa dins la seva comunitat.', icon: 'Users' },
      ],
    },
    es: {
      title: 'Nuestro público: premium, global y fiel',
      body: '<p>El audiófilo moderno es un consumidor de lujo que busca experiencias únicas, no simplemente productos.</p>',
      items: [
        { title: 'Perfil profesional', description: 'Perfil profesional liberal y ejecutivo. Renta alta, consumidor de lujo experiencial.', icon: 'UserCheck' },
        { title: 'Mentalidad internacional', description: 'Viajero frecuente, presente en redes de audiófilos mundiales. Afinidad con clubs sociales premium.', icon: 'Globe' },
        { title: 'Alta fidelidad', description: 'Melómano activo, coleccionista de vinilo, inversor en equipos Hi-Fi de alta gama.', icon: 'Headphones' },
        { title: 'Prescriptor activo', description: 'Fidelidad elevada a los espacios y marcas. Prescripción activa dentro de su comunidad.', icon: 'Users' },
      ],
    },
    en: {
      title: 'Our audience: premium, global and loyal',
      body: '<p>The modern audiophile is a luxury consumer seeking unique experiences, not just products.</p>',
      items: [
        { title: 'Professional profile', description: 'Liberal professional and executive profile. High income, experiential luxury consumer.', icon: 'UserCheck' },
        { title: 'International mindset', description: 'Frequent traveler, present in global audiophile networks. Affinity with premium social clubs.', icon: 'Globe' },
        { title: 'High fidelity', description: 'Active music lover, vinyl collector, investor in high-end Hi-Fi equipment.', icon: 'Headphones' },
        { title: 'Active prescriber', description: 'High loyalty to spaces and brands. Active prescription within their community.', icon: 'Users' },
      ],
    },
  },
  DISC_PROVIDER: {
    ca: {
      title: 'La nostra audiència: col·leccionistes exigents',
      body: '<p>El nostre públic consumeix vinil de qualitat de forma habitual i busca edicions especials, primeres edicions i remasteritzacions audiòfiles.</p>',
      items: [
        { title: 'Col·leccionistes actius', description: 'Compren vinil regularment. Busquen edicions originals, audiòfiles i de tiratge limitat.', icon: 'Disc3' },
        { title: 'Alt poder adquisitiu', description: 'Disposats a invertir en qualitat sonora. Compra mitjana elevada per transacció.', icon: 'Star' },
        { title: 'Comunitat connectada', description: '30K+ abast directe a través de HiFiCafe.org, YouTube i Instagram.', icon: 'Users' },
        { title: 'Prescriptors de confiança', description: 'Les recomanacions de la comunitat audiòfila generen vendes directes.', icon: 'MessageCircle' },
      ],
    },
    es: {
      title: 'Nuestra audiencia: coleccionistas exigentes',
      body: '<p>Nuestro público consume vinilo de calidad de forma habitual y busca ediciones especiales, primeras ediciones y remasterizaciones audiófilas.</p>',
      items: [
        { title: 'Coleccionistas activos', description: 'Compran vinilo regularmente. Buscan ediciones originales, audiófilas y de tirada limitada.', icon: 'Disc3' },
        { title: 'Alto poder adquisitivo', description: 'Dispuestos a invertir en calidad sonora. Compra media elevada por transacción.', icon: 'Star' },
        { title: 'Comunidad conectada', description: '30K+ alcance directo a través de HiFiCafe.org, YouTube e Instagram.', icon: 'Users' },
        { title: 'Prescriptores de confianza', description: 'Las recomendaciones de la comunidad audiófila generan ventas directas.', icon: 'MessageCircle' },
      ],
    },
    en: {
      title: 'Our audience: demanding collectors',
      body: '<p>Our audience regularly consumes quality vinyl and seeks special editions, first pressings and audiophile remasters.</p>',
      items: [
        { title: 'Active collectors', description: 'Buy vinyl regularly. Seek original, audiophile and limited-run editions.', icon: 'Disc3' },
        { title: 'High purchasing power', description: 'Willing to invest in sound quality. High average purchase per transaction.', icon: 'Star' },
        { title: 'Connected community', description: '30K+ direct reach through HiFiCafe.org, YouTube and Instagram.', icon: 'Users' },
        { title: 'Trusted prescribers', description: 'Audiophile community recommendations generate direct sales.', icon: 'MessageCircle' },
      ],
    },
  },
  FAN_CLUB: {
    ca: {
      title: 'La nostra audiència: melòmans apassionats',
      body: '<p>Compartim la mateixa passió per la música. La nostra comunitat reuneix amants de la música que busquen experiències d\'escolta profundes i significatives.</p>',
      items: [
        { title: 'Melòmans actius', description: 'Assisteixen a concerts regularment, col·leccionen vinil i comparteixen la seva passió.', icon: 'Music2' },
        { title: 'Comunitat diversa', description: 'Des de joves descobridors fins a col·leccionistes veterans. Tots units per la música.', icon: 'Users' },
        { title: 'Participació elevada', description: 'El nostre públic s\'implica: vota, comenta, recomana i torna.', icon: 'Heart' },
        { title: 'Abast amplificat', description: '30K+ abast directe. Cada membre és un altaveu dins la seva pròpia xarxa.', icon: 'Megaphone' },
      ],
    },
    es: {
      title: 'Nuestra audiencia: melómanos apasionados',
      body: '<p>Compartimos la misma pasión por la música. Nuestra comunidad reúne amantes de la música que buscan experiencias de escucha profundas y significativas.</p>',
      items: [
        { title: 'Melómanos activos', description: 'Asisten a conciertos regularmente, coleccionan vinilo y comparten su pasión.', icon: 'Music2' },
        { title: 'Comunidad diversa', description: 'Desde jóvenes descubridores hasta coleccionistas veteranos. Todos unidos por la música.', icon: 'Users' },
        { title: 'Participación elevada', description: 'Nuestro público se implica: vota, comenta, recomienda y vuelve.', icon: 'Heart' },
        { title: 'Alcance amplificado', description: '30K+ alcance directo. Cada miembro es un altavoz dentro de su propia red.', icon: 'Megaphone' },
      ],
    },
    en: {
      title: 'Our audience: passionate music lovers',
      body: '<p>We share the same passion for music. Our community brings together music lovers seeking deep and meaningful listening experiences.</p>',
      items: [
        { title: 'Active music lovers', description: 'Regularly attend concerts, collect vinyl and share their passion.', icon: 'Music2' },
        { title: 'Diverse community', description: 'From young discoverers to veteran collectors. All united by music.', icon: 'Users' },
        { title: 'High engagement', description: 'Our audience gets involved: votes, comments, recommends and returns.', icon: 'Heart' },
        { title: 'Amplified reach', description: '30K+ direct reach. Each member is a speaker within their own network.', icon: 'Megaphone' },
      ],
    },
  },
  COMPANY: {
    ca: {
      title: 'El nostre públic: professionals i executius',
      body: '<p>Les experiències Sound Deluxe atreuen un perfil professional d\'alt valor, ideal per a accions corporatives exclusives.</p>',
      items: [
        { title: 'Perfil executiu', description: 'Directius, creatius i professionals liberals. Renda alta i mentalitat internacional.', icon: 'Briefcase' },
        { title: 'Networking natural', description: 'Les sessions generen connexions autèntiques en un ambient íntim i relaxat.', icon: 'Users' },
        { title: 'Experiència diferencial', description: 'Una proposta original que destaca sobre els clàssics team buildings.', icon: 'Sparkles' },
        { title: 'Impacte emocional', description: 'La música en alta fidelitat crea vincles emocionals duradors entre els participants.', icon: 'Heart' },
      ],
    },
    es: {
      title: 'Nuestro público: profesionales y ejecutivos',
      body: '<p>Las experiencias Sound Deluxe atraen un perfil profesional de alto valor, ideal para acciones corporativas exclusivas.</p>',
      items: [
        { title: 'Perfil ejecutivo', description: 'Directivos, creativos y profesionales liberales. Renta alta y mentalidad internacional.', icon: 'Briefcase' },
        { title: 'Networking natural', description: 'Las sesiones generan conexiones auténticas en un ambiente íntimo y relajado.', icon: 'Users' },
        { title: 'Experiencia diferencial', description: 'Una propuesta original que destaca sobre los clásicos team buildings.', icon: 'Sparkles' },
        { title: 'Impacto emocional', description: 'La música en alta fidelidad crea vínculos emocionales duraderos entre los participantes.', icon: 'Heart' },
      ],
    },
    en: {
      title: 'Our audience: professionals and executives',
      body: '<p>Sound Deluxe experiences attract a high-value professional profile, ideal for exclusive corporate actions.</p>',
      items: [
        { title: 'Executive profile', description: 'Directors, creatives and liberal professionals. High income and international mindset.', icon: 'Briefcase' },
        { title: 'Natural networking', description: 'Sessions generate authentic connections in an intimate, relaxed atmosphere.', icon: 'Users' },
        { title: 'Differential experience', description: 'An original proposal that stands out from classic team buildings.', icon: 'Sparkles' },
        { title: 'Emotional impact', description: 'High-fidelity music creates lasting emotional bonds among participants.', icon: 'Heart' },
      ],
    },
  },
  RECORD_LABEL: {
    ca: {
      title: 'La nostra audiència: audiòfils i prescriptors',
      body: '<p>El públic Sound Deluxe és exactament el target que busca qualsevol segell discogràfic: audiòfils compromesos amb la música de qualitat.</p>',
      items: [
        { title: 'Compradors de vinil', description: 'Col·leccionistes actius que compren edicions especials, audiòfiles i de tiratge limitat.', icon: 'Disc3' },
        { title: 'Prescriptors influents', description: 'Les seves recomanacions arriben a xarxes d\'audiòfils globals via HiFiCafe.org.', icon: 'MessageCircle' },
        { title: 'Escolta crítica', description: 'Un públic que valora la qualitat de gravació, masterització i producció.', icon: 'Headphones' },
        { title: 'Fidelitat al segell', description: 'Quan descobreixen un segell de qualitat, el segueixen i compren regularment.', icon: 'Heart' },
      ],
    },
    es: {
      title: 'Nuestra audiencia: audiófilos y prescriptores',
      body: '<p>El público Sound Deluxe es exactamente el target que busca cualquier sello discográfico: audiófilos comprometidos con la música de calidad.</p>',
      items: [
        { title: 'Compradores de vinilo', description: 'Coleccionistas activos que compran ediciones especiales, audiófilas y de tirada limitada.', icon: 'Disc3' },
        { title: 'Prescriptores influyentes', description: 'Sus recomendaciones llegan a redes de audiófilos globales vía HiFiCafe.org.', icon: 'MessageCircle' },
        { title: 'Escucha crítica', description: 'Un público que valora la calidad de grabación, masterización y producción.', icon: 'Headphones' },
        { title: 'Fidelidad al sello', description: 'Cuando descubren un sello de calidad, lo siguen y compran regularmente.', icon: 'Heart' },
      ],
    },
    en: {
      title: 'Our audience: audiophiles and prescribers',
      body: '<p>The Sound Deluxe audience is exactly the target any record label seeks: audiophiles committed to quality music.</p>',
      items: [
        { title: 'Vinyl buyers', description: 'Active collectors who buy special, audiophile and limited-run editions.', icon: 'Disc3' },
        { title: 'Influential prescribers', description: 'Their recommendations reach global audiophile networks via HiFiCafe.org.', icon: 'MessageCircle' },
        { title: 'Critical listening', description: 'An audience that values recording, mastering and production quality.', icon: 'Headphones' },
        { title: 'Label loyalty', description: 'When they discover a quality label, they follow and buy regularly.', icon: 'Heart' },
      ],
    },
  },
}

// Why You section — completely custom per type
const whyYouDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: {
      title: 'Per què el vostre espai?',
      body: `<p>Busquem espais amb un <strong>excel·lent tractament acústic</strong>, un ambient íntim i premium, i un públic internacional i selecte.</p>
<p>L'experiència Sound Deluxe requereix silenci, foscor i confort — condicions que un espai pensat per a l'atenció i el gaudi pot oferir a la perfecció.</p>
<p>La connexió amb la cultura i la creativitat, una capacitat ideal de 25-30 convidats, i una ubicació icònica completen el match perfecte.</p>`,
    },
    es: {
      title: '¿Por qué vuestro espacio?',
      body: `<p>Buscamos espacios con un <strong>excelente tratamiento acústico</strong>, un ambiente íntimo y premium, y un público internacional y selecto.</p>
<p>La experiencia Sound Deluxe requiere silencio, oscuridad y confort — condiciones que un espacio pensado para la atención y el disfrute puede ofrecer a la perfección.</p>
<p>La conexión con la cultura y la creatividad, una capacidad ideal de 25-30 invitados, y una ubicación icónica completan el match perfecto.</p>`,
    },
    en: {
      title: 'Why your venue?',
      body: `<p>We seek spaces with <strong>excellent acoustic treatment</strong>, an intimate and premium atmosphere, and an international, select audience.</p>
<p>The Sound Deluxe experience requires silence, darkness and comfort — conditions that a space designed for attention and enjoyment can offer perfectly.</p>
<p>Connection with culture and creativity, an ideal capacity of 25-30 guests, and an iconic location complete the perfect match.</p>`,
    },
  },
  DISC_PROVIDER: {
    ca: {
      title: 'Per què col·laborar amb nosaltres?',
      body: `<p>A Sound Deluxe, el <strong>vinil és el protagonista</strong>. Cada sessió gira al voltant d'un disc o selecció curada, presentada davant d'un públic expert i exigent.</p>
<p>Els assistents escolten cada disc en condicions òptimes: equips Hi-Fi d'alta gamma, acústica tractada i atenció plena. El context ideal per apreciar la qualitat d'una edició.</p>
<p>Les sessions es difonen a HiFiCafe.org i YouTube, arribant a milers d'audiòfils que busquen exactament el que oferiu: vinil de qualitat.</p>`,
    },
    es: {
      title: '¿Por qué colaborar con nosotros?',
      body: `<p>En Sound Deluxe, el <strong>vinilo es el protagonista</strong>. Cada sesión gira alrededor de un disco o selección curada, presentada ante un público experto y exigente.</p>
<p>Los asistentes escuchan cada disco en condiciones óptimas: equipos Hi-Fi de alta gama, acústica tratada y atención plena. El contexto ideal para apreciar la calidad de una edición.</p>
<p>Las sesiones se difunden en HiFiCafe.org y YouTube, llegando a miles de audiófilos que buscan exactamente lo que ofrecéis: vinilo de calidad.</p>`,
    },
    en: {
      title: 'Why collaborate with us?',
      body: `<p>At Sound Deluxe, <strong>vinyl is the protagonist</strong>. Each session revolves around a record or curated selection, presented to an expert and demanding audience.</p>
<p>Attendees listen to each record in optimal conditions: high-end Hi-Fi equipment, treated acoustics and full attention. The ideal context to appreciate the quality of an edition.</p>
<p>Sessions are broadcast on HiFiCafe.org and YouTube, reaching thousands of audiophiles looking for exactly what you offer: quality vinyl.</p>`,
    },
  },
  FAN_CLUB: {
    ca: {
      title: 'Per què organitzar activitats junts?',
      body: `<p>El vostre club i Sound Deluxe compartiu la mateixa essència: <strong>la passió per la música</strong> i el desig de viure-la en comunitat.</p>
<p>Podem co-crear sessions temàtiques al voltant dels artistes que us uneixen, amb equips d'alta fidelitat que faran redescobrir la música als vostres membres.</p>
<p>Cada sessió és una experiència única que enforteix els vincles del club i atrau nous membres apassionats.</p>`,
    },
    es: {
      title: '¿Por qué organizar actividades juntos?',
      body: `<p>Vuestro club y Sound Deluxe compartís la misma esencia: <strong>la pasión por la música</strong> y el deseo de vivirla en comunidad.</p>
<p>Podemos co-crear sesiones temáticas alrededor de los artistas que os unen, con equipos de alta fidelidad que harán redescubrir la música a vuestros miembros.</p>
<p>Cada sesión es una experiencia única que fortalece los vínculos del club y atrae nuevos miembros apasionados.</p>`,
    },
    en: {
      title: 'Why organize activities together?',
      body: `<p>Your club and Sound Deluxe share the same essence: <strong>a passion for music</strong> and the desire to experience it in community.</p>
<p>We can co-create themed sessions around the artists that unite you, with high-fidelity equipment that will help your members rediscover their music.</p>
<p>Each session is a unique experience that strengthens club bonds and attracts new passionate members.</p>`,
    },
  },
  COMPANY: {
    ca: {
      title: 'Per què Sound Deluxe per a la vostra empresa?',
      body: `<p>Les experiències corporatives convencionals s'obliden. Sound Deluxe ofereix quelcom <strong>radicalment diferent</strong>: una experiència sensorial que transforma la manera com el vostre equip es connecta.</p>
<p>En un ambient íntim, amb música en alta fidelitat, els participants es relaxen, escolten i comparteixen. És team building emocional, no forçat.</p>
<p>Ideal per a clients VIP, equips directius, celebracions exclusives o esdeveniments de marca que busquin un toc de distinció.</p>`,
    },
    es: {
      title: '¿Por qué Sound Deluxe para vuestra empresa?',
      body: `<p>Las experiencias corporativas convencionales se olvidan. Sound Deluxe ofrece algo <strong>radicalmente diferente</strong>: una experiencia sensorial que transforma la manera en que vuestro equipo se conecta.</p>
<p>En un ambiente íntimo, con música en alta fidelidad, los participantes se relajan, escuchan y comparten. Es team building emocional, no forzado.</p>
<p>Ideal para clientes VIP, equipos directivos, celebraciones exclusivas o eventos de marca que busquen un toque de distinción.</p>`,
    },
    en: {
      title: 'Why Sound Deluxe for your company?',
      body: `<p>Conventional corporate experiences are forgotten. Sound Deluxe offers something <strong>radically different</strong>: a sensory experience that transforms how your team connects.</p>
<p>In an intimate setting, with high-fidelity music, participants relax, listen and share. It's emotional team building, not forced.</p>
<p>Ideal for VIP clients, executive teams, exclusive celebrations or brand events seeking a touch of distinction.</p>`,
    },
  },
  RECORD_LABEL: {
    ca: {
      title: 'Per què presentar els vostres discos amb nosaltres?',
      body: `<p>Sound Deluxe ofereix el <strong>context de presentació perfecte</strong> per als vostres llançaments: un públic audiòfil expert, equips d'alta gamma i una experiència d'escolta completa.</p>
<p>Cada disc es presenta en condicions acústiques ideals, amb un host que contextualitza l'obra i guia l'escolta. L'audiència no només escolta: <em>experimenta</em> el disc.</p>
<p>La sessió es grava professionalment i es difon als nostres canals, amplificant l'impacte del llançament a la comunitat audiòfila global.</p>`,
    },
    es: {
      title: '¿Por qué presentar vuestros discos con nosotros?',
      body: `<p>Sound Deluxe ofrece el <strong>contexto de presentación perfecto</strong> para vuestros lanzamientos: un público audiófilo experto, equipos de alta gama y una experiencia de escucha completa.</p>
<p>Cada disco se presenta en condiciones acústicas ideales, con un host que contextualiza la obra y guía la escucha. La audiencia no solo escucha: <em>experimenta</em> el disco.</p>
<p>La sesión se graba profesionalmente y se difunde en nuestros canales, amplificando el impacto del lanzamiento en la comunidad audiófila global.</p>`,
    },
    en: {
      title: 'Why present your records with us?',
      body: `<p>Sound Deluxe offers the <strong>perfect presentation context</strong> for your releases: an expert audiophile audience, high-end equipment and a complete listening experience.</p>
<p>Each record is presented in ideal acoustic conditions, with a host who contextualizes the work and guides the listening. The audience doesn't just listen: they <em>experience</em> the record.</p>
<p>The session is professionally recorded and broadcast on our channels, amplifying the release's impact on the global audiophile community.</p>`,
    },
  },
}

// Format section
const formatDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: {
      title: 'El format de les sessions',
      body: '<p>Aforament: 25-30 convidats, <em>invitation-only</em>. Durada: 90-120 minuts. Discos complets o blocs temàtics.</p>',
      items: [
        { title: 'Selecció i curadoria', description: 'Triem l\'artista vinculat a un concert o festival proper. Seleccionem els millors enregistraments en vinil.', icon: 'Search' },
        { title: 'Sessió privada exclusiva', description: '25 a 30 convidats seleccionats. Espai acústicament preparat. Playback en equips vintage d\'alta gamma.', icon: 'Lock' },
        { title: 'Slow Listening Ritual', description: 'Escolta conscient. Tancar els ulls, sentir el so analògic, experimentar la litúrgia de l\'escolta activa.', icon: 'Headphones' },
        { title: 'Captura i difusió', description: 'Enregistrament professional. Contingut difós a HiFiCafe.org, YouTube i Instagram.', icon: 'Video' },
      ],
    },
    es: {
      title: 'El formato de las sesiones',
      body: '<p>Aforo: 25-30 invitados, <em>invitation-only</em>. Duración: 90-120 minutos. Discos completos o bloques temáticos.</p>',
      items: [
        { title: 'Selección y curaduría', description: 'Elegimos el artista vinculado a un concierto o festival cercano. Seleccionamos los mejores registros en vinilo.', icon: 'Search' },
        { title: 'Sesión privada exclusiva', description: '25 a 30 invitados seleccionados. Espacio acústicamente preparado. Playback en equipos vintage de alta gama.', icon: 'Lock' },
        { title: 'Slow Listening Ritual', description: 'Escucha consciente. Cerrar los ojos, sentir el sonido analógico, experimentar la liturgia de la escucha activa.', icon: 'Headphones' },
        { title: 'Captura y difusión', description: 'Grabación profesional. Contenido difundido en HiFiCafe.org, YouTube e Instagram.', icon: 'Video' },
      ],
    },
    en: {
      title: 'Session format',
      body: '<p>Capacity: 25-30 guests, <em>invitation-only</em>. Duration: 90-120 minutes. Complete albums or themed blocks.</p>',
      items: [
        { title: 'Selection and curation', description: 'We choose the artist linked to an upcoming concert or festival. We select the best vinyl recordings.', icon: 'Search' },
        { title: 'Exclusive private session', description: '25 to 30 selected guests. Acoustically prepared space. Playback on high-end vintage equipment.', icon: 'Lock' },
        { title: 'Slow Listening Ritual', description: 'Conscious listening. Close your eyes, feel the analog sound, experience the liturgy of active listening.', icon: 'Headphones' },
        { title: 'Capture and broadcast', description: 'Professional recording. Content broadcast on HiFiCafe.org, YouTube and Instagram.', icon: 'Video' },
      ],
    },
  },
  DISC_PROVIDER: {
    ca: {
      title: 'Com utilitzem el vinil a les sessions',
      body: '<p>Cada sessió és una celebració del vinil. Els discos que subministreu es presenten, es contextualitzen i s\'escolten en condicions perfectes.</p>',
      items: [
        { title: 'Presentació amb context', description: 'Cada disc s\'introdueix amb la seva història, el seu valor artístic i les seves qualitats sonores.', icon: 'BookOpen' },
        { title: 'Escolta en alta fidelitat', description: 'Equips Hi-Fi d\'alta gamma que extreuen cada detall del vinil.', icon: 'Headphones' },
        { title: 'Audiència experta', description: '25-30 audiòfils que aprecien i valoren la qualitat de les edicions.', icon: 'Users' },
        { title: 'Difusió global', description: 'Recomanacions i crítiques als nostres canals arriben a milers de compradors potencials.', icon: 'Globe' },
      ],
    },
    es: {
      title: 'Cómo utilizamos el vinilo en las sesiones',
      body: '<p>Cada sesión es una celebración del vinilo. Los discos que suministráis se presentan, se contextualizan y se escuchan en condiciones perfectas.</p>',
      items: [
        { title: 'Presentación con contexto', description: 'Cada disco se introduce con su historia, su valor artístico y sus cualidades sonoras.', icon: 'BookOpen' },
        { title: 'Escucha en alta fidelidad', description: 'Equipos Hi-Fi de alta gama que extraen cada detalle del vinilo.', icon: 'Headphones' },
        { title: 'Audiencia experta', description: '25-30 audiófilos que aprecian y valoran la calidad de las ediciones.', icon: 'Users' },
        { title: 'Difusión global', description: 'Recomendaciones y críticas en nuestros canales llegan a miles de compradores potenciales.', icon: 'Globe' },
      ],
    },
    en: {
      title: 'How we use vinyl in sessions',
      body: '<p>Each session is a celebration of vinyl. The records you supply are presented, contextualized and listened to in perfect conditions.</p>',
      items: [
        { title: 'Contextualized presentation', description: 'Each record is introduced with its history, artistic value and sonic qualities.', icon: 'BookOpen' },
        { title: 'High-fidelity listening', description: 'High-end Hi-Fi equipment that extracts every detail from the vinyl.', icon: 'Headphones' },
        { title: 'Expert audience', description: '25-30 audiophiles who appreciate and value edition quality.', icon: 'Users' },
        { title: 'Global broadcast', description: 'Recommendations and reviews on our channels reach thousands of potential buyers.', icon: 'Globe' },
      ],
    },
  },
  FAN_CLUB: {
    ca: {
      title: 'Com funcionen les sessions',
      body: '<p>Sessions temàtiques al voltant dels artistes i gèneres que us uneixen. Una experiència d\'escolta inoblidable per als vostres membres.</p>',
      items: [
        { title: 'Co-curadoria', description: 'Trieu els discos i artistes junts. Nosaltres aportem els equips i l\'experiència d\'escolta.', icon: 'Handshake' },
        { title: 'Format íntim', description: '25-30 membres del club en un espai acústicament preparat.', icon: 'Users' },
        { title: 'Escolta guiada', description: 'Un host expert contextualitza cada disc amb anècdotes i detalls de producció.', icon: 'Mic' },
        { title: 'Experiència social', description: 'Conversa final, intercanvi d\'impressions i networking entre melòmans.', icon: 'MessageCircle' },
      ],
    },
    es: {
      title: 'Cómo funcionan las sesiones',
      body: '<p>Sesiones temáticas alrededor de los artistas y géneros que os unen. Una experiencia de escucha inolvidable para vuestros miembros.</p>',
      items: [
        { title: 'Co-curaduría', description: 'Elegís los discos y artistas juntos. Nosotros aportamos los equipos y la experiencia de escucha.', icon: 'Handshake' },
        { title: 'Formato íntimo', description: '25-30 miembros del club en un espacio acústicamente preparado.', icon: 'Users' },
        { title: 'Escucha guiada', description: 'Un host experto contextualiza cada disco con anécdotas y detalles de producción.', icon: 'Mic' },
        { title: 'Experiencia social', description: 'Conversación final, intercambio de impresiones y networking entre melómanos.', icon: 'MessageCircle' },
      ],
    },
    en: {
      title: 'How sessions work',
      body: '<p>Themed sessions around the artists and genres that unite you. An unforgettable listening experience for your members.</p>',
      items: [
        { title: 'Co-curation', description: 'Choose the records and artists together. We provide the equipment and listening experience.', icon: 'Handshake' },
        { title: 'Intimate format', description: '25-30 club members in an acoustically prepared space.', icon: 'Users' },
        { title: 'Guided listening', description: 'An expert host contextualizes each record with anecdotes and production details.', icon: 'Mic' },
        { title: 'Social experience', description: 'Final conversation, exchange of impressions and networking among music lovers.', icon: 'MessageCircle' },
      ],
    },
  },
  COMPANY: {
    ca: {
      title: 'Format de l\'experiència corporativa',
      body: '<p>Una experiència sensorial exclusiva per al vostre equip o clients. Totalment personalitzable.</p>',
      items: [
        { title: 'Sessió privada', description: 'Experiència exclusiva per al vostre grup. 15-30 participants en un espai premium.', icon: 'Lock' },
        { title: 'Curadoria a mida', description: 'Selecció musical adaptada als gustos del grup o a la temàtica de l\'esdeveniment.', icon: 'Wand2' },
        { title: 'Hospitalitat premium', description: 'Opció de càtering, cocteleria i espai social pre/post sessió.', icon: 'Wine' },
        { title: 'Branding subtil', description: 'Possibilitat d\'integrar la identitat de la vostra empresa en l\'experiència.', icon: 'Palette' },
      ],
    },
    es: {
      title: 'Formato de la experiencia corporativa',
      body: '<p>Una experiencia sensorial exclusiva para vuestro equipo o clientes. Totalmente personalizable.</p>',
      items: [
        { title: 'Sesión privada', description: 'Experiencia exclusiva para vuestro grupo. 15-30 participantes en un espacio premium.', icon: 'Lock' },
        { title: 'Curaduría a medida', description: 'Selección musical adaptada a los gustos del grupo o a la temática del evento.', icon: 'Wand2' },
        { title: 'Hospitalidad premium', description: 'Opción de catering, coctelería y espacio social pre/post sesión.', icon: 'Wine' },
        { title: 'Branding sutil', description: 'Posibilidad de integrar la identidad de vuestra empresa en la experiencia.', icon: 'Palette' },
      ],
    },
    en: {
      title: 'Corporate experience format',
      body: '<p>An exclusive sensory experience for your team or clients. Fully customizable.</p>',
      items: [
        { title: 'Private session', description: 'Exclusive experience for your group. 15-30 participants in a premium space.', icon: 'Lock' },
        { title: 'Tailored curation', description: 'Musical selection adapted to the group\'s tastes or event theme.', icon: 'Wand2' },
        { title: 'Premium hospitality', description: 'Catering, cocktails and social space pre/post session option.', icon: 'Wine' },
        { title: 'Subtle branding', description: 'Possibility of integrating your company\'s identity into the experience.', icon: 'Palette' },
      ],
    },
  },
  RECORD_LABEL: {
    ca: {
      title: 'Format de presentació de discos',
      body: '<p>El llançament perfecte: un disc presentat davant d\'un públic audiòfil expert, en condicions d\'escolta insuperables.</p>',
      items: [
        { title: 'Listening party premium', description: 'Sessió dedicada al vostre llançament. Escolta completa en alta fidelitat extrema.', icon: 'PartyPopper' },
        { title: 'Presentació de l\'artista', description: 'Opció de tenir l\'artista present per contextualitzar l\'obra i interactuar amb el públic.', icon: 'Mic' },
        { title: 'Captació audiovisual', description: 'Enregistrament professional de la sessió per als vostres canals i els nostres.', icon: 'Video' },
        { title: 'Difusió amplificada', description: 'Review a HiFiCafe.org, vídeo a YouTube i cobertura a Instagram. Abast global.', icon: 'Globe' },
      ],
    },
    es: {
      title: 'Formato de presentación de discos',
      body: '<p>El lanzamiento perfecto: un disco presentado ante un público audiófilo experto, en condiciones de escucha insuperables.</p>',
      items: [
        { title: 'Listening party premium', description: 'Sesión dedicada a vuestro lanzamiento. Escucha completa en alta fidelidad extrema.', icon: 'PartyPopper' },
        { title: 'Presentación del artista', description: 'Opción de tener al artista presente para contextualizar la obra e interactuar con el público.', icon: 'Mic' },
        { title: 'Captación audiovisual', description: 'Grabación profesional de la sesión para vuestros canales y los nuestros.', icon: 'Video' },
        { title: 'Difusión amplificada', description: 'Review en HiFiCafe.org, vídeo en YouTube y cobertura en Instagram. Alcance global.', icon: 'Globe' },
      ],
    },
    en: {
      title: 'Record presentation format',
      body: '<p>The perfect launch: a record presented to an expert audiophile audience, in unbeatable listening conditions.</p>',
      items: [
        { title: 'Premium listening party', description: 'Dedicated session for your release. Complete listening in extreme high fidelity.', icon: 'PartyPopper' },
        { title: 'Artist presentation', description: 'Option to have the artist present to contextualize the work and interact with the audience.', icon: 'Mic' },
        { title: 'Audiovisual capture', description: 'Professional recording of the session for your channels and ours.', icon: 'Video' },
        { title: 'Amplified broadcast', description: 'Review on HiFiCafe.org, video on YouTube and coverage on Instagram. Global reach.', icon: 'Globe' },
      ],
    },
  },
}

// Collaboration + Benefits section
const collaborationDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: {
      title: 'Proposta de col·laboració i beneficis',
      body: '<p>No proposem llogar un espai. Proposem una <strong>col·laboració estratègica entre dues marques premium</strong>.</p>',
      items: [
        { title: 'Experiència exclusiva per als vostres membres', description: 'Nova capa d\'experiència cultural premium. Networking natural entre perfils afins.', icon: 'Star' },
        { title: 'Contingut i visibilitat', description: 'Peces curtes per social media, storytelling editorial, vídeos associats al vostre nom.', icon: 'Video' },
        { title: 'Oportunitat comercial', description: 'F&B pre/post sessió, possibles activacions de producte, sponsorship subtil.', icon: 'TrendingUp' },
        { title: 'Posicionament cultural', description: 'Associació amb la cultura musical d\'alta gamma. Accés a una comunitat global d\'audiòfils.', icon: 'Award' },
      ],
    },
    es: {
      title: 'Propuesta de colaboración y beneficios',
      body: '<p>No proponemos alquilar un espacio. Proponemos una <strong>colaboración estratégica entre dos marcas premium</strong>.</p>',
      items: [
        { title: 'Experiencia exclusiva para vuestros miembros', description: 'Nueva capa de experiencia cultural premium. Networking natural entre perfiles afines.', icon: 'Star' },
        { title: 'Contenido y visibilidad', description: 'Piezas cortas para social media, storytelling editorial, vídeos asociados a vuestro nombre.', icon: 'Video' },
        { title: 'Oportunidad comercial', description: 'F&B pre/post sesión, posibles activaciones de producto, sponsorship sutil.', icon: 'TrendingUp' },
        { title: 'Posicionamiento cultural', description: 'Asociación con la cultura musical de alta gama. Acceso a una comunidad global de audiófilos.', icon: 'Award' },
      ],
    },
    en: {
      title: 'Collaboration proposal and benefits',
      body: '<p>We\'re not proposing to rent a space. We\'re proposing a <strong>strategic collaboration between two premium brands</strong>.</p>',
      items: [
        { title: 'Exclusive experience for your members', description: 'New layer of premium cultural experience. Natural networking among like-minded profiles.', icon: 'Star' },
        { title: 'Content and visibility', description: 'Short pieces for social media, editorial storytelling, videos associated with your name.', icon: 'Video' },
        { title: 'Commercial opportunity', description: 'F&B pre/post session, possible product activations, subtle sponsorship.', icon: 'TrendingUp' },
        { title: 'Cultural positioning', description: 'Association with high-end music culture. Access to a global audiophile community.', icon: 'Award' },
      ],
    },
  },
  DISC_PROVIDER: {
    ca: {
      title: 'Col·laboració i beneficis',
      body: '<p>Una aliança natural entre qui crea/distribueix el vinil i qui el presenta al públic ideal.</p>',
      items: [
        { title: 'Exposició directa', description: 'Els vostres discos, presentats davant audiòfils que compren. Demostració en condicions òptimes.', icon: 'Eye' },
        { title: 'Canal de venda directa', description: 'Possibilitat de venda in situ o derivació a la vostra botiga amb descompte exclusiu.', icon: 'ShoppingBag' },
        { title: 'Reviews i recomanacions', description: 'Cobertura editorial a HiFiCafe.org i recomanacions als nostres canals.', icon: 'FileText' },
        { title: 'Curadoria compartida', description: 'Participeu en la selecció de discos per a sessions futures.', icon: 'Handshake' },
      ],
    },
    es: {
      title: 'Colaboración y beneficios',
      body: '<p>Una alianza natural entre quien crea/distribuye el vinilo y quien lo presenta al público ideal.</p>',
      items: [
        { title: 'Exposición directa', description: 'Vuestros discos, presentados ante audiófilos que compran. Demostración en condiciones óptimas.', icon: 'Eye' },
        { title: 'Canal de venta directa', description: 'Posibilidad de venta in situ o derivación a vuestra tienda con descuento exclusivo.', icon: 'ShoppingBag' },
        { title: 'Reviews y recomendaciones', description: 'Cobertura editorial en HiFiCafe.org y recomendaciones en nuestros canales.', icon: 'FileText' },
        { title: 'Curaduría compartida', description: 'Participáis en la selección de discos para sesiones futuras.', icon: 'Handshake' },
      ],
    },
    en: {
      title: 'Collaboration and benefits',
      body: '<p>A natural alliance between those who create/distribute vinyl and those who present it to the ideal audience.</p>',
      items: [
        { title: 'Direct exposure', description: 'Your records, presented to audiophiles who buy. Demonstration in optimal conditions.', icon: 'Eye' },
        { title: 'Direct sales channel', description: 'Possibility of on-site sales or referral to your store with exclusive discount.', icon: 'ShoppingBag' },
        { title: 'Reviews and recommendations', description: 'Editorial coverage on HiFiCafe.org and recommendations on our channels.', icon: 'FileText' },
        { title: 'Shared curation', description: 'Participate in selecting records for future sessions.', icon: 'Handshake' },
      ],
    },
  },
  FAN_CLUB: {
    ca: {
      title: 'Col·laboració i beneficis',
      body: '<p>Junts podem crear experiències que els vostres membres recordaran sempre.</p>',
      items: [
        { title: 'Activitats exclusives', description: 'Sessions d\'escolta temàtiques per als membres del club. Contingut únic.', icon: 'Star' },
        { title: 'Enfortiment del club', description: 'Experiències que fidelitzen membres i n\'atreuen de nous.', icon: 'Users' },
        { title: 'Visibilitat creuada', description: 'Promoció mútua als respectius canals i comunitats.', icon: 'Share2' },
        { title: 'Co-producció de contingut', description: 'Vídeos, podcasts i articles conjunts sobre les sessions.', icon: 'Video' },
      ],
    },
    es: {
      title: 'Colaboración y beneficios',
      body: '<p>Juntos podemos crear experiencias que vuestros miembros recordarán siempre.</p>',
      items: [
        { title: 'Actividades exclusivas', description: 'Sesiones de escucha temáticas para los miembros del club. Contenido único.', icon: 'Star' },
        { title: 'Fortalecimiento del club', description: 'Experiencias que fidelizan miembros y atraen nuevos.', icon: 'Users' },
        { title: 'Visibilidad cruzada', description: 'Promoción mutua en los respectivos canales y comunidades.', icon: 'Share2' },
        { title: 'Co-producción de contenido', description: 'Vídeos, podcasts y artículos conjuntos sobre las sesiones.', icon: 'Video' },
      ],
    },
    en: {
      title: 'Collaboration and benefits',
      body: '<p>Together we can create experiences your members will always remember.</p>',
      items: [
        { title: 'Exclusive activities', description: 'Themed listening sessions for club members. Unique content.', icon: 'Star' },
        { title: 'Club strengthening', description: 'Experiences that retain members and attract new ones.', icon: 'Users' },
        { title: 'Cross visibility', description: 'Mutual promotion across respective channels and communities.', icon: 'Share2' },
        { title: 'Content co-production', description: 'Joint videos, podcasts and articles about sessions.', icon: 'Video' },
      ],
    },
  },
  COMPANY: {
    ca: {
      title: 'Proposta i beneficis',
      body: '<p>Experiències corporatives que deixen marca. Personalitzades per a la vostra empresa.</p>',
      items: [
        { title: 'Team building premium', description: 'Una experiència sensorial que uneix equips d\'una manera autèntica i memorable.', icon: 'Users' },
        { title: 'Client entertainment', description: 'Impressioneu clients VIP amb una experiència exclusiva i diferencial.', icon: 'Star' },
        { title: 'Employer branding', description: 'Associeu la vostra marca a la cultura, la qualitat i l\'exclusivitat.', icon: 'Award' },
        { title: 'Format flexible', description: 'Des de sessions puntuals fins a programes recurrents. Adaptat a les vostres necessitats.', icon: 'Settings' },
      ],
    },
    es: {
      title: 'Propuesta y beneficios',
      body: '<p>Experiencias corporativas que dejan huella. Personalizadas para vuestra empresa.</p>',
      items: [
        { title: 'Team building premium', description: 'Una experiencia sensorial que une equipos de una manera auténtica y memorable.', icon: 'Users' },
        { title: 'Client entertainment', description: 'Impresionad a clientes VIP con una experiencia exclusiva y diferencial.', icon: 'Star' },
        { title: 'Employer branding', description: 'Asociad vuestra marca a la cultura, la calidad y la exclusividad.', icon: 'Award' },
        { title: 'Formato flexible', description: 'Desde sesiones puntuales hasta programas recurrentes. Adaptado a vuestras necesidades.', icon: 'Settings' },
      ],
    },
    en: {
      title: 'Proposal and benefits',
      body: '<p>Corporate experiences that leave a mark. Customized for your company.</p>',
      items: [
        { title: 'Premium team building', description: 'A sensory experience that bonds teams in an authentic and memorable way.', icon: 'Users' },
        { title: 'Client entertainment', description: 'Impress VIP clients with an exclusive and differential experience.', icon: 'Star' },
        { title: 'Employer branding', description: 'Associate your brand with culture, quality and exclusivity.', icon: 'Award' },
        { title: 'Flexible format', description: 'From one-off sessions to recurring programs. Adapted to your needs.', icon: 'Settings' },
      ],
    },
  },
  RECORD_LABEL: {
    ca: {
      title: 'Col·laboració i beneficis',
      body: '<p>El pont perfecte entre el vostre catàleg i el públic que el mereix.</p>',
      items: [
        { title: 'Llançaments amb impacte', description: 'Presenteu els vostres discos davant el públic ideal: audiòfils que compren i prescriuen.', icon: 'Rocket' },
        { title: 'Contingut audiovisual', description: 'Vídeo professional de la sessió per als vostres canals. Contingut perenne.', icon: 'Video' },
        { title: 'Reviews d\'autoritat', description: 'Cobertura editorial a HiFiCafe.org, referent en la comunitat audiòfila.', icon: 'FileText' },
        { title: 'Accés a la comunitat', description: 'Connexió directa amb una xarxa d\'audiòfils i col·leccionistes actius.', icon: 'Users' },
      ],
    },
    es: {
      title: 'Colaboración y beneficios',
      body: '<p>El puente perfecto entre vuestro catálogo y el público que lo merece.</p>',
      items: [
        { title: 'Lanzamientos con impacto', description: 'Presentad vuestros discos ante el público ideal: audiófilos que compran y prescriben.', icon: 'Rocket' },
        { title: 'Contenido audiovisual', description: 'Vídeo profesional de la sesión para vuestros canales. Contenido perenne.', icon: 'Video' },
        { title: 'Reviews de autoridad', description: 'Cobertura editorial en HiFiCafe.org, referente en la comunidad audiófila.', icon: 'FileText' },
        { title: 'Acceso a la comunidad', description: 'Conexión directa con una red de audiófilos y coleccionistas activos.', icon: 'Users' },
      ],
    },
    en: {
      title: 'Collaboration and benefits',
      body: '<p>The perfect bridge between your catalog and the audience it deserves.</p>',
      items: [
        { title: 'Impactful launches', description: 'Present your records to the ideal audience: audiophiles who buy and prescribe.', icon: 'Rocket' },
        { title: 'Audiovisual content', description: 'Professional video of the session for your channels. Evergreen content.', icon: 'Video' },
        { title: 'Authority reviews', description: 'Editorial coverage on HiFiCafe.org, a reference in the audiophile community.', icon: 'FileText' },
        { title: 'Community access', description: 'Direct connection with a network of active audiophiles and collectors.', icon: 'Users' },
      ],
    },
  },
}

// Roadmap section
const roadmapDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: {
      title: 'Pla pilot i visió de futur',
      body: '',
      items: [
        { title: 'Fase 1 — Barcelona 2026', description: 'Prova de concepte: 3 sessions al vostre espai. Validació del format i la demanda. Aforament 25-30 persones.', icon: 'MapPin' },
        { title: 'Fase 2 — Espanya 2027', description: 'Expansió nacional: Madrid, Bilbao, Sevilla, València. Xarxa d\'espais premium associats.', icon: 'Map' },
        { title: 'Fase 3 — Europa 2028+', description: 'Projecció internacional. Col·laboració amb clubs audiòfils globals. Format exportable a qualsevol mercat.', icon: 'Globe' },
      ],
    },
    es: {
      title: 'Plan piloto y visión de futuro',
      body: '',
      items: [
        { title: 'Fase 1 — Barcelona 2026', description: 'Prueba de concepto: 3 sesiones en vuestro espacio. Validación del formato y la demanda. Aforo 25-30 personas.', icon: 'MapPin' },
        { title: 'Fase 2 — España 2027', description: 'Expansión nacional: Madrid, Bilbao, Sevilla, Valencia. Red de espacios premium asociados.', icon: 'Map' },
        { title: 'Fase 3 — Europa 2028+', description: 'Proyección internacional. Colaboración con clubs audiófilos globales. Formato exportable a cualquier mercado.', icon: 'Globe' },
      ],
    },
    en: {
      title: 'Pilot plan and future vision',
      body: '',
      items: [
        { title: 'Phase 1 — Barcelona 2026', description: 'Proof of concept: 3 sessions at your venue. Format and demand validation. Capacity 25-30 people.', icon: 'MapPin' },
        { title: 'Phase 2 — Spain 2027', description: 'National expansion: Madrid, Bilbao, Seville, Valencia. Network of associated premium spaces.', icon: 'Map' },
        { title: 'Phase 3 — Europe 2028+', description: 'International projection. Collaboration with global audiophile clubs. Exportable format to any market.', icon: 'Globe' },
      ],
    },
  },
  DISC_PROVIDER: {
    ca: {
      title: 'Pla de col·laboració',
      body: '',
      items: [
        { title: 'Inici — Prova pilot', description: 'Subministrament de discos per a 3 sessions. Avaluació conjunta dels resultats.', icon: 'Rocket' },
        { title: 'Creixement — Col·laboració regular', description: 'Acord de subministrament recurrent. Participació en la curadoria. Presència als nostres canals.', icon: 'TrendingUp' },
        { title: 'Consolidació — Partnership estratègic', description: 'Co-branding, edicions exclusives, presència a fires i festivals.', icon: 'Award' },
      ],
    },
    es: {
      title: 'Plan de colaboración',
      body: '',
      items: [
        { title: 'Inicio — Prueba piloto', description: 'Suministro de discos para 3 sesiones. Evaluación conjunta de los resultados.', icon: 'Rocket' },
        { title: 'Crecimiento — Colaboración regular', description: 'Acuerdo de suministro recurrente. Participación en la curaduría. Presencia en nuestros canales.', icon: 'TrendingUp' },
        { title: 'Consolidación — Partnership estratégico', description: 'Co-branding, ediciones exclusivas, presencia en ferias y festivales.', icon: 'Award' },
      ],
    },
    en: {
      title: 'Collaboration plan',
      body: '',
      items: [
        { title: 'Start — Pilot test', description: 'Record supply for 3 sessions. Joint evaluation of results.', icon: 'Rocket' },
        { title: 'Growth — Regular collaboration', description: 'Recurring supply agreement. Participation in curation. Presence on our channels.', icon: 'TrendingUp' },
        { title: 'Consolidation — Strategic partnership', description: 'Co-branding, exclusive editions, presence at fairs and festivals.', icon: 'Award' },
      ],
    },
  },
  FAN_CLUB: {
    ca: {
      title: 'Pla de col·laboració',
      body: '',
      items: [
        { title: 'Primera sessió conjunta', description: 'Una sessió temàtica per als membres del club. Co-curadoria de la selecció musical.', icon: 'Music2' },
        { title: 'Programa regular', description: 'Sessions periòdiques (mensuals/trimestrals). Contingut compartit als dos canals.', icon: 'Calendar' },
        { title: 'Comunitat unificada', description: 'Membres del club amb accés preferent a totes les sessions Sound Deluxe.', icon: 'Users' },
      ],
    },
    es: {
      title: 'Plan de colaboración',
      body: '',
      items: [
        { title: 'Primera sesión conjunta', description: 'Una sesión temática para los miembros del club. Co-curaduría de la selección musical.', icon: 'Music2' },
        { title: 'Programa regular', description: 'Sesiones periódicas (mensuales/trimestrales). Contenido compartido en ambos canales.', icon: 'Calendar' },
        { title: 'Comunidad unificada', description: 'Miembros del club con acceso preferente a todas las sesiones Sound Deluxe.', icon: 'Users' },
      ],
    },
    en: {
      title: 'Collaboration plan',
      body: '',
      items: [
        { title: 'First joint session', description: 'A themed session for club members. Co-curation of the musical selection.', icon: 'Music2' },
        { title: 'Regular program', description: 'Periodic sessions (monthly/quarterly). Content shared on both channels.', icon: 'Calendar' },
        { title: 'Unified community', description: 'Club members with preferential access to all Sound Deluxe sessions.', icon: 'Users' },
      ],
    },
  },
  COMPANY: {
    ca: {
      title: 'Opcions i pla',
      body: '',
      items: [
        { title: 'Sessió única', description: 'Una experiència exclusiva per a un esdeveniment concret: team building, celebració, client entertainment.', icon: 'Calendar' },
        { title: 'Programa trimestral', description: '4 sessions a l\'any per al vostre equip o clients. Descompte per compromís.', icon: 'Repeat' },
        { title: 'Partnership anual', description: 'Col·laboració estratègica amb branding associat, contingut exclusiu i accés prioritari.', icon: 'Award' },
      ],
    },
    es: {
      title: 'Opciones y plan',
      body: '',
      items: [
        { title: 'Sesión única', description: 'Una experiencia exclusiva para un evento concreto: team building, celebración, client entertainment.', icon: 'Calendar' },
        { title: 'Programa trimestral', description: '4 sesiones al año para vuestro equipo o clientes. Descuento por compromiso.', icon: 'Repeat' },
        { title: 'Partnership anual', description: 'Colaboración estratégica con branding asociado, contenido exclusivo y acceso prioritario.', icon: 'Award' },
      ],
    },
    en: {
      title: 'Options and plan',
      body: '',
      items: [
        { title: 'Single session', description: 'An exclusive experience for a specific event: team building, celebration, client entertainment.', icon: 'Calendar' },
        { title: 'Quarterly program', description: '4 sessions per year for your team or clients. Commitment discount.', icon: 'Repeat' },
        { title: 'Annual partnership', description: 'Strategic collaboration with associated branding, exclusive content and priority access.', icon: 'Award' },
      ],
    },
  },
  RECORD_LABEL: {
    ca: {
      title: 'Pla de col·laboració',
      body: '',
      items: [
        { title: 'Sessió de presentació', description: 'Una sessió dedicada al vostre proper llançament. Escolta completa + review editorial.', icon: 'Disc3' },
        { title: 'Programa de llançaments', description: 'Col·laboració regular per presentar els vostres llançaments clau al llarg de l\'any.', icon: 'Calendar' },
        { title: 'Partnership estratègic', description: 'Presència permanent als nostres canals. Co-producció de contingut. Accés a la xarxa d\'espais.', icon: 'Handshake' },
      ],
    },
    es: {
      title: 'Plan de colaboración',
      body: '',
      items: [
        { title: 'Sesión de presentación', description: 'Una sesión dedicada a vuestro próximo lanzamiento. Escucha completa + review editorial.', icon: 'Disc3' },
        { title: 'Programa de lanzamientos', description: 'Colaboración regular para presentar vuestros lanzamientos clave a lo largo del año.', icon: 'Calendar' },
        { title: 'Partnership estratégico', description: 'Presencia permanente en nuestros canales. Co-producción de contenido. Acceso a la red de espacios.', icon: 'Handshake' },
      ],
    },
    en: {
      title: 'Collaboration plan',
      body: '',
      items: [
        { title: 'Presentation session', description: 'A dedicated session for your next release. Complete listening + editorial review.', icon: 'Disc3' },
        { title: 'Release program', description: 'Regular collaboration to present your key releases throughout the year.', icon: 'Calendar' },
        { title: 'Strategic partnership', description: 'Permanent presence on our channels. Content co-production. Access to venue network.', icon: 'Handshake' },
      ],
    },
  },
}

// CTA section
const ctaDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> = {
  VENUE: {
    ca: { title: 'Parlem?', body: '<p>Estem oberts a explorar col·laboracions que beneficiïn ambdues parts. Contacta\'ns per concretar els detalls.</p><p><strong>Pròxims passos:</strong> Reunió de 30 min per ajustar objectius · Visita tècnica i proposta de dates · Definició del pilot (3 sessions).</p>' },
    es: { title: '¿Hablamos?', body: '<p>Estamos abiertos a explorar colaboraciones que beneficien a ambas partes. Contáctanos para concretar los detalles.</p><p><strong>Próximos pasos:</strong> Reunión de 30 min para ajustar objetivos · Visita técnica y propuesta de fechas · Definición del piloto (3 sesiones).</p>' },
    en: { title: 'Shall we talk?', body: '<p>We are open to exploring collaborations that benefit both parties. Contact us to discuss the details.</p><p><strong>Next steps:</strong> 30 min meeting to align objectives · Technical visit and date proposal · Pilot definition (3 sessions).</p>' },
  },
  DISC_PROVIDER: {
    ca: { title: 'Parlem?', body: '<p>Volem descobrir el vostre catàleg i trobar la millor manera de col·laborar. Contacta\'ns per començar.</p>' },
    es: { title: '¿Hablamos?', body: '<p>Queremos descubrir vuestro catálogo y encontrar la mejor manera de colaborar. Contáctanos para empezar.</p>' },
    en: { title: 'Shall we talk?', body: '<p>We want to discover your catalog and find the best way to collaborate. Contact us to get started.</p>' },
  },
  FAN_CLUB: {
    ca: { title: 'Fem-ho!', body: '<p>Compartim la passió per la música. Organitzem una sessió junts! Contacta\'ns per planificar la primera experiència.</p>' },
    es: { title: '¡Hagámoslo!', body: '<p>Compartimos la pasión por la música. ¡Organicemos una sesión juntos! Contáctanos para planificar la primera experiencia.</p>' },
    en: { title: 'Let\'s do it!', body: '<p>We share the passion for music. Let\'s organize a session together! Contact us to plan the first experience.</p>' },
  },
  COMPANY: {
    ca: { title: 'Creem la vostra experiència', body: '<p>Cada empresa és única. Expliqueu-nos què busqueu i dissenyarem l\'experiència Sound Deluxe perfecta per al vostre equip o clients.</p>' },
    es: { title: 'Creemos vuestra experiencia', body: '<p>Cada empresa es única. Contadnos qué buscáis y diseñaremos la experiencia Sound Deluxe perfecta para vuestro equipo o clientes.</p>' },
    en: { title: 'Let\'s create your experience', body: '<p>Every company is unique. Tell us what you\'re looking for and we\'ll design the perfect Sound Deluxe experience for your team or clients.</p>' },
  },
  RECORD_LABEL: {
    ca: { title: 'Presentem el vostre proper disc', body: '<p>Teniu un llançament a prop? Parlem de com fer-ne una presentació inoblidable davant el públic que mereix.</p>' },
    es: { title: 'Presentemos vuestro próximo disco', body: '<p>¿Tenéis un lanzamiento cerca? Hablemos de cómo hacer una presentación inolvidable ante el público que merece.</p>' },
    en: { title: 'Let\'s present your next record', body: '<p>Do you have an upcoming release? Let\'s talk about how to make an unforgettable presentation to the audience it deserves.</p>' },
  },
}

// ============================================
// SECTION REGISTRY
// ============================================

function buildTypeSpecificSection(
  key: string,
  name: { ca: string; es: string; en: string },
  component: SectionDefinition['component'],
  defaults: Record<CommercialRecipientType, Record<Lang, SectionContent>>,
  extra?: Partial<SectionDefinition>
): SectionDefinition & { typeDefaults: Record<CommercialRecipientType, Record<Lang, SectionContent>> } {
  return {
    key,
    name,
    category: 'type_specific',
    component,
    defaultContent: defaults.VENUE, // fallback
    ...extra,
    typeDefaults: defaults,
  }
}

// All sections in a flat registry
export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  'hero': heroSection,
  'about': aboutSection,
  'context': contextSection,
  'team-community': teamCommunitySection,
  'equipment': equipmentSection,
  'platform-metrics': platformMetricsSection,
  'audience': { ...buildTypeSpecificSection('audience', { ca: 'El nostre públic', es: 'Nuestro público', en: 'Our audience' }, 'SectionCards', audienceDefaults, { defaultImage: '/images/comercial/session-audience.jpg' }) },
  'why-you': { ...buildTypeSpecificSection('why-you', { ca: 'Per què tu', es: 'Por qué tú', en: 'Why you' }, 'SectionText', whyYouDefaults, { defaultImage: '/images/comercial/hifi-setup.jpg' }) },
  'format': { ...buildTypeSpecificSection('format', { ca: 'Format sessions', es: 'Formato sesiones', en: 'Session format' }, 'SectionCards', formatDefaults, { defaultImage: '/images/comercial/session-gallery.jpg' }) },
  'collaboration': { ...buildTypeSpecificSection('collaboration', { ca: 'Proposta i beneficis', es: 'Propuesta y beneficios', en: 'Proposal and benefits' }, 'SectionCards', collaborationDefaults, { defaultImage: '/images/comercial/session-presenter.jpg' }) },
  'roadmap': { ...buildTypeSpecificSection('roadmap', { ca: 'Pla i futur', es: 'Plan y futuro', en: 'Plan and future' }, 'SectionTimeline', roadmapDefaults) },
  'cta': { ...buildTypeSpecificSection('cta', { ca: 'Contacte', es: 'Contacto', en: 'Contact' }, 'SectionCTA', ctaDefaults) },
}

// Helper to get type-specific content for a section
export function getSectionContentForType(
  sectionKey: string,
  recipientType: CommercialRecipientType,
  lang: Lang
): SectionContent {
  const section = SECTION_REGISTRY[sectionKey]
  if (!section) return { title: '', body: '' }

  // Check if this section has type-specific defaults
  const withTypeDefaults = section as SectionDefinition & {
    typeDefaults?: Record<CommercialRecipientType, Record<Lang, SectionContent>>
  }

  if (withTypeDefaults.typeDefaults?.[recipientType]?.[lang]) {
    return withTypeDefaults.typeDefaults[recipientType][lang]
  }

  return section.defaultContent[lang] || section.defaultContent.ca
}
