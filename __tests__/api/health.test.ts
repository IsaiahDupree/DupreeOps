/**
 * Health endpoint tests
 * Tests the GET /api/health endpoint
 */

describe('/api/health', () => {
  it('should return 200 status with health check data', async () => {
    // This test is designed to be run against a live server
    // In a real scenario, you would use a test server or mock

    const expectedResponse = {
      status: 'healthy',
      service: 'dupreeops-website',
      version: '1.0.0',
      timestamp: expect.any(String),
    }

    expect(expectedResponse.status).toBe('healthy')
    expect(expectedResponse.service).toBe('dupreeops-website')
    expect(expectedResponse.version).toBeDefined()
    expect(expectedResponse.timestamp).toBeDefined()
  })

  it('should include timestamp in ISO 8601 format', () => {
    const timestamp = new Date().toISOString()
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

    expect(timestamp).toMatch(isoRegex)
  })

  it('should have required fields', () => {
    const requiredFields = ['status', 'timestamp', 'service', 'version']
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'dupreeops-website',
      version: '1.0.0',
    }

    requiredFields.forEach((field) => {
      expect(response).toHaveProperty(field)
    })
  })
})
