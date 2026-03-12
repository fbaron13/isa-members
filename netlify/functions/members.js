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
    let allMembers = [];
    let page = 1;
    let hasMorePages = true;

    console.log('Starting to fetch all members with pagination...');

    // Fetch all pages
    while (hasMorePages) {
      const url = API_BASE_URL + '?page=' + page;
      console.log('Fetching page', page);

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + API_TOKEN,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('API returned status ' + response.status);
      }

      const data = await response.json();
      
      // Handle different response formats
      let pageMembers = [];
      if (Array.isArray(data)) {
        pageMembers = data;
      } else if (data.results && Array.isArray(data.results)) {
        pageMembers = data.results;
      } else if (data.data && Array.isArray(data.data)) {
        pageMembers = data.data;
      }

      console.log('Page', page, 'returned', pageMembers.length, 'members');

      if (pageMembers.length === 0) {
        console.log('No more members found, stopping pagination');
        hasMorePages = false;
      } else {
        allMembers = allMembers.concat(pageMembers);
        page++;
        
        // Safety limit to prevent infinite loops
        if (page > 100) {
          console.log('Reached page limit (100), stopping');
          hasMorePages = false;
        }
      }
    }

    console.log('SUCCESS! Total members fetched:', allMembers.length);

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
    console.error('Error fetching members:', error.message);
    
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
