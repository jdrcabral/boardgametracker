
import Head from 'next/head';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Board Game Campaign Tracker</title>
        <meta name="description" content="Learn more about the Board Game Campaign Tracker project." />
      </Head>

      <div className="container">
        <h1>About</h1>
        <p>
          This project come to life after I struggled to keep track of the campaigns that I 
          was playing. It happened more than once of getting lost on what was done between 
          notes and pictures. Also trying to use a spreadsheet wasn't very helpfull because 
          I usually don't have a laptod around and spreadsheet isn't very mobile friendelly 
        </p>
        <p>
          That's why I create this page, I tried to create a easy way to keep track of your 
          board games by just accessing a page. And I also tried to build it focusing on mobile 
          user, because we have a high chance of someone carrying a phone.
        </p>
        <p>
          I have plans to include more games and continue improving this page, but that takes
          time. Also it's little complex to include a game that I didn't played and don't know 
          how the players keep track of the campaign. So if exists a game that you really wish 
          to be included you can head to the project Github 
          <a href="https.github.com/jdrcabral/boardgametracker" target="_blank" rel="noopener noreferrer">page</a> and create 
          an issue requesting that game. And if you know a little bit about coding, you can 
          create the game yourself and I will happily review your code and include you changes.
        </p>
        <p>
          And if you are wondering about it becoming a mobile application, I have another project 
          for that. At the moment it isn't in a working stage and I at this moment I don't have 
          much time to work on it, but if you want to give a look at it you can see it 
          <a href="https://github.com/jdrcabral/bgcampaigntracker" target="_blank" rel="noopener noreferrer">here</a>.</p>
      </div>
    </>
  );
}
