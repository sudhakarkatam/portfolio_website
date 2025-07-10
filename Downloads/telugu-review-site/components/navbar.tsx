"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, Home, List, BookOpen, X, Heart, VoteIcon as Vs, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchComponent } from "@/components/search"
import { mockCategories } from "@/lib/mock-data"

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/categories", label: "Categories", icon: List, hasDropdown: true },
    { href: "/blog", label: "Blog", icon: BookOpen },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg">Tech Review Hub</div>
              <div className="text-xs text-muted-foreground">Your Tech Guide</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="flex flex-col items-center text-sm font-medium transition-colors hover:text-primary"
                >
                  <item.icon className="w-4 h-4 mb-1" />
                  <span>{item.label}</span>
                </Link>

                {item.hasDropdown && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      <h3 className="font-semibold mb-3">Shop by Category</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mockCategories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded text-sm"
                          >
                            <span>{category.icon}</span>
                            <span>{category.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <div className="hidden sm:block">
              <SearchComponent />
            </div>

            {/* Mobile Search Toggle */}
            <Button variant="ghost" size="sm" className="sm:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              {isSearchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="pb-4 border-b">
                    <SearchComponent />
                  </div>
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="flex items-center space-x-3 text-lg font-medium">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Link href="/wishlist" className="flex items-center space-x-3 text-lg font-medium">
                      <Heart className="w-5 h-5" />
                      <span>Wishlist</span>
                    </Link>
                    <Link href="/compare" className="flex items-center space-x-3 text-lg font-medium">
                      <Vs className="w-5 h-5" />
                      <span>Compare</span>
                    </Link>
                    <Link href="/price-alerts" className="flex items-center space-x-3 text-lg font-medium">
                      <Bell className="w-5 h-5" />
                      <span>Price Alerts</span>
                    </Link>
                    <Link href="/contact" className="block text-lg font-medium mb-2">
                      Contact
                    </Link>
                    <Link href="/about" className="block text-lg font-medium">
                      About
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="sm:hidden pb-4">
            <SearchComponent />
          </div>
        )}
      </div>
    </header>
  )
}
