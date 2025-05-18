// app/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="bg-[#dcae3e] min-h-[calc(100vh-4rem)] pt-8 pb-12 px-4 md:px-6">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to AlbatrossAI CRM
        </h1>
        <p className="text-xl md:text-2xl text-gray-800 mb-8">
          The intelligent way to manage your sales pipeline
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button className="bg-navy-900 hover:bg-navy-800 text-white">
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" className="border-navy-900 text-navy-900">
            <Link href="/demo">See Demo</Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: "AI-Powered Insights",
            description: "Get smart recommendations to prioritize your leads",
            icon: "🤖"
          },
          {
            title: "Drag & Drop Pipeline",
            description: "Visualize your sales process with our intuitive board",
            icon: "👆"
          },
          {
            title: "Real-Time Analytics",
            description: "Track performance with live dashboards",
            icon: "📊"
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      
    </div>
  )
}