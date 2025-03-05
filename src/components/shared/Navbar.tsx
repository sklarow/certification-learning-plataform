"use client"

import Link from "next/link"
import { Session } from "next-auth"
import { signIn, signOut } from "next-auth/react"

interface NavbarProps {
  session: Session | null
}

export function Navbar({ session }: NavbarProps) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">LMS</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/courses"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                Courses
              </Link>
              {session?.user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {session.user.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/courses" })}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 