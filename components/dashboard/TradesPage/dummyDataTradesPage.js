export const userPlayers = {
    nba: [
        { id: 'u_nba_1', name: 'LeBron James', value: 910, status: 'protected', position: 'SF' },
        { id: 'u_nba_2', name: 'Kevin Durant', value: 880, status: 'target', position: 'PF' },
        { id: 'u_nba_3', name: 'Stephen Curry', value: 925, status: null, position: 'PG' },
        { id: 'u_nba_4', name: 'Giannis Antetokounmpo', value: 960, status: 'protected', position: 'PF' },
        { id: 'u_nba_5', name: 'Nikola Jokic', value: 990, status: null, position: 'C' },
        { id: 'u_nba_6', name: 'Luka Doncic', value: 975, status: null, position: 'PG' },
        { id: 'u_nba_7', name: 'Joel Embiid', value: 950, status: 'target', position: 'C' },
    ],
    nfl: [
        { id: 'u_nfl_1', name: 'Patrick Mahomes', value: 985, status: 'protected', position: 'QB' },
        { id: 'u_nfl_2', name: 'Travis Kelce', value: 890, status: 'target', position: 'TE' },
        { id: 'u_nfl_3', name: 'Justin Jefferson', value: 970, status: null, position: 'WR' },
        { id: 'u_nfl_4', name: 'Christian McCaffrey', value: 975, status: 'protected', position: 'RB' },
        { id: 'u_nfl_5', name: 'Tyreek Hill', value: 950, status: null, position: 'WR' },
        { id: 'u_nfl_6', name: 'Joe Burrow', value: 940, status: null, position: 'QB' },
        { id: 'u_nfl_7', name: 'Ja\'Marr Chase', value: 960, status: 'target', position: 'WR' },
    ],
    mlb: [
        { id: 'u_mlb_1', name: 'Shohei Ohtani', value: 999, status: 'protected', position: 'P/DH' },
        { id: 'u_mlb_2', name: 'Mike Trout', value: 920, status: 'target', position: 'OF' },
        { id: 'u_mlb_3', name: 'Aaron Judge', value: 940, status: null, position: 'OF' },
        { id: 'u_mlb_4', name: 'Mookie Betts', value: 950, status: 'protected', position: 'OF/INF' },
        { id: 'u_mlb_5', name: 'Ronald Acuña Jr.', value: 980, status: null, position: 'OF' },
        { id: 'u_mlb_6', name: 'Fernando Tatis Jr.', value: 930, status: null, position: 'MI' },
        { id: 'u_mlb_7', name: 'Corbin Carroll', value: 900, status: 'target', position: 'OF' },
    ]
};

export const opponentPlayers = {
    nba: [
        { id: 'o_nba_1', name: 'Jayson Tatum', value: 940, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'SF' },
        { id: 'o_nba_2', name: 'Devin Booker', value: 915, isFavorite: true, isTarget: false, isOnTradeBlock: true, position: 'SG' },
        { id: 'o_nba_3', name: 'Zion Williamson', value: 850, isFavorite: false, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'PF' },
        { id: 'o_nba_4', name: 'Ja Morant', value: 890, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'PG' },
        { id: 'o_nba_5', name: 'Anthony Edwards', value: 930, isFavorite: true, isTarget: true, isOnTradeBlock: false, position: 'SG' },
        { id: 'o_nba_6', name: 'Trae Young', value: 870, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'PG' },
        { id: 'o_nba_7', name: 'Shai Gilgeous-Alexander', value: 965, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'SG' },
    ],
    nfl: [
        { id: 'o_nfl_1', name: 'Josh Allen', value: 980, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'QB' },
        { id: 'o_nfl_2', name: 'Justin Herbert', value: 930, isFavorite: true, isTarget: false, isOnTradeBlock: true, position: 'QB' },
        { id: 'o_nfl_3', name: 'A.J. Brown', value: 940, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'WR' },
        { id: 'o_nfl_4', name: 'CeeDee Lamb', value: 955, isFavorite: false, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'WR' },
        { id: 'o_nfl_5', name: 'Bijan Robinson', value: 900, isFavorite: true, isTarget: false, isOnTradeBlock: false, position: 'RB' },
        { id: 'o_nfl_6', name: 'Garrett Wilson', value: 880, isFavorite: false, isTarget: true, isOnTradeBlock: false, position: 'WR' },
        { id: 'o_nfl_7', name: 'Amon-Ra St. Brown', value: 910, isFavorite: true, isTarget: true, isOnTradeBlock: true, position: 'WR' },
    ],
    mlb: [
        { id: 'o_mlb_1', name: 'Juan Soto', value: 960, isFavorite: true, isTarget: false, isOnTradeBlock: false, position: 'OF' },
        { id: 'o_mlb_2', name: 'Julio Rodríguez', value: 970, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'OF' },
        { id: 'o_mlb_3', name: 'Vladimir Guerrero Jr.', value: 890, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'CI' },
        { id: 'o_mlb_4', name: 'Bo Bichette', value: 875, isFavorite: false, isTarget: false, isOnTradeBlock: true, position: 'MI' },
        { id: 'o_mlb_5', name: 'Yordan Alvarez', value: 955, isFavorite: true, isTarget: true, isOnTradeBlock: false, position: 'OF' },
        { id: 'o_mlb_6', name: 'Bobby Witt Jr.', value: 945, isFavorite: false, isTarget: true, isOnTradeBlock: true, position: 'MI' },
        { id: 'o_mlb_7', name: 'Adley Rutschman', value: 880, isFavorite: true, isTarget: false, isOnTradeBlock: false, isNotInterested: true, position: 'C' },
    ]
};

export const mockTrades = {
    nba: {
      user: [
        userPlayers.nba[4], // Nikola Jokic (990)
        userPlayers.nba[2], // Stephen Curry (925)
      ],
      opponent: [
        opponentPlayers.nba[6], // Shai Gilgeous-Alexander (965)
        opponentPlayers.nba[0], // Jayson Tatum (940)
        opponentPlayers.nba[4], // Anthony Edwards (930)
      ],
      valueAdjustment: 200,
      winProbability: 0.72,
      rationale: "User trades two top-tier superstars to acquire a trio of elite young talent, winning the overall value proposition."
    },
    nfl: {
      user: [
        { id: 'u_nfl_2', name: 'Travis Kelce', value: 890, status: 'target', position: 'TE' },
        { id: 'u_nfl_5', name: 'Tyreek Hill', value: 950, status: null, position: 'WR' },
        { id: 'u_nfl_6', name: 'Joe Burrow', value: 940, status: null, position: 'QB' },
      ],
      opponent: [
        { id: 'u_nfl_4', name: 'Christian McCaffrey', value: 975, status: 'protected', position: 'RB' },
        { id: 'o_nfl_1', name: 'Josh Allen', value: 980, isFavorite: false, isTarget: false, isOnTradeBlock: false, position: 'QB' },
      ],
      valueAdjustment: 150,
      winProbability: 0.38,
      rationale: "User packages three great players to get two of the league's absolute elite at their positions, but narrowly loses the value calculation."
    },
    mlb: {
      user: [
        userPlayers.mlb[0], // Shohei Ohtani (999)
        userPlayers.mlb[2], // Aaron Judge (940)
      ],
      opponent: [
        opponentPlayers.mlb[1], // Julio Rodríguez (970)
        opponentPlayers.mlb[4], // Yordan Alvarez (955)
        opponentPlayers.mlb[5], // Bobby Witt Jr. (945)
      ],
      valueAdjustment: 300,
      winProbability: 0.88,
      rationale: "A blockbuster deal where the user sends two top sluggers for an incredible package of three young, elite hitters."
    }
  };