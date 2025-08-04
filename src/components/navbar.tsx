import Link from 'next/link';
import React from 'react'
import DesktopNavbar from './desktop-navbar';

function navbar() {
  return (
  <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-
  [backdrop-filter]:bg-background/60 z-50">
    <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <Link href="/" className="text-xl text-primary --font-syncopate tracking-wider">
                    <div style={{ fontFamily: 'var(--font-syncopate)' }}>
                        Lacium
                    </div>
                </Link>
            </div>

            <DesktopNavbar />
        </div>
    </div>

  </nav>
  );
}

export default navbar