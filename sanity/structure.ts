import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sound Deluxe')
    .items([
      // === CONFIGURACIÓ ===
      S.listItem()
        .title('⚙️ Configuració del lloc')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Configuració general')
        ),

      S.divider(),

      // === CONTINGUT PRINCIPAL ===
      S.listItem()
        .title('📅 Sessions')
        .icon(() => '📅')
        .child(
          S.documentTypeList('session')
            .title('Sessions d\'escolta')
            .defaultOrdering([{field: 'date', direction: 'desc'}])
        ),

      S.listItem()
        .title('🎵 Àlbums')
        .icon(() => '🎵')
        .child(
          S.documentTypeList('album')
            .title('Col·lecció d\'àlbums')
        ),

      S.divider(),

      // === CONFIGURACIÓ SECUNDÀRIA ===
      S.listItem()
        .title('🏠 Sales Hi-Fi')
        .icon(() => '🏠')
        .child(
          S.documentTypeList('sala')
            .title('Sales d\'escolta')
        ),

      S.listItem()
        .title('🎭 Tipus de sessió')
        .icon(() => '🎭')
        .child(
          S.documentTypeList('sessionType')
            .title('Tipus de sessions')
        ),
    ])
