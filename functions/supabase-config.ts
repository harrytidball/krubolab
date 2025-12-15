export const onRequestGet = async (context: {
  request: Request;
  env: { 
    SUPABASE_URL: string;
    DB_PASSWORD: string;
  };
}) => {
  const { env } = context;

  try {
    const supabaseUrl = env.SUPABASE_URL as string;
    const supabaseAnonKey = env.DB_PASSWORD as string;

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        url: supabaseUrl,
        anonKey: supabaseAnonKey,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve configuration' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

