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
    console.log('Fetching members...');

    // Use the format that works: ?limit=100
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
    console.log('Response type:', typeof data);
    console.log('Is array?', Array.isArray(data));
    
    if (data && typeof data === 'object') {
      console.log('Response keys:', Object.keys(data));
      console.log('Has results?', !!data.results);
      console.log('Has data?', !!data.data);
    }
    
    const members = Array.isArray(data) ? data : (data.results || data.data || []);
    console.log('Got', members.length, 'member records');
    
    if (members.length === 0) {
      console.log('ERROR: No members found');
      console.log('Raw response preview:', JSON.stringify(data).substring(0, 200));
      throw new Error('No members in response');
    }

    // Fetch contact details for ALL members in smaller batches
    const batchSize = 30; // Smaller batches to avoid timeout
    const allMembersWithDetails = [];
    
    for (let i = 0; i < members.length; i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      console.log('Batch', Math.floor(i / batchSize) + 1, ': fetching', batch.length, 'contacts');
      
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
            // Silent fail for individual contacts
          }
          return member;
        })
      );
      
      allMembersWithDetails.push(...batchWithDetails);
    }

    console.log('SUCCESS! Total members with details:', allMembersWithDetails.length);

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
