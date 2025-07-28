import { getSession } from '@auth0/nextjs-auth0';
import { getDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * API endpoint to create a new user ranking set
 */

const mongoUri = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the user session
    const session = await getSession(req, res);
    if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
        name, 
        sport, 
        format, 
        scoring, 
        details, 
        categories, 
        rankings,
        flexSetting,
        pprSetting 
    } = req.body;

    // Basic validation
    if (!name || !sport || !format || !scoring) {
        return res.status(400).json({ 
            error: 'Missing required fields: name, sport, format, scoring' 
        });
    }

    try {
        const db = await getDatabase();

        // Create the new ranking document
        const newRanking = {
            userId: session.user.sub,
            name,
            sport: sport.toUpperCase(),
            format,
            scoring,
            details: details || {},
            categories: categories || [],
            rankings: rankings || [],
            flexSetting: flexSetting || null,
            pprSetting: pprSetting || null,
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        const result = await db.collection('user_rankings')
            .insertOne(newRanking);

        if (!result.insertedId) {
            throw new Error('Failed to create ranking');
        }

        // Return the created ranking with the generated ID
        const createdRanking = {
            _id: result.insertedId,
            ...newRanking
        };

        return res.status(201).json({
            success: true,
            ranking: createdRanking,
            message: 'Ranking created successfully'
        });

    } catch (error) {
        console.error('Error creating user ranking:', {
            message: error.message,
            stack: error.stack,
            userId: session?.user?.sub,
            rankingName: name
        });

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(409).json({
                error: 'A ranking with this name already exists',
                details: 'Please choose a different name for your ranking'
            });
        }

        return res.status(500).json({
            error: 'Failed to create ranking',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}




