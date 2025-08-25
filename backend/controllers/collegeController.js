import fetch from 'node-fetch';

export const searchColleges = async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ 
        status: 'fail',
        message: 'Please provide a location parameter'
      });
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        status: 'error',
        message: 'Google Places API key not configured'
      });
    }

    const url = 'https://places.googleapis.com/v1/places:searchText';
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.id'
    };
    
    const body = JSON.stringify({
      textQuery: `colleges in ${location}`,
      locationBias: {
        rectangle: {
          low: { latitude: 8.4, longitude: 68.7 },   // Southwest corner of India
          high: { latitude: 37.6, longitude: 97.25 }  // Northeast corner of India
        }
      }
    });

    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers,
      body
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Places API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Google Places API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.places || !Array.isArray(data.places)) {
      console.error('Invalid response format from Google Places API:', data);
      return res.status(500).json({
        status: 'error',
        message: 'Invalid response format from Google Places API',
        data: []
      });
    }

    // Format the response to match the frontend's expected format
    const colleges = data.places.map(place => ({
      name: place.displayName?.text || 'Unknown College',
      address: place.formattedAddress || '',
      location: null, // Not available in the new API response
      rating: place.rating || 0,
      place_id: place.id || ''
    }));

    res.status(200).json({
      status: 'success',
      results: colleges.length,
      data: {
        colleges
      }
    });
    
  } catch (error) {
    console.error('Error searching colleges:', {
      message: error.message,
      stack: error.stack,
      url: url
    });
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch colleges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      details: process.env.NODE_ENV === 'development' ? {
        url: url,
        apiKeyConfigured: !!apiKey,
        apiKeyStartsWith: apiKey ? apiKey.substring(0, 10) + '...' : 'N/A'
      } : undefined
    });
  }
};
