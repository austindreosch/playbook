'use client';

import { Progress } from '@/components/ui/progress';

export default function TeamCategoryStrengthBar() {
    // TODO: Replace with dynamic data from user's league settings
    const categoryStrengths = [
        { category: 'PTS', strength: 92 },
        { category: 'AST', strength: 88 },
        { category: 'REB', strength: 70 },
        { category: 'STL', strength: 85 },
        { category: 'BLK', strength: 65 },
    ];

    return (
        <div className="w-full bg-pb_backgroundgray p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-pb_textprimary mb-4">Category Strength</h3>
            <div className="space-y-3">
                {categoryStrengths.map(({ category, strength }) => (
                    <div key={category} className="grid grid-cols-12 items-center gap-2">
                        <p className="col-span-2 text-sm font-semibold text-pb_textsecondary">{category}</p>
                        <div className="col-span-10 flex items-center gap-2">
                            <Progress value={strength} className="w-full h-2 bg-pb_lightgray" />
                            <p className="text-sm font-bold text-pb_textprimary">{strength}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
