import { FileText, MessageSquare, Newspaper, Play, User } from 'lucide-react';

export default function NewsFeedBlock() {



  const newsItems = [
    {
      type: 'latest-news',
      playerImage: '👤', // Placeholder for player image
      playerName: 'L. Doncic',
      time: '2:42 PM',
      content: 'Doncic accumulated 28 points (7-18 FG, 2-8 3Pt, 12-15 FT), seven rebounds, nine assists and one steal across 40 minutes during....'
    },
    {
      type: 'new-debate',
      authorImage: '👤', // Placeholder for author image
      question: 'What can we expect from Luka next season?',
      time: '1d',
      response: {
        author: 'HotTakes123',
        content: '"Bros washed without Kyrie, I would trade him now and wouldn\'t think twice about it."'
      }
    },
    {
      type: 'talking-head',
      source: 'Dynasty Domain',
      sourceImage: '🏀', // Placeholder for source logo
      time: '2d',
      content: '"Luka\'s counting stats are elite - but that FG% and TO are anchor weights. Be careful in 9-cat."'
    },
    {
      type: 'latest-news-repeat',
      playerImage: '👤', // Placeholder for player image
      playerName: 'L. Doncic',
      time: '2:42 PM',
      content: 'Doncic accumulated 28 points (7-18 FG, 2-8 3Pt, 12-15 FT), seven rebounds, nine assists and one steal across 40 minutes during....'
    }
  ];




  return (
    <div className={`w-full h-full rounded-lg border border-pb_lightgray shadow-sm p-3`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Newspaper className="w-icon h-icon text-pb_darkgray" />
        <h3 className="text-sm font-semibold text-pb_darkgray">News Feed</h3>
      </div>

      {/* News Items */}
      <div className="space-y-4">
        {/* Latest News */}
        <div>
          <div className="bg-gray-200 rounded-t-lg px-4 py-2 flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-700">Latest News</h4>
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                {newsItems[0].playerImage}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 font-medium">{newsItems[0].playerName}</span>
                  <span className="text-gray-400 text-sm">{newsItems[0].time}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {newsItems[0].content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New Debate */}
        <div>
          <div className="bg-yellow-400 rounded-t-lg px-4 py-2 flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-800">New Debate</h4>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-700" strokeWidth={2} />
              <FileText className="w-5 h-5 text-gray-700" strokeWidth={2} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                {newsItems[1].authorImage}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">{newsItems[1].question}</p>
                  <span className="text-gray-400 text-sm">{newsItems[1].time}</span>
                </div>
              </div>
            </div>
            <div className="pl-13">
              <p className="text-gray-700 font-medium mb-1">{newsItems[1].response.author}:</p>
              <p className="text-gray-600 text-sm italic">
                {newsItems[1].response.content}
              </p>
            </div>
          </div>
        </div>

        {/* Talking Head */}
        <div>
          <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between">
            <h4 className="text-base font-medium text-white">Talking Head</h4>
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-white" strokeWidth={2} />
              <FileText className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
          </div>
          <div className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-sm text-white">
                {newsItems[2].sourceImage}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">{newsItems[2].source}</span>
                  <span className="text-gray-400 text-sm">{newsItems[2].time}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {newsItems[2].content}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest News (Repeat) */}
        <div>
          <div className="bg-gray-200 rounded-t-lg px-4 py-2 flex items-center justify-between">
            <h4 className="text-base font-medium text-gray-700">Latest News</h4>
            <FileText className="w-5 h-5 text-gray-600" strokeWidth={2} />
          </div>
          <div className="bg-gray-50 rounded-b-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm">
                {newsItems[3].playerImage}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-600 font-medium">{newsItems[3].playerName}</span>
                  <span className="text-gray-400 text-sm">{newsItems[3].time}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {newsItems[3].content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 











// export default function NewsFeedBlock() {
  

//   return (
//     <div className="w-full bg-white rounded-lg border border-gray-300 shadow-sm p-4">
      
//     </div>
//   );
// }