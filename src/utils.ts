export async function handleResponse(response: Response) {
  const contentType = response.headers.get('content-type');

  const jsonResponse =
    contentType && contentType.indexOf('application/json') !== -1;

  // handle JSON
  if (jsonResponse) {
    try {
      const text = await response.text(); // Parse it as text
      const data = JSON.parse(text); // Try to parse it as json

      return data;
    } catch (err) {
      // This probably means your response is text, do you text handling here
      throw new Error('JSON parsing error');
    }
  }

  // TODO: Handle all Body Interface Methods
  // https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods

  return response.text();
}

export const checkNetworkStatus = (response: Response) => {
  const { ok, statusText } = response;

  if (!ok) {
    throw new Error(`Network error: ${statusText}`);
  }

  return response;
};

export const returnResponse = (response: Response) => ({
  response,
  error: undefined,
});

export const returnError = (error: string) => ({
  response: undefined,
  error,
});
