// utilities/masterDatasetSchema.js

const masterDatasetSchema = {
    NBA: {
        players: {
            "39836": {
                info: {
                    id: "39836",
                    firstName: "LeBron",
                    lastName: "James",
                    fullName: "LeBron James",
                    age: 39,
                    height: "6-9",
                    weight: 250,
                    team: "LAL",
                    teamId: "123",
                    img: "url_to_image",
                    position: "SF",
                    injuryStatus: null,
                    experience: 21,
                    // college: "St. Vincent-St. Mary HS (OH)",
                    // birthDate: "1984-12-30", //?
                    // birthPlace: "Akron, OH",
                    // salary: 47600000, //?
                    // contractStatus: "Signed thru 2024-25" //?
                },
                stats: {
                    gamesPlayed: 35,
                    minPerGame: 34.5,

                    ptsPerGame: 25.3,
                    fgmPerGame: 9.5,
                    fgaPerGame: 18.2,
                    fgPct: 52.1,
                    fg2PtPct: 58.2,
                    fg3PtMadePerGame: 2.1,
                    threePtPct: 39.7,
                    ftmPerGame: 4.3,
                    ftaPerGame: 5.8,
                    ftPct: 74.2,
                    rebPerGame: 7.3,
                    defRebPerGame: 6.5,
                    offRebPerGame: 0.8,
                    rebPerMin: 0.21,
                    astPerGame: 7.4,
                    astPerMin: 0.21,
                    astPct: 33.5,
                    astToRatio: 2.39,
                    toPerGame: 3.1,
                    stlPerGame: 1.2,
                    blkPerGame: 0.7,
                    efgPct: 57.3, //? need calculation?
                    tsPct: 60.1, //? need calculation?
                    usgPct: 31.2, //? need

                    // gamesStarted: 35, //?
                    // threePtaPerGame: 5.3, //?
                    // twoPtaPerGame: 12.9, //?
                    // twoPtmPerGame: 7.4, //?
                    // rebPct: 11.2, 

                    // stlPct: 1.8, //?
                    // blkPct: 1.5, //?
                    // foulsPerGame: 1.8, //?

                    // ptsPerMin: 0.73,
                    // Shooting Zones
                    // rimPct: 75.3,
                    // rimFGA: 5.2,
                    // midRangePct: 42.1, //?
                    // midRangeFGA: 3.8,
                    // cornerThreePct: 44.2,
                    // cornerThreeFGA: 1.2,
                    // aboveBreakThreePct: 38.4,
                    // aboveBreakThreeFGA: 4.1
                },
                advanced: {
                    // Everything else
                },
                fantasy: {
                    // calculated values?

                    // // Season Rankings
                    // totalValue: 5,
                    // perGameValue: 8,
                    // totalZScore: 12.3,

                    // // Category Rankings
                    // categoryRanks: {
                    //     points: 12,
                    //     rebounds: 45,
                    //     assists: 23,
                    //     steals: 67,
                    //     blocks: 89,
                    //     threes: 56,
                    //     fgPct: 34,
                    //     ftPct: 78,
                    //     turnovers: 345
                    // },

                    // // Projections
                    // restOfSeason: {
                    //     projected: 4,
                    //     risk: "Low",
                    //     upside: "Medium"
                    // },

                    // // Format Values
                    // formatValues: {
                    //     standard: 5,
                    //     h2h: 8,
                    //     roto: 6,
                    //     points: 4
                    // }
                }
            }
        },
        teams: {
            //
        },
        metadata: {
            lastUpdated: new Date("2024-02-20T12:00:00Z"),
            season: "2024-2025",

        }
    },

    // BASEBALL STUFF NOW
    MLB: {
        players: {
            "12345": {
                info: {
                    id: "12345",
                    firstName: "Shohei",
                    lastName: "Ohtani",
                    fullName: "Shohei Ohtani",
                    team: "LAD",
                    teamId: "456",
                    img: "url_to_image",
                    age: 29,
                    height: "6-4",
                    weight: 210,
                    position: "DH",
                    batsThrows: "L/R",
                    injuryStatus: null,
                    experience: 6,
                    // birthDate: "1994-07-05",
                    // birthPlace: "Oshu, Japan",
                    // salary: 70000000,
                    // contractStatus: "Signed thru 2033"
                },
                battingStats: {
                    // Playing Time
                    gamesPlayed: 135,
                    plateAppearances: 599,
                    atBats: 497,

                    // Basic Stats
                    runs: 102,
                    hits: 151,
                    doubles: 26,
                    triples: 8,
                    homeRuns: 44,
                    rbi: 95,
                    walks: 91,
                    strikeouts: 143,
                    stolenBases: 20,
                    caughtStealing: 4,

                    // Averages
                    avg: .304,
                    obp: .412,
                    slg: .654,
                    ops: 1.066,

                    // Advanced
                    babip: .335,
                    wOBA: .442,
                    wRC: 145,
                    wRCPlus: 184,
                    iso: .350,

                    // Plate Discipline
                    bbPct: 15.2,
                    kPct: 23.9,
                    bbToK: 0.64,
                    contactPct: 76.1,
                    swingPct: 48.2,
                    swingStrikePct: 11.5,

                    // Batted Ball
                    gbPct: 42.3,
                    fbPct: 35.8,
                    ldPct: 21.9,
                    pullPct: 45.2,
                    centerPct: 32.1,
                    oppoPct: 22.7,
                    hrPerFB: 25.6,

                    // Quality of Contact
                    softPct: 12.4,
                    mediumPct: 45.6,
                    hardPct: 42.0,
                    avgExitVelo: 93.2,
                    barrelPct: 15.8,
                    maxExitVelo: 118.3
                },
                pitchingStats: {
                    // Playing Time
                    gamesPlayed: 23,
                    gamesStarted: 23,
                    inningsPitched: 132,
                    battersFeced: 521,
                    pitchesThrown: 2145,

                    // Basic Stats
                    wins: 10,
                    losses: 5,
                    saves: 0,
                    era: 3.14,
                    whip: 1.061,

                    // Counts
                    strikeouts: 167,
                    walks: 44,
                    hits: 96,
                    homeRuns: 15,
                    hitBatsmen: 8,

                    // Rates
                    kPer9: 11.4,
                    bbPer9: 3.0,
                    hrPer9: 1.0,
                    kToBB: 3.80,
                    hitsPer9: 6.5,

                    // Advanced
                    fip: 3.02,
                    xfip: 3.15,
                    siera: 3.22,
                    babip: .289,
                    lobPct: 75.2,

                    // Pitch Data
                    avgFastballVelo: 96.8,
                    maxFastballVelo: 101.4,
                    firstPitchStrikePct: 62.5,
                    swingStrikePct: 15.2,

                    // Batted Ball
                    gbPct: 45.6,
                    fbPct: 35.2,
                    ldPct: 19.2,
                    softPct: 18.5,
                    mediumPct: 48.2,
                    hardPct: 33.3,

                    // Pitch Mix
                    pitchMix: {
                        fastball: 35.2,
                        slider: 28.4,
                        splitter: 20.1,
                        curveball: 16.3
                    }
                },
                advanced: {
                    // // Overall Value
                    // war: 9.0,
                    // warBatting: 5.4,
                    // warPitching: 3.6,

                    // // Win Probability
                    // wpa: 5.2,
                    // clutch: 1.2,

                    // // Base Running
                    // bsr: 4.2,
                    // sprintSpeed: 28.5,

                    // // Fielding
                    // drs: 2,
                    // uzr: 1.5,
                    // outs_above_average: 2
                },
                fantasy: {
                    // calculated values?

                    // // Rankings
                    // overallRank: 1,
                    // battingRank: 3,
                    // pitchingRank: 8,

                    // // Category Ranks
                    // categoryRanks: {
                    //     batting: {
                    //         avg: 12,
                    //         hr: 4,
                    //         rbi: 15,
                    //         runs: 8,
                    //         sb: 25
                    //     },
                    //     pitching: {
                    //         wins: 23,
                    //         era: 12,
                    //         whip: 15,
                    //         strikeouts: 18,
                    //         saves: 150
                    //     }
                    // },

                    // // Projections
                    // restOfSeason: {
                    //     projected: 1,
                    //     risk: "Medium",
                    //     upside: "High"
                    // },

                    // // Format Values
                    // formatValues: {
                    //     roto: 1,
                    //     h2h: 1,
                    //     points: 1,
                    //     categories: 1
                    // }
                }
            }
        },
        teams: {
            //  
        },
        metadata: {
            lastUpdated: new Date("2024-02-20T12:00:00Z"),
            season: "2024",
        }
    },

    NFL: {
        players: {
            "67890": {
                info: {
                    id: "67890",
                    firstName: "Patrick",
                    lastName: "Mahomes",
                    fullName: "Patrick Mahomes",
                    team: "KC",
                    teamId: "789",
                    img: "url_to_image",
                    age: 28,
                    height: "6-2",
                    weight: 225,
                    position: "QB",
                    injuryStatus: null,
                    experience: 7,
                    college: "Texas Tech",
                    birthDate: "1995-09-17",
                    birthPlace: "Tyler, TX",
                    salary: 59400000,
                    contractStatus: "Signed thru 2031"
                },
                stats: {
                    // Playing Time
                    gamesPlayed: 16,
                    gamesStarted: 16,
                    snapsPlayed: 1102,
                    snapPct: 98.5,

                    // Passing
                    passAttempts: 594,
                    passCompletions: 401,
                    passYards: 4183,
                    passTD: 37,
                    passInt: 14,
                    sacks: 28,
                    sackYards: 198,
                    passLong: 75,

                    // Rushing
                    rushAttempts: 61,
                    rushYards: 358,
                    rushTD: 4,
                    rushLong: 25,

                    // Efficiency
                    completionPct: 67.5,
                    yardsPerAttempt: 7.0,
                    yardsPerCompletion: 10.4,
                    tdPct: 6.2,
                    intPct: 2.4,

                    // Situational
                    qbRating: 105.2,
                    fourthQuarterComebacks: 4,
                    gameWinningDrives: 5,
                    redZoneAttempts: 85,
                    redZoneTD: 28,

                    // Advanced Passing
                    airYardsAttempted: 3250,
                    airYardsCompleted: 1850,
                    intendedAirYardsPerAttempt: 8.5,
                    completedAirYardsPerCompletion: 4.6,
                    badThrowPct: 18.2,
                    onTargetPct: 77.5,
                    pressurePct: 24.8,
                    timeToThrow: 2.84,

                    // Advanced Rushing
                    yardsBeforeContact: 258,
                    yardsAfterContact: 100,
                    brokenTackles: 12,

                    // Play Action
                    playActionAttempts: 125,
                    playActionCompletions: 88,
                    playActionYards: 1102,
                    playActionTD: 12
                },
                advanced: {
                    // Overall Grades
                    pffGrade: 91.5,
                    passingGrade: 92.3,
                    rushingGrade: 85.4,

                    // Advanced Metrics
                    epa: 145.2,
                    epaPerPlay: 0.245,
                    success_rate: 52.3,
                    cpoe: 3.8,

                    // Situational
                    epaUnderPressure: 35.2,
                    epaClean: 110.0,
                    epaByDown: {
                        first: 45.2,
                        second: 38.4,
                        third: 52.1,
                        fourth: 9.5
                    },

                    // Deep Passing
                    deepAttempts: 85,
                    deepCompletions: 35,
                    deepYards: 1250,
                    deepTD: 12,

                    // Pressure Response
                    pressureToSackPct: 15.2,
                    timeToThrowUnderPressure: 3.12,
                    scrambles: 45,
                    scrambleYards: 225
                },
                fantasy: {
                    // Season Rankings
                    overallRank: 2,
                    positionRank: 1,

                    // Scoring
                    totalPoints: 380.5,
                    pointsPerGame: 23.8,

                    // Category Rankings
                    categoryRanks: {
                        passYards: 2,
                        passTD: 1,
                        rushYards: 8,
                        rushTD: 12,
                        totalTD: 2
                    },

                    // Projections
                    restOfSeason: {
                        projected: 2,
                        risk: "Low",
                        upside: "High"
                    },

                    // Format Values
                    formatValues: {
                        standard: 2,
                        ppr: 2,
                        superflex: 1,
                        dynasty: 1
                    }
                }
            }
        },
        teams: {
            "789": {
                info: {
                    id: "789",
                    name: "Kansas City Chiefs",
                    abbreviation: "KC",
                    city: "Kansas City",
                    state: "MO",
                    conference: "AFC",
                    division: "West",
                    coach: "Andy Reid",
                    stadium: "Arrowhead Stadium",
                    founded: 1960
                },
                stats: {
                    wins: 11,
                    losses: 6,
                    ties: 0,
                    winPct: .647,
                    pointsFor: 371,
                    pointsAgainst: 245,
                    streak: "W3"
                },
                advanced: {
                    dvoa: 25.4,
                    offenseDvoa: 15.2,
                    defenseDvoa: -10.2,
                    specialTeamsDvoa: 2.1,
                    pythagWins: 11.5
                }
            }
        },
        metadata: {
            lastUpdated: new Date("2024-02-20T12:00:00Z"),
            season: "2024",
            availableCategories: [
                "passYards", "passTD", "passInt",
                "rushYards", "rushTD", "receptions",
                "recYards", "recTD", "tackles",
                "sacks", "interceptions"
            ],
            statGroups: {
                passing: ["passYards", "passTD", "passInt"],
                rushing: ["rushYards", "rushTD"],
                receiving: ["receptions", "recYards", "recTD"],
                defense: ["tackles", "sacks", "interceptions"]
            },
            defaultDisplay: ["passYards", "passTD", "rushYards"],
            fantasyFormats: ["standard", "ppr", "superflex", "dynasty"],
            positionEligibility: {
                "67890": ["QB"]
            }
        }
    },

    users: {
        "user123": {
            auth0Id: "auth0|123456789",
            email: "user@example.com",
            created: new Date("2024-01-01T00:00:00Z"),
            lastLogin: new Date("2024-02-20T12:00:00Z"),
            preferences: {
                favoriteTeams: ["LAL", "LAD", "LAR"],
                favoritePlayers: ["39836", "12345", "67890"],
                defaultSport: "NBA",
                defaultView: "rankings",
                notifications: {
                    injuries: true,
                    transactions: true,
                    news: true
                },
                displayPreferences: {
                    theme: "dark",
                    statFormat: "decimal",
                    timezone: "America/Los_Angeles"
                }
            },
            leagues: {
                fantrax: ["fantrax_league_id1", "fantrax_league_id2"],
                yahoo: ["yahoo_league_id1"],
                espn: ["espn_league_id1", "espn_league_id2"],
                sleeper: ["sleeper_league_id1"]
            },
            subscription: {
                tier: "premium",
                startDate: new Date("2024-01-01T00:00:00Z"),
                renewalDate: new Date("2025-01-01T00:00:00Z"),
                features: ["advanced_stats", "trade_analyzer", "premium_content"]
            }
        }
    },

    userRankings: {
        "ranking123": {
            userId: "user123",
            sport: "NBA",
            name: "My Dynasty Rankings",
            description: "Personal dynasty rankings with youth emphasis",
            created: new Date("2024-02-20T12:00:00Z"),
            lastUpdated: new Date("2024-02-20T12:00:00Z"),
            format: "dynasty",
            timeframe: "5year",
            isPublic: true,
            rankings: [
                {
                    playerId: "39836",
                    rank: 1,
                    notes: "Still the king",
                    trend: "stable",
                    lastRank: 1,
                    confidence: 95
                }
            ],
            metadata: {
                totalPlayers: 200,
                lastFullUpdate: new Date("2024-02-20T12:00:00Z"),
                categories: ["standard", "dynasty", "rookies"],
                tags: ["youth", "upside", "win-now"]
            }
        }
    },

    userScores: {
        "user123": {
            "39836": {
                preference: 0.8,
                notes: "High on him for dynasty",
                lastUpdated: new Date("2024-02-20T12:00:00Z"),
                factors: {
                    age: 0.7,
                    injury_risk: 0.8,
                    team_situation: 0.9,
                    recent_performance: 0.85
                },
                history: [
                    {
                        date: new Date("2024-01-20T12:00:00Z"),
                        preference: 0.75,
                        notes: "Initial rating"
                    }
                ]
            }
        }
    },

    leagues: {
        "league123": {
            name: "Super Dynasty League",
            platform: "fantrax",
            platformLeagueId: "abc123",
            sport: "NBA",
            created: new Date("2024-01-01T00:00:00Z"),
            lastSynced: new Date("2024-02-20T12:00:00Z"),
            teams: [
                {
                    name: "Team Awesome",
                    owner: "user123",
                    roster: ["39836", "12345"],
                    draftPicks: [
                        {
                            year: 2025,
                            round: 1,
                            originalOwner: "user123"
                        }
                    ]
                }
            ],
            settings: {
                scoringFormat: "H2H Points",
                rosterSize: 16,
                startingPositions: {
                    PG: 1,
                    SG: 1,
                    SF: 1,
                    PF: 1,
                    C: 1,
                    G: 1,
                    F: 1,
                    UTIL: 3
                },
                scoringSettings: {
                    points: 1,
                    rebounds: 1.2,
                    assists: 1.5,
                    steals: 3,
                    blocks: 3,
                    turnovers: -1
                },
                tradeDeadline: "2025-02-15",
                playoffStartWeek: 21,
                draftDate: new Date("2024-09-15T00:00:00Z")
            },
            standings: [
                {
                    teamId: "team123",
                    rank: 1,
                    wins: 15,
                    losses: 4,
                    pointsFor: 2450,
                    pointsAgainst: 2100
                }
            ],
            transactions: [
                {
                    type: "trade",
                    date: new Date("2024-02-15T00:00:00Z"),
                    teamFrom: "team123",
                    teamTo: "team456",
                    assetsFrom: ["39836"],
                    assetsTo: ["12345", "2025_1st"]
                }
            ]
        }
    },

    expertRankings: {
        "ranking456": {
            source: "Fantasy Pros",
            author: "Expert Name",
            date: new Date("2024-02-20T12:00:00Z"),
            sport: "NBA",
            format: "Dynasty",
            timeframe: "Long Term",
            rankings: [
                {
                    playerId: "39836",
                    rank: 1,
                    fuzzyMatchConfidence: 1.0,
                    trend: "stable",
                    lastRank: 1,
                    notes: "Expert analysis notes"
                }
            ],
            metadata: {
                totalRanked: 200,
                rankingCriteria: ["talent", "age", "situation"],
                updateFrequency: "weekly",
                methodology: "Expert consensus"
            }
        }
    },

    globalMetadata: {
        lastUpdated: new Date("2024-02-20T12:00:00Z"),
        version: "1.0.0",
        supportedSports: ["NBA", "MLB", "NFL"],
        displayPreferences: {
            defaultSport: "NBA",
            statDisplayFormat: "decimal",
            theme: "light"
        },
        dataRefreshSchedule: {
            stats: "daily",
            rankings: "weekly",
            leagues: "hourly"
        },
        apiStatus: {
            mysportsfeed: "operational",
            fantrax: "operational",
            yahoo: "operational",
            espn: "operational",
            sleeper: "operational"
        },
        maintenance: {
            lastBackup: new Date("2024-02-20T00:00:00Z"),
            nextScheduledUpdate: new Date("2024-02-21T00:00:00Z"),
            dataRetentionPeriod: {
                stats: "365 days",
                userActivity: "730 days",
                rankings: "forever"
            }
        },
        systemStats: {
            totalUsers: 15000,
            activeUsers: 8500,
            totalLeagues: 2500,
            totalRankings: 12000,
            storageUsed: "25GB",
            apiCallsToday: 150000
        },
        featureFlags: {
            betaFeatures: {
                tradeAnalyzer: true,
                aiInsights: false,
                customRankings: true
            },
            maintenanceMode: false,
            readOnlyMode: false
        }
    }
};

export default masterDatasetSchema;