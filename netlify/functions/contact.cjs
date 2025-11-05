// Netlify function for secure contact form handling
// This function proxies requests to Web3Forms API with server-side API key protection

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed. Use POST.'
      })
    };
  }

  try {
    // Validate required environment variable
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error('WEB3FORMS_ACCESS_KEY is not set in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Server configuration error'
        })
      };
    }

    // Parse and validate request body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid JSON in request body'
        })
      };
    }

    const { name, email, message, subject, phone } = body;

    // Basic validation
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, email, message'
        })
      };
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Invalid email format'
        })
      };
    }

    // Prepare form data for Web3Forms
    const formData = new URLSearchParams();
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Web3Forms API error:', data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          error: data.message || 'Failed to send email'
        })
      };
    }

    if (data.success) {
      console.log('✅ Contact form email sent successfully');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Message sent successfully!'
        })
      };
    } else {
      console.error('Web3Forms returned failure:', data);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: data.message || 'Failed to send email'
        })
      };
    }

  } catch (error) {
    console.error('Contact form function error:', error);

    // Handle different types of errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Unable to connect to email service. Please try again later.'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.'
      })
    };
  }
};
