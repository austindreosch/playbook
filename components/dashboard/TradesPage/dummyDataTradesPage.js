export const userPlayers = {
    nba: [
        { id: 'u_nba_1', name: 'LeBron James', value: 782, status: 'protected', position: 'SF' },
        { id: 'u_nba_2', name: 'Kevin Durant', value: 751, status: 'target', position: 'PF' },
        { id: 'u_nba_3', name: 'Stephen Curry', value: 745, status: null, position: 'PG' },
        { id: 'u_nba_4', name: 'Giannis Antetokounmpo', value: 810, status: 'protected', position: 'PF' },
        { id: 'u_nba_5', name: 'Nikola Jokic', value: 825, status: null, position: 'C' },
        { id: 'u_nba_6', name: 'Luka Doncic', value: 800, status: null, position: 'PG' },
        { id: 'u_nba_7', name: 'Joel Embiid', value: 790, status: 'target', position: 'C' },
    ],
    nfl: [
        { id: 'u_nfl_1', name: 'Patrick Mahomes', value: 910, status: 'protected', position: 'QB' },
        { id: 'u_nfl_2', name: 'Travis Kelce', value: 850, status: 'target', position: 'TE' },
        { id: 'u_nfl_3', name: 'Justin Jefferson', value: 890, status: null, position: 'WR' },
        { id: 'u_nfl_4', name: 'Christian McCaffrey', value: 920, status: 'protected', position: 'RB' },
        { id: 'u_nfl_5', name: 'Tyreek Hill', value: 880, status: null, position: 'WR' },
        { id: 'u_nfl_6', name: 'Joe Burrow', value: 895, status: null, position: 'QB' },
        { id: 'u_nfl_7', name: 'Ja\'Marr Chase', value: 870, status: 'target', position: 'WR' },
    ],
    mlb: [
        { id: 'u_mlb_1', name: 'Shohei Ohtani', value: 950, status: 'protected', position: 'P' },
        { id: 'u_mlb_2', name: 'Mike Trout', value: 920, status: 'target', position: 'OF' },
        { id: 'u_mlb_3', name: 'Aaron Judge', value: 910, status: null, position: 'OF' },
        { id: 'u_mlb_4', name: 'Mookie Betts', value: 890, status: 'protected', position: 'OF' },
        { id: 'u_mlb_5', name: 'Ronald Acu\u00f1a Jr.', value: 930, status: null, position: 'OF' },
        { id: 'u_mlb_6', name: 'Fernando Tatis Jr.', value: 900, status: null, position: 'MI' },
        { id: 'u_mlb_7', name: 'Corbin Carroll', value: 880, status: 'target', position: 'OF' },
    ]
};

export const opponentPlayers = {
    nba: [
        { id: 'o_nba_1', name: 'Jayson Tatum', value: 780, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'SF' },
        { id: 'o_nba_2', name: 'Devin Booker', value: 760, isFavorite: true, isTarget: false, isOnTradeBlock: true, position: 'SG' },
        { id: 'o_nba_3', name: 'Zion Williamson', value: 730, isFavorite: false, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'PF' },
        { id: 'o_nba_4', name: 'Ja Morant', value: 770, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'PG' },
        { id: 'o_nba_5', name: 'Anthony Edwards', value: 790, isFavorite: true, isTarget: true, isOnTradeBlock: false, position: 'SG' },
        { id: 'o_nba_6', name: 'Trae Young', value: 740, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'PG' },
        { id: 'o_nba_7', name: 'Shai Gilgeous-Alexander', value: 815, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'SG' },
    ],
    nfl: [
        { id: 'o_nfl_1', name: 'Josh Allen', value: 915, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'QB' },
        { id: 'o_nfl_2', name: 'Justin Herbert', value: 905, isFavorite: true, isTarget: false, isOnTradeBlock: true, position: 'QB' },
        { id: 'o_nfl_3', name: 'A.J. Brown', value: 875, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'WR' },
        { id: 'o_nfl_4', name: 'CeeDee Lamb', value: 865, isFavorite: false, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'WR' },
        { id: 'o_nfl_5', name: 'Bijan Robinson', value: 885, isFavorite: true, isTarget: false, isOnTradeBlock: false, position: 'RB' },
        { id: 'o_nfl_6', name: 'Garrett Wilson', value: 860, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'WR' },
        { id: 'o_nfl_7', name: 'Amon-Ra St. Brown', value: 855, isFavorite: true, isTarget: true, isOnTradeBlock: true, position: 'WR' },
    ],
    mlb: [
        { id: 'o_mlb_1', name: 'Juan Soto', value: 940, isFavorite: true, isTarget: false, isOnTradeBlock: false, position: 'OF' },
        { id: 'o_mlb_2', name: 'Julio Rodr\u00edguez', value: 925, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'OF' },
        { id: 'o_mlb_3', name: 'Vladimir Guerrero Jr.', value: 900, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'CI' },
        { id: 'o_mlb_4', name: 'Bo Bichette', value: 885, isFavorite: false, isTarget: false, isOnTradeBlock: true, position: 'MI' },
        { id: 'o_mlb_5', name: 'Yordan Alvarez', value: 915, isFavorite: true, isTarget: true, isOnTradeBlock: false, position: 'OF' },
        { id: 'o_mlb_6', name: 'Bobby Witt Jr.', value: 895, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'MI' },
        { id: 'o_mlb_7', name: 'Adley Rutschman', value: 870, isFavorite: true, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'C' },
    ]
};

export const mockTrades = {
    nba: {
      user: [
        { id: 'u_nba_1', name: 'LeBron James', value: 550, status: 'protected', position: 'SF' },
        { id: 'u_nba_3', name: 'Stephen Curry', value: 480, status: null, position: 'PG' },
      ],
      opponent: [
        { id: 'o_nba_1', name: 'Jayson Tatum', value: 880, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'SF' },
        { id: 'o_nba_2', name: 'Devin Booker', value: 810, isFavorite: true, isTarget: false, isOnTradeBlock: true, position: 'SG' },
      ],
      valueAdjustment: 0,
      winProbability: 0.68,
      rationale: "User trades aging superstars for a package of younger, high-upside talent, winning the value battle."
    },
    nfl: {
      user: [
        { id: 'u_nfl_4', name: 'Christian McCaffrey', value: 920, status: 'protected', position: 'RB' },
      ],
      opponent: [
        { id: 'o_nfl_5', name: 'Bijan Robinson', value: 650, isFavorite: true, isTarget: false, isOnTradeBlock: false, position: 'RB' },
        { id: 'o_nfl_6', name: 'Garrett Wilson', value: 450, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'WR' },
      ],
      valueAdjustment: 180,
      winProbability: 0.52,
      rationale: "User gives up the top RB for two elite, younger players at key positions."
    },
    mlb: {
      user: [
        { id: 'u_mlb_1', name: 'Shohei Ohtani', value: 950, position: 'P' },
        { id: 'u_mlb_2', name: 'Mike Trout', value: 320, position: 'OF' },
      ],
      opponent: [
        { id: 'o_mlb_1', name: 'Juan Soto', value: 940, position: 'OF' },
        { id: 'o_mlb_2', name: 'Julio Rodríguez', value: 925, position: 'OF' },
      ],
      valueAdjustment: 555,
      winProbability: 0.25,
      rationale: "A blockbuster deal where the user trades two sluggers for two of the best young hitters in the game, but loses value."
    }
  };