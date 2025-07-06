export const metadata = {
  title: 'About Us'
}

import React from 'react';

const FeatureCard = ({ title, description, imageUrl }) => (
    <div className="border p-4 rounded-lg transform transition-transform hover:-translate-y-2 shadow-md hover:shadow-lg bg-white max-w-[320px]">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover rounded-md" />
        <h3 className="text-xl font-semibold mt-4">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
    </div>
);


const TimelineItem = ({ title, description }) => (
    <div className="relative mb-6 last:mb-0">
        <div className="absolute top-8 left-4 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
        <div className="flex space-x-4">
            <div className="rounded-full bg-blue-500 h-8 w-8 mt-1 z-10 relative"></div>
            <div className="flex-1 mt-1">
                <h4 className="text-lg font-semibold">{title}</h4>
                <p className="text-gray-600 mt-1">{description}</p>
            </div>
        </div>
    </div>
);



export default function Page(){
    const features = [
        {
            title: "Fantrax API Integration",
            description: "We utilize the Fantrax API to directly communicate with their platform, enabling users to effortlessly import their fantasy teams. This provides real-time updates, ensuring that your team data is always current and accurate.",
            imageUrl: "https://fantraximg.com/assets/images/headers/fantrax-card-image.jpg"
        },
        {
            title: "MySportsFeeds Stats Data",
            description: "By integrating the MySportsFeeds Data API, our application taps into a wealth of sports statistics. This ensures you're getting the most comprehensive and up-to-date data possible, from player stats to game outcomes, all in a structured format for easy processing.",
            imageUrl: "https://i.imgur.com/aKz4zFJ.jpg"
        },
        {
            title: "Cloud Data Caching",
            description: "Our infrastructure employs MongoDB to handle data synchronization and caching. This guarantees a resilient and scalable data management solution. Data is periodically cached to reduce server load, leading to quicker response times and a smoother user experience.",
            imageUrl: "https://i.imgur.com/YbjXYk5.jpg"
        },
        {
            title: "Secure User Authentication",
            description: "Our application incorporates Auth0 for robust, flexible authentication solutions. This integration allows seamless user authentication secure across different platforms with support for social logins and multi-factor authentication.",
            imageUrl: "https://images.ctfassets.net/23aumh6u8s0i/5sx3XSZAfFCykArFGXcx7O/f963e7e4555ece8d63a32a19fc614973/auth0-by-okta-hero.jpg"
        },
        // Add more features as necessary
    ];
    
    const upcomingFeatures = [
        {
            title: "Expanded Data Set Customization",
            description: "Enhance your analysis further with more user variable inputs. Customize metrics for nuanced insights tailored to specific preferences."
        },
        {
            title: "Generative AI Driven Trade Suggestions",
            description: "Harness AI capabilities to receive proactive trade suggestions. Strategize with AI-backed recommendations for optimal team configurations."
        },
        {
            title: "Support for More League Formats",
            description: "Broaden your gameplay. We're introducing varied league formats to cater to diverse playing styles and strategies."
        },
        {
            title: "Expert Dynasty Rankings",
            description: "Elevate your dynasty strategy. Access expert-curated rankings and modify them to align with your gameplay tactics."
        },
        {
            title: "Trade Analyzer",
            description: "Analyze with precision. Evaluate potential trades with a comprehensive tool, gauging both opportunities and risks."
        },
        {
            title: "Expansion to MLB and NFL",
            description: "Diversify your fantasy portfolio. More sports, including MLB and NFL, will be integrated for broader support."
        },
    ];
    

    return (
        <div className="p-6 ">
            <h2 className="text-2xl font-bold text-center mb-8">Feature Overview</h2>
            <div className="flex flex-col justify-center items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>


            <h2 className="text-2xl font-bold text-center mt-12 mb-8 ">Upcoming Features</h2>
            <div className="max-w-2xl mx-auto mb-20">
                {upcomingFeatures.map((feature, index) => (
                    <TimelineItem key={index} {...feature} />
                ))}
            </div>
        </div>
    );
}