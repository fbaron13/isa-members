exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const API_TOKEN = '9087f914ada0489b766a4301cfbe33992452248f';
  const API_URL = 'https://easyverein.com/api/v1.7/member';

  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': 'Token ' + API_TOKEN,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('API returned ' + response.status);
    }

    const data = await response.json();

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
    console.error('Error fetching from easyverein:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch members',
        message: error.message 
      })
    };
  }
};
