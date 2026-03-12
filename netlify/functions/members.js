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
    console.log('Fetching ALL members...');

    // Step 1: Get all member IDs first (fast)
    const response = await fetch(API_BASE_URL + '?limit=1000', {
      headers: {
        'Authorization': 'Bearer ' + API_TOKEN,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('API returned status ' + response.status);
    }

    const members = await response.json();
    console.log('Got', members.length, 'member records');

    // Step 2: Fetch contact details for ALL members in batches
    // We'll do 50 at a time to stay under timeout
    const batchSize = 50;
    const allMembersWithDetails = [];
    
    for (let i = 0; i < Math.min(members.length, 250); i += batchSize) {
      const batch = members.slice(i, i + batchSize);
      console.log('Fetching contact details batch', Math.floor(i / batchSize) + 1, '(members', i, '-', Math.min(i + batchSize, members.length), ')');
      
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
            console.error('Error fetching contact for member', member.id);
          }
          return member;
        })
      );
      
      allMembersWithDetails.push(...batchWithDetails);
    }

    console.log('SUCCESS! Fetched details for', allMembersWithDetails.length, 'members');

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
