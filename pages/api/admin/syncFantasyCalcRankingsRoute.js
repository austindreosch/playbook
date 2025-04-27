import { syncFantasyCalcRankings } from '@/lib/tasks/syncFantasyCalcRankings';
// Remove NextResponse import if no longer needed, or keep if used elsewhere
// import { NextResponse } from 'next/server'; 

// Define the default handler for the API route
export default async function handler(req, res) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    // If not POST, return 405 Method Not Allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // If POST, proceed with the original logic
  console.log("API route /api/admin/syncFantasyCalcRankingsRoute called (POST)");

  // TODO: Add authentication/authorization check here

  try {
    const sport = 'NFL'; 
    console.log(`Triggering syncFantasyCalcRankings task for ${sport}...`);
    
    const results = await syncFantasyCalcRankings(sport);

    // Check if the task itself returned an error (check errors array)
    if (results.errors && results.errors.length > 0) {
      console.warn("FantasyCalc sync task returned errors:", results.errors);
      // Return 400 Bad Request status as the task failed
      return res.status(400).json({ success: false, message: results.errors.join('; ') || 'FantasyCalc task failed', results });
    }
    
    console.log("syncFantasyCalcRankings task finished successfully.");
    // Use standard res.status().json() for success
    return res.status(200).json({ success: true, message: `FantasyCalc sync task completed for ${sport}.`, results });

  } catch (error) {
    // Catch errors from the API route handler itself (e.g., issues calling the task)
    console.error("Error in /api/admin/syncFantasyCalcRankingsRoute:", error);
    // Use standard res.status().json() for errors
    return res.status(500).json(
      { success: false, message: "Internal Server Error during FantasyCalc sync.", error: error.message }
    );
  }
} 