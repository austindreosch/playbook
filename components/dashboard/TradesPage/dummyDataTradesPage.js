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
        userPlayers.nba[0], // LeBron James
        userPlayers.nba[2], // Stephen Curry
      ],
      opponent: [
        opponentPlayers.nba[0], // Jayson Tatum
        opponentPlayers.nba[1], // Devin Booker
        opponentPlayers.nba[3], // Ja Morant
      ],
      valueAdjustment: 150,
      rationale: "User trades aging superstars for a package of younger, high-upside talent, winning the value battle."
    },
    nfl: {
      user: [
        userPlayers.nfl[1], // Travis Kelce
        userPlayers.nfl[4], // Tyreek Hill
      ],
      opponent: [
        opponentPlayers.nfl[2], // A.J. Brown
        opponentPlayers.nfl[4], // Bijan Robinson
        opponentPlayers.nfl[6], // Amon-Ra St. Brown
      ],
      valueAdjustment: 180,
      rationale: "User gives up a top TE and WR for three elite, younger players at key positions."
    },
    mlb: {
      user: [
        userPlayers.mlb[1], // Mike Trout
        userPlayers.mlb[2], // Aaron Judge
      ],
      opponent: [
        opponentPlayers.mlb[0], // Juan Soto
        opponentPlayers.mlb[1], // Julio Rodríguez
        opponentPlayers.mlb[4], // Yordan Alvarez
      ],
      valueAdjustment: 200,
      rationale: "A blockbuster deal where the user trades two sluggers for three of the best young hitters in the game."
    }
  };