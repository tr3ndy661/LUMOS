import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/navBar'
import Collection from '@/components/Collection'
// import Collection from '@/components/Collection'
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'LUMOS | Avant-Garde Optics',
  description: 'Avant-Garde Optics for the Dark Room',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background-dark text-[#f4f4f5] font-display selection:bg-primary selection:text-black`}>
        <NavBar />
        {children}
        <Collection />
      </body>
    </html>
  )
}