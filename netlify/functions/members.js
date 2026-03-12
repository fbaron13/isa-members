exports.handler = async function(event, context) {
  // Handle OPTIONS for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const API_TOKEN = '67ee65a0c5ae7ccfa2c9fb147cbc373a15b23614';
  const API_BASE_URL = 'https://easyverein.com/api/v2.0/member';

  try {
    console.log('=== Starting member fetch ===');
    console.log('Fetching from:', API_BASE_URL + '?limit=100');

    const response = await fetch(API_BASE_URL + '?limit=100', {
      headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
        'Accept': 'application/json'
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers]));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText.substring(0, 500));
      throw new Error('API returned ' + response.status + ': ' + errorText.substring(0, 100));
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Expected JSON but got:', text.substring(0, 200));
      throw new Error('API returned non-JSON response');
    }

    const data = await response.json();
    console.log('Parsed JSON successfully');
    console.log('Type of response:', typeof data);
    console.log('Is array?', Array.isArray(data));
    
    if (typeof data === 'object' && !Array.isArray(data)) {
      console.log('Response is object with keys:', Object.keys(data));
      console.log('Keys detail:', JSON.stringify(Object.keys(data)));
    }
    
    // Try different possible structures
    const members = Array.isArray(data) ? data : 
                   (data.results || data.data || data.members || data.items || []);
    
    console.log('Extracted member count:', members.length);

    if (!Array.isArray(members) || members.length === 0) {
      console.error('Could not extract members array');
      console.error('Data structure:', JSON.stringify(data).substring(0, 500));
      throw new Error('No members in response');
    }

    // Fetch contact details in batches
    console.log('Fetching contact details...');
    const batchSize = 30;
    const allMembersWithDetails = [];
    
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      console.log('Batch', Math.floor(i / batchSize) + 1, '/', Math.ceil(members.length / batchSize));
      
      const batchWithDetails = await Promise.all(
        batch.map(async (member) => {
          try {
            if (typeof member.contactDetails === 'string') {
              const contactResponse = await fetch(member.contactDetails, {
                headers: {
                  'Authorization': 'Bearer ' + API_TOKEN,
                  'Accept': 'application/json'
                }
              });
              
              if (contactResponse.ok) {
                member.contactDetailsData = await contactResponse.json();
              }
            }
          } catch (error) {
            console.error('Contact fetch error for member', member.id, ':', error.message);
          }
          return member;
        })
      );
      
      allMembersWithDetails.push(...batchWithDetails);
    }

    console.log('=== Success ===');
    console.log('Total members with details:', allMembersWithDetails.length);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(allMembersWithDetails)
    };

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch members',
        message: error.message,
        type: error.name
      })
    };
  }
};
