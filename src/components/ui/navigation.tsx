'use client';

import React from 'react';
import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 sm:px-8 lg:px-12">
        <div className="flex h-20 items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">TumDum Pricing Analysis</h1>
          
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-base font-medium hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/records"
              className="text-base font-medium hover:text-gray-900"
            >
              Records
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 