import 'dotenv/config'
import { resend, FROM_EMAIL, isResendConfigured } from '../lib/resend'
import { canSendEmailToEmail, isNewsletterPaused, getTestEmails } from '../lib/newsletter'

async function main() {
  console.log('=== Test Newsletter ===\n')

  // Verificar configuración
  console.log('📧 Configuració:')
  console.log(`   Resend configurat: ${isResendConfigured ? '✅' : '❌'}`)
  console.log(`   From: ${FROM_EMAIL}`)

  const paused = await isNewsletterPaused()
  console.log(`   Newsletter pausat: ${paused ? '⏸️  Sí (només test users)' : '▶️  No (tots els usuaris)'}`)

  const testEmails = await getTestEmails()
  console.log(`   Emails de test: ${testEmails.join(', ') || 'Cap'}`)

  // Email de destí
  const testEmail = 'josepmarimon@gmail.com'

  // Verificar si pot rebre
  const canSend = await canSendEmailToEmail(testEmail)
  console.log(`\n📬 Destinatari: ${testEmail}`)
  console.log(`   Pot rebre emails: ${canSend ? '✅ Sí' : '❌ No'}`)

  if (!canSend) {
    console.log('\n⚠️  Aquest email no pot rebre newsletters ara mateix.')
    console.log('   Afegeix-lo a la llista de test a Sanity Studio.')
    return
  }

  if (!isResendConfigured) {
    console.log('\n❌ Resend no està configurat. Afegeix RESEND_API_KEY a .env.local')
    return
  }

  // Enviar email de prova
  console.log('\n📤 Enviant email de prova...')

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: testEmail,
      subject: '🎵 Prova Newsletter - Sound Deluxe',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a1929; color: #fff; padding: 40px; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; background: linear-gradient(90deg, #D4AF37, #F4E5AD, #D4AF37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .content { background: #1a3a5c; border-radius: 12px; padding: 30px; }
            h1 { color: #D4AF37; margin-top: 0; }
            p { line-height: 1.6; color: #ccc; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Sound Deluxe</div>
            </div>
            <div class="content">
              <h1>✅ Prova de Newsletter</h1>
              <p>Hola Josep Maria,</p>
              <p>Aquest és un email de prova per verificar que el sistema de newsletters funciona correctament.</p>
              <p>Si estàs llegint això, vol dir que:</p>
              <ul style="color: #ccc;">
                <li>✅ Resend està configurat correctament</li>
                <li>✅ El teu domini està verificat</li>
                <li>✅ Pots rebre emails com a usuari de test</li>
              </ul>
              <p>Quan la web estigui llesta, desactiva "Newsletter pausat" a Sanity Studio i tots els subscriptors rebran els emails.</p>
            </div>
            <div class="footer">
              <p>Sound Deluxe - L'experiència definitiva del vinil</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    console.log('\n✅ Email enviat correctament!')
    console.log(`   ID: ${result.data?.id}`)
    console.log(`\n📥 Revisa la teva safata d'entrada: ${testEmail}`)

  } catch (error) {
    console.error('\n❌ Error enviant email:', error)
  }
}

main()
