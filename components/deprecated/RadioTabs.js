// import React, { useState } from 'react';

// function RadioTabs ({tab1, tab2, tab3}){
//     const [activeTab, setActiveTab] = useState('tab2');

//     const handleChange = (tabId) => {
//         setActiveTab(tabId);
//     };

//   return (
//     <div className='max-w-full'>
//         <div className="flex">
//             <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 ">
//                 <nav className="flex space-x-2" aria-label="Tabs" role="tablist">

//                     <button 
//                         onClick={() => handleChange('tab1')} 
//                         type="button" 
//                         className={`py-3 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-md 
//                         ${activeTab === 'tab1' ? 'bg-white text-gray-700 ' 
//                         : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'} 
//                         hover:text-blue-600`}
//                         id="segment-item-1" 
//                         data-hs-tab="#segment-1" 
//                         aria-controls="segment-1" 
//                         role="tab">
//                         {tab1}
//                     </button>

//                     <button 
//                         onClick={() => handleChange('tab2')} 
//                         type="button" 
//                         className={`py-3 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-md 
//                         ${activeTab === 'tab2' ? 'bg-white text-gray-700 ' 
//                         : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700'} 
//                         hover:text-blue-600`}
//                         id="segment-item-2" 
//                         data-hs-tab="#segment-2" 
//                         aria-controls="segment-2" 
//                         role="tab">
//                         {tab2}
//                     </button>

//                     <button 
//                         onClick={() => handleChange('tab3')} 
//                         type="button" 
//                         className={`py-3 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-md 
//                         ${activeTab === 'tab3' ? 'bg-white text-gray-700 ' 
//                         : 'bg-gray-100 hover:bg-gray-200  text-gray-500 hover:text-gray-700'} 
//                         hover:text-blue-600`}
//                         id="segment-item-3" 
//                         data-hs-tab="#segment-3" 
//                         aria-controls="segment-3" 
//                         role="tab">
//                         {tab3}
//                     </button>
//                 </nav>
//             </div>
//         </div>

//     </div>

//   )
// }

// export default RadioTabs;
