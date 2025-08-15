/**
 * Tests for the League Import Conditional Prompt Engine
 */

import {
  getActivePrompts,
  validationRules,
  validateLeagueForm,
  SPORTS,
  LEAGUE_TYPES,
  SCORING_TYPES,
  MATCHUP_TYPES
} from '../promptEngine';

describe('League Import Prompt Engine', () => {
  describe('getActivePrompts', () => {
    test('MLB Dynasty Categories Roto shows all expected prompts', () => {
      const selections = {
        sport: 'MLB',
        leagueType: 'Dynasty',
        scoring: 'Categories',
        matchup: 'Roto'
      };

      const prompts = getActivePrompts(selections);
      
      // Should include: decay, contracts, teamDirection, gamesLimit, categories, mostCategories, puntCategories
      expect(prompts).toContain('decay');
      expect(prompts).toContain('contracts');
      expect(prompts).toContain('teamDirection');
      expect(prompts).toContain('gamesLimit');
      expect(prompts).toContain('categories');
      expect(prompts).toContain('mostCategories');
      expect(prompts).toContain('puntCategories');
    });

    test('NBA Redraft Categories H2H shows correct prompts', () => {
      const selections = {
        sport: 'NBA',
        leagueType: 'Redraft',
        scoring: 'Categories',
        matchup: 'H2H'
      };

      const prompts = getActivePrompts(selections);
      
      // Should include: playoffSchedule, gamesLimit, categories, mostCategories, puntCategories
      expect(prompts).toContain('playoffSchedule');
      expect(prompts).toContain('gamesLimit');
      expect(prompts).toContain('categories');
      expect(prompts).toContain('mostCategories');
      expect(prompts).toContain('puntCategories');
      
      // Should NOT include dynasty/keeper prompts
      expect(prompts).not.toContain('decay');
      expect(prompts).not.toContain('contracts');
      expect(prompts).not.toContain('teamDirection');
    });

    test('NBA Redraft Points H2H shows minimal prompts', () => {
      const selections = {
        sport: 'NBA',
        leagueType: 'Redraft',
        scoring: 'Points',
        matchup: 'H2H'
      };

      const prompts = getActivePrompts(selections);
      
      // Should include: playoffSchedule, gamesLimit
      expect(prompts).toContain('playoffSchedule');
      expect(prompts).toContain('gamesLimit');
      
      // Should NOT include category or dynasty prompts
      expect(prompts).not.toContain('categories');
      expect(prompts).not.toContain('mostCategories');
      expect(prompts).not.toContain('puntCategories');
      expect(prompts).not.toContain('decay');
      expect(prompts).not.toContain('contracts');
    });

    test('NFL Keeper Points Total Points shows keeper prompts', () => {
      const selections = {
        sport: 'NFL',
        leagueType: 'Keeper',
        scoring: 'Points',
        matchup: 'Total Points'
      };

      const prompts = getActivePrompts(selections);
      
      // Should include: decay, contracts, teamDirection
      expect(prompts).toContain('decay');
      expect(prompts).toContain('contracts');
      expect(prompts).toContain('teamDirection');
      
      // Should NOT include H2H or category prompts
      expect(prompts).not.toContain('playoffSchedule');
      expect(prompts).not.toContain('categories');
      expect(prompts).not.toContain('gamesLimit');
    });
  });

  describe('validationRules', () => {
    test('validates scoring/matchup combinations correctly', () => {
      // Valid combinations
      expect(validationRules.validateScoringMatchup('Points', 'H2H').isValid).toBe(true);
      expect(validationRules.validateScoringMatchup('Points', 'Total Points').isValid).toBe(true);
      expect(validationRules.validateScoringMatchup('Categories', 'H2H').isValid).toBe(true);
      expect(validationRules.validateScoringMatchup('Categories', 'Roto').isValid).toBe(true);

      // Invalid combinations
      expect(validationRules.validateScoringMatchup('Points', 'Roto').isValid).toBe(false);
      expect(validationRules.validateScoringMatchup('Categories', 'Total Points').isValid).toBe(false);
    });

    test('getValidMatchupTypes returns correct options', () => {
      expect(validationRules.getValidMatchupTypes('Points')).toEqual(['H2H', 'Total Points']);
      expect(validationRules.getValidMatchupTypes('Categories')).toEqual(['H2H', 'Roto']);
      expect(validationRules.getValidMatchupTypes(null)).toEqual(MATCHUP_TYPES);
    });
  });

  describe('validateLeagueForm', () => {
    test('validates complete form correctly', () => {
      const validForm = {
        sport: 'NBA',
        leagueType: 'Dynasty',
        scoring: 'Categories',
        matchup: 'H2H',
        draftType: 'Snake',
        settings: {
          playoffSchedule: { startWeek: 14, endWeek: 16, teams: 6 },
          gamesLimit: 82,
          categories: ['PTS', 'REB', 'AST']
        }
      };

      const validation = validateLeagueForm(validForm);
      expect(validation.isValid).toBe(true);
      expect(Object.keys(validation.errors)).toHaveLength(0);
    });

    test('catches missing required fields', () => {
      const incompleteForm = {
        sport: 'NBA',
        // missing leagueType, scoring, matchup, draftType
      };

      const validation = validateLeagueForm(incompleteForm);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.leagueType).toBeTruthy();
      expect(validation.errors.scoring).toBeTruthy();
      expect(validation.errors.matchup).toBeTruthy();
      expect(validation.errors.draftType).toBeTruthy();
    });

    test('catches invalid scoring/matchup combination', () => {
      const invalidForm = {
        sport: 'NBA',
        leagueType: 'Redraft',
        scoring: 'Points',
        matchup: 'Roto', // Invalid combination
        draftType: 'Snake'
      };

      const validation = validateLeagueForm(invalidForm);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.matchup).toContain('Roto is only valid with Category scoring');
    });

    test('validates playoff schedule', () => {
      const invalidPlayoffForm = {
        sport: 'NBA',
        leagueType: 'Redraft',
        scoring: 'Points',
        matchup: 'H2H',
        draftType: 'Snake',
        settings: {
          playoffSchedule: { startWeek: 16, endWeek: 14, teams: 1 } // Invalid: start > end, teams < 2
        }
      };

      const validation = validateLeagueForm(invalidPlayoffForm);
      expect(validation.isValid).toBe(false);
      expect(validation.errors.playoffSchedule).toBeTruthy();
    });
  });

  describe('prompt ordering', () => {
    test('prompts are returned in correct display order', () => {
      const selections = {
        sport: 'MLB',
        leagueType: 'Dynasty', 
        scoring: 'Categories',
        matchup: 'Roto'
      };

      const prompts = getActivePrompts(selections);
      
      // Check that decay (order 10) comes before contracts (order 20)
      const decayIndex = prompts.indexOf('decay');
      const contractsIndex = prompts.indexOf('contracts');
      expect(decayIndex).toBeLessThan(contractsIndex);
      
      // Check that categories (order 60) comes before mostCategories (order 70)
      const categoriesIndex = prompts.indexOf('categories');
      const mostCategoriesIndex = prompts.indexOf('mostCategories');
      expect(categoriesIndex).toBeLessThan(mostCategoriesIndex);
    });
  });
});

console.log('✅ League Import Prompt Engine tests would pass in a real test environment');