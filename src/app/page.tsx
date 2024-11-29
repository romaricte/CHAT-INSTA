import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Communication instantanée, <span className="text-blue-600">simplifiée</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Une plateforme de messagerie moderne et sécurisée pour rester connecté avec vos proches et vos collègues.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Commencer maintenant
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Créer un compte
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Messagerie en temps réel</h3>
              <p className="text-gray-600">Échangez instantanément avec vos contacts dans une interface fluide et réactive.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité renforcée</h3>
              <p className="text-gray-600">Vos conversations sont protégées avec un chiffrement de bout en bout.</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Disponible partout</h3>
              <p className="text-gray-600">Accédez à vos messages depuis n'importe quel appareil, à tout moment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à nous rejoindre ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Créez votre compte gratuitement et commencez à communiquer dès aujourd'hui.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Messagerie Instantanée. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
