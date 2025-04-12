'use client';

import { useEffect, useState } from 'react';
import { useMasterDataset } from '../../stores/useMasterDataset';
import RankingsPlayerListContainer from './RankingsPlayerListContainer';

const RedraftRankingsManager = ({ sport }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const dataset = useMasterDataset();

    // Default categories for NBA redraft
    const defaultCategories = [
        'pointsPerGame',
        'reboundsPerGame',
        'assistsPerGame',
        'stealsPerGame',
        'blocksPerGame',
        'fieldGoalPercentage',
        'freeThrowPercentage',
        'threePointersMadePerGame',
        'turnoversPerGame'
    ];

    useEffect(() => {
        setCategories(defaultCategories);
    }, []);

    const handleCategoryToggle = (category) => {
        setCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const handleCalculateRankings = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/rankings/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sport,
                    categories,
                    format: 'Redraft'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to calculate rankings');
            }

            // Refresh the rankings display
            // This would typically trigger a re-fetch of the latest rankings
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {defaultCategories.map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-1 rounded-full text-sm ${categories.includes(category)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <button
                onClick={handleCalculateRankings}
                disabled={isLoading || categories.length === 0}
                className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
                {isLoading ? 'Calculating...' : 'Calculate Rankings'}
            </button>

            {error && (
                <div className="text-red-500">
                    {error}
                </div>
            )}

            <RankingsPlayerListContainer
                sport={sport}
                activeRanking="Redraft"
                dataset={dataset}
            />
        </div>
    );
};

export default RedraftRankingsManager; 