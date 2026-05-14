const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://zfssclgbaygmjdcebfwg.supabase.co',
  'sb_publishable_DgU2E2sxmQflV3bsnr6psA_O04idRYK'
)

exports.handler = async (event) => {

  const tracking = event.queryStringParameters.tracking

  const { data, error } = await supabase
    .from('shipments')
    .select('*')
    .eq('tracking_number', tracking)
    .single()

  if(error){

    return {
      statusCode:404,
      body:JSON.stringify({
        error:'Tracking number not found'
      })
    }

  }

  return {
    statusCode:200,
    body:JSON.stringify(data)
  }

}
