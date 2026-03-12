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
    console.log('Fetching members with expanded contact details...');

    // Try to get members with expanded contactDetails in one request
    const urls = [
      API_BASE_URL + '?limit=100&expand=contactDetails',
      API_BASE_URL + '?limit=100&include=contactDetails',
      API_BASE_URL + '?limit=100&with=contactDetails'
    ];

    for (const url of urls) {
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
      const members = Array.isArray(data) ? data : (data.results || data.data || []);
      
      console.log('Got', members.length, 'members');
      
      // Check if contactDetails is expanded (object) or still a URL (string)
      if (members.length > 0) {
        const firstContact = members[0].contactDetails;
        console.log('contactDetails type:', typeof firstContact);
        
        if (typeof firstContact === 'object' && firstContact !== null) {
          console.log('SUCCESS! contactDetails are expanded');
          console.log('Contact structure:', JSON.stringify(firstContact, null, 2));
          
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
    }

    // Expansion didn't work, fetch contact details individually (slower but works)
    console.log('Expansion not supported, fetching contact details individually...');
    
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
    let members = Array.isArray(data) ? data : (data.results || data.data || []);
    
    console.log('Fetching contact details for first 20 members only (to avoid timeout)...');
    
    // Fetch contact details for first 20 members only
    const membersWithDetails = await Promise.all(
      members.slice(0, 20).map(async (member) => {
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
          console.error('Error fetching contact for member', member.id, ':', error.message);
        }
        return member;
      })
    );

    console.log('SUCCESS! Fetched details for', membersWithDetails.length, 'members');
    
    // Log first member's contact details for debugging
    if (membersWithDetails[0] && membersWithDetails[0].contactDetailsData) {
      console.log('First member contactDetailsData:', JSON.stringify(membersWithDetails[0].contactDetailsData, null, 2));
    } else {
      console.log('WARNING: contactDetailsData is missing or empty');
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(membersWithDetails)
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
