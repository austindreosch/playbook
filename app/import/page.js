//  /import page

'use client'

// import ImportLeagueForm from '@/components/deprecated/ImportLeagueForm';
// import { useUser } from '@auth0/nextjs-auth0/client';

export default function LeaguePage() {
  // const { user } = useUser();

  return (
    <div className="flex items-center justify-center p-10">
      <p>Import page (deprecated)</p>
    </div>
  );
}


// export default function Home() {

//   const router = useRouter();
//   const { user, error, isLoading } = useUser();

//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.push('/landing');
//     }
//   }, [isLoading, user, router]);

//   // Function to handle redirection to rankings page
//   // useEffect(() => {
//   //   if (user) {
//   //     router.push('/rankings');
//   //   }
//   // }, [user, router]);



//   // if (isLoading) return <div className='flex justify-center content-align my-auto mx-auto pt-48 h-screen'>
//   //   <ThreeCircles
//   //     height="200"
//   //     width="200"
//   //     color="#42a9e0"
//   //     wrapperStyle={{}}
//   //     wrapperClass=""
//   //     visible={true}
//   //     ariaLabel="three-circles-rotating"
//   //     outerCircleColor=""
//   //     innerCircleColor=""
//   //     middleCircleColor=""
//   //   />
//   // </div>
//   // if (error) return <div>{error.message}</div>;

//   return (
//     user && (
//       <div className="">
        
//       </div>
//     ));
// }