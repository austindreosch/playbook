![image](https://github.com/austindreosch/playbook/assets/83053022/939359d5-12bc-4e06-b85f-645eb6e60afc)

![screely-1694968333254](https://github.com/austindreosch/playbook/assets/83053022/34ebe95b-9a61-4a0a-952f-43f59dbab886)


## Documentation
Playbook is fantasy sports toolkit build with Next.js, MongoDB, auth0, and Tailwind CSS.

Users can import their fantasy leagues using their unique league identifier from their fantasy provider, but currently only Fantrax basketball leagues are supported. When the league identifier is entered - we make a two-part call to the Fantrax private access API which first returns the league information including scoring system, matchup schedule data, and team names and IDs - which then follows with a second API route call that returns an array of players belonging to each team. This player data only includes name, position, and team, so another service must be used for stats. All of this data gets entered in the MongoDB database using custom data structure to help facilitate the next step. 

After that, I used the MySportsFeed commercial sports data API to fetch the stats data for every player in the NBA, and cache it in the database - this happens once daily, unless there is need for live stats data in the future.

Finally, on the user dashboard, I call the user league data to fetch the list of leagues I've imported and which players belong to me and the other teams in my league - then I allow users to choose which league's roster they'd like to analyze and the player array for that league is used to fetch the cached stats data for each player in the array to display it in a customized table.


## Feature Roadmap
* User inputs on each player, as well as each team
* Data analytics based on those inputs
* Editable expert community rankings page
* Trade suggestions with OpenAI integration, based on the data analytics
* Stripe implementation for payments
* Other fantasy service providers
* Other sports





## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
