const { createClient } = require('@supabase/supabase-js'); 
// Import Supabase client library

// Create Supabase connection using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY 
  // ⚠️ service role key gives full backend access (safe in Netlify only)
);

exports.handler = async (event) => {
  // Netlify serverless function entry point

  try {
    // ================= FETCH ALL SHIPMENTS =================
    const { data, error } = await supabase
      .from('shipments') // select table
      .select('*') // get all columns
      .order('id', { ascending: false }); 
      // newest shipments first

    // ================= HANDLE DATABASE ERROR =================
    if (error) {
      return {
        statusCode: 500, // server error
        body: JSON.stringify({
          success: false, // request failed
          message: 'Database error', // generic message
          error: error.message // actual Supabase error
        })
      };
    }

    // ================= NO DATA FOUND =================
    if (!data || data.length === 0) {
      return {
        statusCode: 200, // still successful request
        body: JSON.stringify({
          success: true,
          message: 'No shipments found',
          data: [] // empty array
        })
      };
    }

    // ================= SUCCESS RESPONSE =================
    return {
      statusCode: 200, // OK response
      body: JSON.stringify({
        success: true, // request successful
        count: data.length, // total shipments
        data: data // shipment records
      })
    };

  } catch (err) {
    // ================= CATCH UNEXPECTED ERRORS =================
    return {
      statusCode: 500, // server crash error
      body: JSON.stringify({
        success: false,
        message: 'Server error', // fallback message
        error: err.message // debug info
      })
    };
  }
};
