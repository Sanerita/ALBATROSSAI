'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Leads', href: '/leads' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <header className="bg-navy-900 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-navy-500 py-3 lg:border-none">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="sr-only">AlbatrossAI</span>
              <div className="flex items-center">
                <Image
                  src="/logo2.png" // Update with your logo path
                  alt="AlbatrossAI Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
                <span className="ml-2 text-2xl font-bold text-gold-400">
                  Albatross<span className="text-white">AI</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gold-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:ml-10 lg:block">
            <div className="flex space-x-8">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium hover:text-gold-300 ${
                    pathname === link.href ? 'text-gold-400' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Profile/Login */}
          <div className="hidden lg:ml-10 lg:block">
            <Link
              href="/profile"
              className="inline-flex items-center rounded-md bg-gold-500 px-4 py-2 text-sm font-medium text-white hover:bg-gold-600"
            >
              My Profile
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 z-50 bg-navy-900/90 backdrop-blur-sm">
            <div className="fixed inset-x-0 top-0 flex items-center justify-between p-4">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">AlbatrossAI</span>
                <span className="text-xl font-bold text-gold-400">
                  Albatross<span className="text-white">AI</span>
                </span>
              </Link>
              <button
                type="button"
                className="-m-2 rounded-md p-2 text-gold-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-16 flow-root px-4 py-6">
              <div className="-my-6 divide-y divide-navy-500">
                <div className="space-y-8 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-medium ${
                        pathname === item.href
                          ? 'bg-navy-700 text-gold-400'
                          : 'text-white hover:bg-navy-800'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-medium text-white hover:bg-navy-800"
                  >
                    My Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}