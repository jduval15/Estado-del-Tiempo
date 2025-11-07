const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    console.error('VITE_OPENWEATHERMAP_API_KEY is not defined in environment variables');
    return '';
  }

  return apiKey;
}

export default getApiKey