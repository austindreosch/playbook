'use client';

export default function TradePlayerRow({ player }) {
    return (
        <div className="flex items-center justify-between p-2 bg-pb_lightgray rounded-md">
            <p className="text-sm font-semibold text-pb_textprimary">{player.name}</p>
            {/* TODO: Add buttons or actions for the player row */}
        </div>
    );
}
