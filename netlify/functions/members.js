exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const API_TOKEN = '67ee65a0c5ae7ccfa2c9fb147cbc373a15b23614';
  const API_BASE_URL = 'https://easyverein.com/api/v2.0/member';

  try {
    console.log('Fetching members with limit=100...');

    const response = await fetch(API_BASE_URL + '?limit=100', {
      headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('API returned status ' + response.status);
    }

    const data = await response.json();
    const members = Array.isArray(data) ? data : (data.results || data.data || []);
    
    console.log('Total members:', members.length);
    
    // Log the structure of the first member to see what fields are available
    if (members.length > 0) {
      console.log('First member structure:', JSON.stringify(members[0], null, 2));
      console.log('Available keys:', Object.keys(members[0]));
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(members)
    };

  } catch (error) {
    console.error('Error:', error.message);
    
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
