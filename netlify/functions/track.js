const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

exports.handler = async (event) => {
  try {
    const tracking = event.queryStringParameters?.tracking?.trim().toUpperCase()

    if (!tracking) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
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
          success: false,
          error: 'Database error',
          details: error.message
        })
      }
    }

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: 'Tracking number not found'
        })
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data
      })
    }

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Server error',
        details: err.message
      })
    }
  }
}
