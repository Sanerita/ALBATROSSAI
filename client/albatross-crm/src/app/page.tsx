export default function Home() {
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        AlbatrossAI CRM Dashboard
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="mt-4 p-6 bg-green-100 border border-green-400 rounded-lg shadow-sm">
          <p className="text-green-800 font-medium">
            ✅ If this box is green with rounded corners, Tailwind CSS is working correctly!
          </p>
        </div>

        {/* Additional test elements */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-navy">Tailwind Test</h2>
            <p className="mt-2 text-gray-600">
              Verify these styles appear correctly:
            </p>
            <ul className="mt-2 space-y-1">
              <li className="flex items-center">
                <span className="w-3 h-3 bg-gold rounded-full mr-2"></span>
                Gold accent color
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 bg-navy rounded-full mr-2"></span>
                Navy primary color
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-white rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-navy">Troubleshooting</h2>
            <p className="mt-2 text-gray-600">
              If styles aren't working:
            </p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
              <li>Check <code>tailwind.config.js</code> content paths</li>
              <li>Verify <code>globals.css</code> imports Tailwind directives</li>
              <li>Restart your dev server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}