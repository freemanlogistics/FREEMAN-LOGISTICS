const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

exports.handler = async (event) => {
  try {
    const tracking = event.queryStringParameters?.tracking

    if (!tracking) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Tracking number is required'
        })
      }
    }

    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', tracking)
      .maybeSingle()

    if (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Database error',
          details: error.message
        })
      }
    }

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Tracking number not found'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Server error',
        details: err.message
      })
    }
  }
}
