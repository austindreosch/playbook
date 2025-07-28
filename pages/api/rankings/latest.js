import { getDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sport, format, scoring, flexSetting, pprSetting } = req.query;

    // Validate required parameters
    if (!sport || !format || !scoring) {
        return res.status(400).json({
            error: 'Missing required parameters',
            details: 'sport, format, and scoring are required'
        });
    }

    try {
        const db = await getDatabase();
        const rankingsCollection = db.collection('rankings');

        // Build query object
        const query = {
            sport: sport.toUpperCase(),
            format: format.charAt(0).toUpperCase() + format.slice(1).toLowerCase(),
            scoring: scoring.charAt(0).toUpperCase() + scoring.slice(1).toLowerCase(),
            isLatest: true
        };

        // Add NFL-specific parameters if provided
        if (sport.toUpperCase() === 'NFL') {
            if (flexSetting) {
                query.flexSetting = flexSetting.toLowerCase();
            }
            if (pprSetting) {
                query.pprSetting = pprSetting.toLowerCase();
            }
        }

        console.log('Rankings query:', query);

        // Find the latest ranking document
        const rankingDoc = await rankingsCollection.findOne(query, {
            sort: { publishedAt: -1 }
        });

        if (!rankingDoc) {
            return res.status(404).json({
                error: 'No rankings found',
                details: `No rankings found for the specified criteria: ${JSON.stringify(query)}`
            });
        }

        // Return the ranking document
        return res.status(200).json({
            success: true,
            data: {
                _id: rankingDoc._id,
                sport: rankingDoc.sport,
                format: rankingDoc.format,
                scoring: rankingDoc.scoring,
                flexSetting: rankingDoc.flexSetting,
                pprSetting: rankingDoc.pprSetting,
                publishedAt: rankingDoc.publishedAt,
                source: rankingDoc.source,
                version: rankingDoc.version,
                rankings: rankingDoc.rankings || [],
                totalCount: rankingDoc.rankings?.length || 0
            }
        });

    } catch (error) {
        console.error('Error fetching latest rankings:', {
            message: error.message,
            stack: error.stack,
            query: { sport, format, scoring, flexSetting, pprSetting }
        });
        return res.status(500).json({
            error: 'Failed to fetch latest rankings',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
} 