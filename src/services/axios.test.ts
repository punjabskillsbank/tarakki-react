import API from './axios';

describe('API authentication', () => {
  const originalAdapter = API.defaults.adapter;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    API.defaults.adapter = originalAdapter;
  });

  it('sends the stored JWT as a Bearer token to configured API origins', async () => {
    localStorage.setItem('token', 'signup-jwt-token');
    let authorizationHeader: string | undefined;

    API.defaults.adapter = async (request) => {
      const header = request.headers.get('Authorization');
      authorizationHeader = typeof header === 'string' ? header : undefined;
      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: request,
      };
    };

    await API.get('/members');

    expect(authorizationHeader).toBe('Bearer signup-jwt-token');
  });

  it('does not send the JWT to unconfigured origins', async () => {
    localStorage.setItem('token', 'signup-jwt-token');
    let authorizationHeader: string | undefined;

    API.defaults.adapter = async (request) => {
      const header = request.headers.get('Authorization');
      authorizationHeader = typeof header === 'string' ? header : undefined;
      return {
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: request,
      };
    };

    await API.get('https://example.com/resource');

    expect(authorizationHeader).toBeUndefined();
  });
});
