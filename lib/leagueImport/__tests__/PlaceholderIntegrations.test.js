/**
 * Tests for Yahoo and ESPN placeholder integrations
 * Ensures proper "coming soon" error messages are returned
 */

import { YahooIntegration, ESPNIntegration } from '../platformIntegrations.js';

describe('Placeholder Platform Integrations', () => {
  describe('YahooIntegration', () => {
    let yahooIntegration;

    beforeEach(() => {
      yahooIntegration = new YahooIntegration();
    });

    test('should return coming soon message for credential validation', async () => {
      const result = await yahooIntegration.validateCredentials({ accessToken: 'test' });
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Yahoo Fantasy Sports integration is coming soon');
      expect(result.error).toContain('working hard to bring you this feature');
    });

    test('should throw coming soon error for getUserLeagues', async () => {
      await expect(yahooIntegration.getUserLeagues('test-token'))
        .rejects
        .toThrow('Yahoo Fantasy Sports integration is coming soon');
    });

    test('should throw coming soon error for getLeagueDetails', async () => {
      await expect(yahooIntegration.getLeagueDetails('test-league', 'test-token'))
        .rejects
        .toThrow('Yahoo Fantasy Sports integration is coming soon');
    });

    test('should throw coming soon error for refreshAuthentication', async () => {
      await expect(yahooIntegration.refreshAuthentication({ refreshToken: 'test' }))
        .rejects
        .toThrow('Yahoo Fantasy Sports integration is coming soon');
    });

    test('should return default sport for detectSport', () => {
      const sport = yahooIntegration.detectSport({});
      expect(sport).toBe('NFL');
    });
  });

  describe('ESPNIntegration', () => {
    let espnIntegration;

    beforeEach(() => {
      espnIntegration = new ESPNIntegration();
    });

    test('should return coming soon message for credential validation', async () => {
      const result = await espnIntegration.validateCredentials({ cookies: 'test' });
      
      expect(result.valid).toBe(false);
      expect(result.error).toContain('ESPN Fantasy Sports integration is coming soon');
      expect(result.error).toContain('working hard to bring you this feature');
    });

    test('should throw coming soon error for getUserLeagues', async () => {
      await expect(espnIntegration.getUserLeagues('test-cookies'))
        .rejects
        .toThrow('ESPN Fantasy Sports integration is coming soon');
    });

    test('should throw coming soon error for getLeagueDetails', async () => {
      await expect(espnIntegration.getLeagueDetails('test-league'))
        .rejects
        .toThrow('ESPN Fantasy Sports integration is coming soon');
    });

    test('should throw coming soon error for refreshAuthentication', async () => {
      await expect(espnIntegration.refreshAuthentication({ cookies: 'test' }))
        .rejects
        .toThrow('ESPN Fantasy Sports integration is coming soon');
    });

    test('should return default sport for detectSport', () => {
      const sport = espnIntegration.detectSport({});
      expect(sport).toBe('NFL');
    });
  });

  describe('Platform Factory', () => {
    test('should create Yahoo integration instance', () => {
      const { createPlatformIntegration } = require('../platformIntegrations.js');
      const integration = createPlatformIntegration('yahoo');
      expect(integration).toBeInstanceOf(YahooIntegration);
    });

    test('should create ESPN integration instance', () => {
      const { createPlatformIntegration } = require('../platformIntegrations.js');
      const integration = createPlatformIntegration('espn');
      expect(integration).toBeInstanceOf(ESPNIntegration);
    });
  });
});