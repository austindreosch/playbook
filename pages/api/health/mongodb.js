import { getConnectionStats } from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const stats = getConnectionStats();
        const status = stats?.isConnected ? 'healthy' : 'unhealthy';

        res.status(200).json({
            status,
            mongodb: {
                connected: stats?.isConnected || false,
                hasClient: stats?.hasClient || false,
                hasDatabase: stats?.hasDatabase || false,
                database: 'playbook'
            },
            connectionPool: {
                configured: {
                    maxPoolSize: 50,
                    minPoolSize: 5,
                    maxIdleTimeMS: 30000,
                    maxConnecting: 10
                },
                // Note: Actual pool metrics would require additional MongoDB driver features
                note: "Pool metrics require MongoDB driver 4.0+ with monitoring enabled"
            },
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });

    } catch (error) {
        console.error('MongoDB health check error:', error);
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
}