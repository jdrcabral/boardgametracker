
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your campaigns without the need of spreadsheet or paper" />
        <meta name="keywords" content="board, game, campaign, tracker" />
        <link rel="icon" type="image/png" href="/images/icons/favicon-32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/images/icons/favicon-16.png" sizes="16x16" />
        <link rel="canonical" href="https://jdrcabral.github.io/boardgametracker/" />
      </Head>

      <div className="container">
        <h1>Board Game Tracker</h1>
        <p>A web application to keep track of your board game campaigns. Now you can easily save your game progress without the use of a spreadsheet or papers,
            just select your game and it's ready to start.
        </p>
        <h3>Board Games</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <Link href="/boardgame/dark_souls">
              <Image width="100" height="100" alt="dark souls cover" src="https://m.media-amazon.com/images/I/71eJzGGOlnL.jpg" className="img-thumbail" />Dark Souls: The Board Game
            </Link>
          </li>
          <li className="list-group-item">
            <Link href="/boardgame/mice_and_mystics">
              <Image width="100" height="100" alt="mice and mystics cover" src="https://m.media-amazon.com/images/I/819-WHSONaL.jpg" className="img-thumbail" />Mice and Mystics
            </Link>
          </li>
          <li className="list-group-item">
            <Link href="/boardgame/residentevil">
              <Image width="100" height="100" alt="resident evil cover" src="https://cf.geekdo-images.com/-cdkttxVSfDG5nfvTyhOqQ__itemrep/img/i7N82QV2jNvaTgmbcwTJo6Hiz6w=/fit-in/246x300/filters:strip_icc()/pic6465101.png" className="img-thumbail" />Resident Evil: The Board Game
            </Link>
          </li>
          <li className="list-group-item">
            <Link href="/boardgame/residentevil3">
              <Image width="100" height="100" alt="resident evil 3 cover" src="https://steamforged.com/cdn/shop/products/SFRE3-001-TheBoardGame-Box-3D_700x.png?v=1672933985" className="img-thumbail" />Resident Evil 3: The Board Game
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
