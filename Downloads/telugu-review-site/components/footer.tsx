import Link from "next/link"
import { Youtube, Instagram, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <div>
                <div className="font-bold">Telugu Review Hub</div>
                <div className="text-sm text-muted-foreground">తెలుగు రివ్యూ హబ్</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">మీ కోసం ఉత్తమ ఉత్పాదకాలను కనుగొనండి. విశ్వసనీయ రివ్యూలు మరియు సిఫార్సులు.</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://youtube.com/@techreviewhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href="https://instagram.com/techreviewhub"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://t.me/techreviewhub" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <Send className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/categories" className="block hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/blog" className="block hover:text-primary transition-colors">
                Blog
              </Link>
              <Link href="/wishlist" className="block hover:text-primary transition-colors">
                Wishlist
              </Link>
              <Link href="/compare" className="block hover:text-primary transition-colors">
                Compare Products
              </Link>
              <Link href="/price-alerts" className="block hover:text-primary transition-colors">
                Price Alerts
              </Link>
              <Link href="/about" className="block hover:text-primary transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories | ప్రముఖ వర్గాలు</h3>
            <div className="space-y-2 text-sm">
              <Link href="/category/mobile-phones" className="block hover:text-primary">
                Mobile Phones | మొబైల్ ఫోన్లు
              </Link>
              <Link href="/category/home-appliances" className="block hover:text-primary">
                Home Appliances | గృహోపకరణలు
              </Link>
              <Link href="/category/electronics" className="block hover:text-primary">
                Electronics | ఎలక్ట్రానిక్స్
              </Link>
              <Link href="/category/kitchen" className="block hover:text-primary">
                Kitchen | వంటగది
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact | సంప్రదింపు</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: info@telugureviews.com</p>
              <p>Phone: +91 9876543210</p>
              <p>Address: Hyderabad, Telangana</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Telugu Review Hub. All rights reserved. | అన్ని హక్కులు రక్షించబడ్డాయి.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:text-primary">
              Affiliate Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
