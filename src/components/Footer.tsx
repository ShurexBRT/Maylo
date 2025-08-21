export default function Footer(){
  return (
    <footer className="mt-10 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>© {new Date().getFullYear()} Maylo</div>
        <nav className="flex items-center gap-4">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/faq" className="hover:underline">FAQ</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  )
}
