exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const API_TOKEN = '67ee65a0c5ae7ccfa2c9fb147cbc373a15b23614';
  
  // Try different API versions and authentication formats
  const attempts = [
    // v2.0 attempts
    {
      version: 'v2.0',
      url: 'https://easyverein.com/api/v2.0/member',
      authHeader: 'Token ' + API_TOKEN
    },
    {
      version: 'v2.0',
      url: 'https://easyverein.com/api/v2.0/member',
      authHeader: 'Bearer ' + API_TOKEN
    },
    {
      version: 'v2.0',
      url: 'https://easyverein.com/api/v2.0/member',
      authHeader: API_TOKEN
    },
    // v1.7 attempts
    {
      version: 'v1.7',
      url: 'https://easyverein.com/api/v1.7/member',
      authHeader: 'Token ' + API_TOKEN
    },
    {
      version: 'v1.7',
      url: 'https://easyverein.com/api/v1.7/member',
      authHeader: 'Bearer ' + API_TOKEN
    },
    {
      version: 'v1.7',
      url: 'https://easyverein.com/api/v1.7/member',
      authHeader: API_TOKEN
    }
  ];

  for (const attempt of attempts) {
    try {
      console.log('Trying:', attempt.version, 'with auth format:', 
        attempt.authHeader.startsWith('Token') ? 'Token <key>' : 
        attempt.authHeader.startsWith('Bearer') ? 'Bearer <key>' : 
        '<key>');
      
      const response = await fetch(attempt.url, {
        headers: {
          'Authorization': attempt.authHeader,
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        console.log('401 - trying next format');
        continue;
      }

      if (!response.ok) {
        console.log('Failed with status:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText.substring(0, 200));
        continue;
      }

      const data = await response.json();
      const memberCount = Array.isArray(data) ? data.length : 
                         (data.results ? data.results.length : 'unknown');
      
      console.log('SUCCESS! Version:', attempt.version, 'Members:', memberCount);

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS'
        },
        body: JSON.stringify(data)
      };

    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // All attempts failed
  console.error('All authentication formats failed');
  
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      error: 'Authentication failed with all formats',
      message: 'Please verify the API token is correct and active in easyverein settings',
      tried: ['Token', 'Bearer', 'plain key'],
      versions: ['v2.0', 'v1.7']
    })
  };
};
