describe('axiosClient', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('rejects every request without sending it when no API URL is set', async () => {
    vi.stubEnv('REACT_APP_API_URL', '');
    const { axiosClient } = await import('./client.api');

    const request = axiosClient.get('/auth/user');

    await expect(request).rejects.toThrow(
      'No API URL is set; only the frontend is hosted.'
    );
  });
});
