import './globals.css'
import { Inter } from 'next/font/google'
import ConvexClientProvider from './ConvexClientProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Friendship Fiesta 3.0 - Event Registration',
  description: 'Register for the Friendship Fiesta 3.0 event by Interact Club',
  icons: {
    icon: '/logo2.png',
    shortcut: '/logo2.png',
    apple: '/logo2.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>
          {children}
          <footer style={{
            marginTop: 32,
            padding: '24px 0',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.9rem',
          }}>
            © {new Date().getFullYear()} Interact Club of Kathmandu. All rights reserved.
          </footer>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
