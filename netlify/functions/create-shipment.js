const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  // Validation
  if (
    !body.sender_name ||
    !body.receiver_name ||
    !body.email ||
    !body.origin ||
    !body.destination
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' })
    };
  }

  const trackingNumber =
    'FRM' +
    Date.now().toString().slice(-6) +
    Math.floor(Math.random() * 900 + 100);

  try {
    const { data, error } = await supabase
      .from('shipments')
      .insert([
        {
          tracking_number: trackingNumber,
          sender_name: body.sender_name,
          receiver_name: body.receiver_name,
          email: body.email,
          origin: body.origin,
          destination: body.destination,
          shipment_type: body.shipment_type,
          shipment_details: body.shipment_details,
          status: body.status || 'Pending',
          current_location: body.current_location || body.origin,
          estimated_delivery: body.estimated_delivery
        }
      ])
      .select()
      .single();

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        shipment: data
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
