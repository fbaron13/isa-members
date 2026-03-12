exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const API_TOKEN = '67ee65a0c5ae7ccfa2c9fb147cbc373a15b23614';
  
  // Try both API versions
  const versions = [
    { version: 'v2.0', url: 'https://easyverein.com/api/v2.0/member' },
    { version: 'v1.7', url: 'https://easyverein.com/api/v1.7/member' }
  ];

  let lastError = null;

  for (const api of versions) {
    try {
      console.log('Trying API version:', api.version);
      
      const response = await fetch(api.url, {
        headers: {
          'Authorization': 'Token ' + API_TOKEN,
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (response.status === 401) {
        console.log('401 error with', api.version, '- trying next version');
        lastError = 'Authentication failed with ' + api.version;
        continue;
      }

      if (!response.ok) {
        console.log('API', api.version, 'returned', response.status);
        lastError = 'HTTP ' + response.status + ' from ' + api.version;
        continue;
      }

      const data = await response.json();
      console.log('Success with', api.version, '- members count:', Array.isArray(data) ? data.length : 'unknown');

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
      console.error('Error with', api.version, ':', error.message);
      lastError = error.message;
    }
  }

  // All versions failed
  console.error('All API versions failed. Last error:', lastError);
  
  return {
    statusCode: 500,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ 
      error: 'Failed to fetch members from all API versions',
      message: lastError,
      tried: ['v2.0', 'v1.7']
    })
  };
};
