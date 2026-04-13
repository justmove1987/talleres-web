export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-8 text-sm">

        <div className="flex flex-col md:flex-row justify-between gap-6">

          <div>
            <p className="font-semibold text-white mb-2">Plain Air 🎨</p>
            <p>Talleres artísticos en tu barrio.</p>
          </div>

          <div>
            <p className="font-semibold text-white mb-2">Contacto</p>
            <p>Email: info@plainair.com</p>
            <p>Barcelona</p>
          </div>

        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          © 2026 Plain Air. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  )
}