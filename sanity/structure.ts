import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sound Deluxe')
    .items([
      // === CONTINGUT PRINCIPAL ===
      S.listItem()
        .title('Contingut')
        .icon(() => '🎶')
        .child(
          S.list()
            .title('Contingut')
            .items([
              S.listItem()
                .title('Sessions')
                .icon(() => '📅')
                .child(
                  S.documentTypeList('session')
                    .title('Sessions d\'escolta')
                    .defaultOrdering([{field: 'date', direction: 'desc'}])
                ),
              S.listItem()
                .title('Àlbums')
                .icon(() => '🎵')
                .child(
                  S.documentTypeList('album')
                    .title('Col·lecció d\'àlbums')
                ),
              S.listItem()
                .title('Tipus de sessió')
                .icon(() => '🎭')
                .child(
                  S.documentTypeList('sessionType')
                    .title('Tipus de sessions')
                ),
              S.listItem()
                .title('Sales Hi-Fi')
                .icon(() => '🏠')
                .child(
                  S.documentTypeList('sala')
                    .title('Sales d\'escolta')
                ),
            ])
        ),

      S.divider(),

      // === CONFIGURACIÓ ===
      S.listItem()
        .title('Configuració')
        .icon(() => '⚙️')
        .child(
          S.list()
            .title('Configuració')
            .items([
              S.listItem()
                .title('Pàgina principal')
                .icon(() => '🏠')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Configuració general')
                ),
              S.listItem()
                .title('Footer')
                .icon(() => '📋')
                .child(
                  S.document()
                    .schemaType('footerContent')
                    .documentId('footerContent')
                    .title('Contingut del Footer')
                ),
              S.listItem()
                .title('Pàgines Legals')
                .icon(() => '📜')
                .child(
                  S.list()
                    .title('Pàgines Legals')
                    .items([
                      S.listItem()
                        .title('Política de Privacitat')
                        .icon(() => '🔒')
                        .child(
                          S.document()
                            .schemaType('legalPage')
                            .documentId('legalPage-privacy')
                            .title('Política de Privacitat')
                        ),
                      S.listItem()
                        .title('Termes i Condicions')
                        .icon(() => '📄')
                        .child(
                          S.document()
                            .schemaType('legalPage')
                            .documentId('legalPage-terms')
                            .title('Termes i Condicions')
                        ),
                      S.listItem()
                        .title('Política de Cookies')
                        .icon(() => '🍪')
                        .child(
                          S.document()
                            .schemaType('legalPage')
                            .documentId('legalPage-cookies')
                            .title('Política de Cookies')
                        ),
                    ])
                ),
            ])
        ),
    ])
