export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy | గోప్యతా విధానం</h1>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect | మేము సేకరించే సమాచారం</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, subscribe to our
                newsletter, or contact us for support.
              </p>
              <p className="text-muted-foreground">
                మీరు ఖాతా సృష్టించినప్పుడు, మా న్యూస్‌లెటర్‌కు సబ్‌స్క్రైబ్ చేసినప్పుడు లేదా మాకు సంప్రదించినప్పుడు మీరు నేరుగా మాకు అందించే సమాచారాన్ని మేము
                సేకరిస్తాము.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Information | మేము సమాచారాన్ని ఎలా ఉపయోగిస్తాము</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To send you newsletters and updates</li>
                <li>To respond to your comments and questions</li>
                <li>To analyze usage patterns and improve our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies | కుకీలు</h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and
                personalize content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Affiliate Links | అఫిలియేట్ లింక్‌లు</h2>
              <p>
                Our website contains affiliate links. When you click on these links and make a purchase, we may earn a
                commission at no additional cost to you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us | మాతో సంప్రదించండి</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@telugureviews.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
