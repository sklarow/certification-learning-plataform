import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname

      // Allow access to auth routes
      if (path.startsWith("/api/auth")) {
        return true
      }

      // Admin routes protection
      if (path.startsWith("/admin")) {
        return token?.role === "ADMIN"
      }

      // Protected routes that require authentication
      if (path.startsWith("/courses")) {
        return !!token
      }

      return true
    },
  },
})

export const config = {
  matcher: ["/admin/:path*", "/courses/:path*", "/api/auth/:path*"],
} 