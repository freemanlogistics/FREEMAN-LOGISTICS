const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

function generateTracking() {
  return "FRM" + Math.floor(100000000 + Math.random() * 900000000)
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body)

    const tracking_number = generateTracking()

    const { data, error } = await supabase
      .from("shipments")
      .insert([{
        tracking_number,
        sender_name: body.sender_name,
        receiver_name: body.receiver_name,
        origin: body.origin,
        destination: body.destination,
        status: body.status,
        current_location: body.current_location,
        estimated_delivery: body.estimated_delivery
      }])
      .select()
      .single()

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify(error)
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    }
  }
}
