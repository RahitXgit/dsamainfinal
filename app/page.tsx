'use client'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center justify-center mb-8 gap-4">
        <span className="text-6xl animate-bounce">📊</span>
        <span className="text-7xl animate-pulse">🎯</span>
        <span className="text-6xl animate-bounce">💻</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-4">
        Track Your DSA Progress
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
        The fun and easy way to stay on top of your Data Structures and
        Algorithms revision. Never miss a beat!
      </p>
      <Link href="/login" className="btn btn-primary">
        Get Started
      </Link>
    </div>
  )
}
