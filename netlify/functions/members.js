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
    console.log('Attempting to fetch all members in one request...');

    // Try to get all members with a very large limit
    const attempts = [
      API_BASE_URL + '?limit=1000',
      API_BASE_URL + '?per_page=1000', 
      API_BASE_URL + '?pageSize=1000',
      API_BASE_URL + '?limit=500',
      API_BASE_URL + '?per_page=500'
    ];

    for (const url of attempts) {
      console.log('Trying:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + API_TOKEN,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('Failed with status:', response.status);
        continue;
      }

      const data = await response.json();
      const members = Array.isArray(data) ? data : 
                     (data.results || data.data || []);
      
      console.log('Got', members.length, 'members');

      if (members.length > 5) {
        // Success! We got more than the default 5
        console.log('SUCCESS! Using this URL format');
        
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
      }
    }

    // If we get here, fall back to pagination with just 3 pages (fast enough)
    console.log('Falling back to quick pagination (3 pages max)...');
    
    let allMembers = [];
    for (let page = 1; page <= 3; page++) {
      const response = await fetch(API_BASE_URL + '?page=' + page, {
        headers: {
          'Authorization': 'Bearer ' + API_TOKEN,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const pageMembers = Array.isArray(data) ? data : (data.results || data.data || []);
        allMembers = allMembers.concat(pageMembers);
      }
    }

    console.log('Partial success:', allMembers.length, 'members (first 3 pages only)');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(allMembers)
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
