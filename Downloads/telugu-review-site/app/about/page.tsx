import { Users, Award, Target, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Chief Editor & Tech Reviewer",
      bio: "With over 8 years in tech journalism, Alex leads our review process and ensures every product gets thorough testing.",
      expertise: ["Smartphones", "Laptops", "Consumer Electronics"],
    },
    {
      name: "Sarah Chen",
      role: "Senior Product Analyst",
      bio: "Sarah specializes in performance testing and benchmarking, bringing technical depth to our reviews.",
      expertise: ["Performance Testing", "Gaming", "Hardware Analysis"],
    },
    {
      name: "Mike Rodriguez",
      role: "Home Tech Specialist",
      bio: "Mike focuses on smart home devices and appliances, helping readers build connected homes.",
      expertise: ["Smart Home", "Appliances", "IoT Devices"],
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Unbiased Reviews",
      description:
        "We maintain complete editorial independence and never let sponsorships influence our recommendations.",
    },
    {
      icon: Award,
      title: "Expert Testing",
      description: "Every product undergoes rigorous testing by our experienced team before we publish our review.",
    },
    {
      icon: Heart,
      title: "Consumer First",
      description: "We prioritize helping consumers make informed decisions over everything else.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "We listen to our readers and continuously improve based on your feedback and suggestions.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Tech Review Hub</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            We're passionate about helping you make informed decisions when buying technology products. Our expert team
            tests and reviews the latest gadgets to bring you honest, detailed insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>Founded in 2020</span>
            <span>•</span>
            <span>500+ Products Reviewed</span>
            <span>•</span>
            <span>100K+ Monthly Readers</span>
            <span>•</span>
            <span>Expert Team of 10+</span>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mb-16">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To provide comprehensive, unbiased product reviews that help consumers make confident purchasing
              decisions. We believe everyone deserves access to honest, expert opinions about the technology products
              they're considering, whether it's a budget smartphone or a premium laptop.
            </p>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-bold text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{member.bio}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Process */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Our Review Process</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold mb-2">Product Selection</h3>
                <p className="text-sm text-muted-foreground">
                  We carefully select products based on market relevance, user interest, and innovation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold mb-2">Hands-on Testing</h3>
                <p className="text-sm text-muted-foreground">
                  Our experts use each product extensively in real-world scenarios for at least 2 weeks.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold mb-2">Performance Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  We run comprehensive benchmarks and compare against similar products in the category.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold mb-2">Detailed Review</h3>
                <p className="text-sm text-muted-foreground">
                  We write comprehensive reviews highlighting pros, cons, and our final recommendation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions about our reviews or want to suggest a product for testing? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Us
              </a>
              <a
                href="mailto:info@techreviewhub.com"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                Email Us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
