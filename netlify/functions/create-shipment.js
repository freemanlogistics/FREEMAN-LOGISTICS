const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({
        error: 'Method not allowed'
      })
    };
  }

  try {

    const body = JSON.parse(event.body);

    const trackingNumber =
      'FRM' + Math.floor(100000000 + Math.random() * 900000000);

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
          status: body.status,
          current_location: body.current_location,
          estimated_delivery: body.estimated_delivery
        }
      ])
      .select()
      .single();

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: error.message
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error'
      })
    };

  }

};
