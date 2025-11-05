// Next.js API route for secure contact form handling
// This route proxies requests to Web3Forms API with server-side API key protection

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.'
    });
  }

  try {
    // Validate required environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error'
      });
    }

    // Extract and validate request body
    const { name, email, message, subject, phone } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, message'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Prepare form data for Web3Forms
    const formData = new FormData();
    formData.append('access_key', accessKey);
    formData.append('name', name.trim());
    formData.append('email', email.trim().toLowerCase());
    formData.append('message', message.trim());

    // Optional fields
    if (subject) {
      formData.append('subject', subject.trim());
    } else {
      formData.append('subject', `New Message from ${name.trim()} - Portfolio Contact Form`);
    }

    if (phone) {
      formData.append('phone', phone.trim());
    }

    // Add additional metadata
    formData.append('from_name', 'Portfolio Website');
    formData.append('redirect', 'false'); // Return JSON response

    console.log(`📧 Sending contact form submission for: ${name} (${email})`);

    // Send request to Web3Forms API
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Web3Forms API error:', data);
      return res.status(response.status).json({
        success: false,
        error: data.message || 'Failed to send email'
      });
    }

    if (data.success) {
      console.log('✅ Contact form email sent successfully');
      return res.status(200).json({
        success: true,
        message: 'Message sent successfully!'
      });
    } else {
      console.error('Web3Forms returned failure:', data);
      return res.status(400).json({
        success: false,
        error: data.message || 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('Contact form API error:', error);

    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        error: 'Unable to connect to email service. Please try again later.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.'
    });
  }
}
