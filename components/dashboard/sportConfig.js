// TODO: This is a centralized configuration for sport-specific details.
// As the app expands, add other details like position display names,
// stat categories, etc.

export const sportConfig = {
    nba: {
        positionColors: {
            'PG': 'bg-pb_pastelblue',
            'SG': 'bg-pb_pastelgreen',
            'SF': 'bg-pb_pastelorange',
            'PF': 'bg-pb_pastelpurple',
            'C':  'bg-pb_pastelred',
        }
    },
    nfl: {
        positionColors: {
            'QB': 'bg-pb_pastelred',
            'RB': 'bg-pb_pastelgreen',
            'WR': 'bg-pb_pastelblue',
            'TE': 'bg-pb_pastelorange',
        }
    },
    mlb: {
        positionColors: {
            'C':  'bg-pb_pastelblue',
            'MI': 'bg-pb_pastelbrown',
            'CI': 'bg-pb_pastelorange',
            'OF': 'bg-pb_pastelgreen',
            'P':  'bg-pb_pastelpurple',
        }
    }
}; 