import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SlangChatbot } from '@/components/slang-chatbot'
import { ThemeProvider } from '@/components/theme-provider'
import { EmojiCursorProvider } from '@/components/emoji-cursor-provider'
import './globals.css'
import './styles.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Slang Sense - Decode the Internet\'s Slang',
  description: 'AI-powered slang decoder that helps you understand Gen-Z and Gen-Alpha language instantly.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={inter.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["light", "dark", "pink"]}
          disableTransitionOnChange
        >
          <EmojiCursorProvider>
            {children}
            <SlangChatbot />
          </EmojiCursorProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
