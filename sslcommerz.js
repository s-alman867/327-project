export default async (req, res) => {
    // 1. Parse the incoming form data
    const body = await req.text(); // Get raw body
    
    // 2. Forward to SSLCommerz
    const sslResponse = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body // Pass through the original form data
    });
    
    // 3. Send SSLCommerz response back to frontend
    const data = await sslResponse.json();
    res.status(200).json(data);
  };