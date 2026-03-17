
import Head from 'next/head';
import { useEffect, useState } from 'react';
import CharacterCard from '../../components/mice_and_mystics/CharacterCard';
import StoryAchievements from '../../components/mice_and_mystics/StoryAchievements';
import PartyItems from '../../components/mice_and_mystics/PartyItems';
import Scenarios from '../../components/mice_and_mystics/Scenarios';

export default function MiceAndMysticsPage() {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    fetch('../../data/mice_and_mystics.json')
      .then(response => response.json())
      .then(data => setGameData(data));
  }, []);

  return (
    <>
      <Head>
        <title>Mice and Mystics - Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your Mice and Mystics campaigns" />
        <meta name="keywords" content="board, game, campaign, tracker, mice, mystics" />
      </Head>

      <div className="container">
        <h1>Mice and Mystics</h1>
        <div className="alert alert-warning" role="alert">
            This page use the browser storage to keep it's data. In case of a clean up you can lose everything
        </div>
        <div className="container mt-3">
            <div className="row text-center">
              <div className="col-md-8 col-xs-12 mb-3">
                <select className="form-select" aria-label="Campaign Select" id="campaignSelect">
                  <option> Select Campaign</option>
                </select>
              </div>
              <div className="col-md-2 col-xs-4 mb-3">
                <button type="button" className="btn btn-primary btn-sm">New Campaign</button>
              </div>
              <div className="col-md-2 col-xs-4">
                <button type="button" className="btn btn-danger btn-sm">Delete Campaign</button>
              </div>
            </div>
            <div className="row mt-3">
              <label htmlFor="campaignTitle" className="col-md-2 col-xs-12 col-form-label">Campaign Title</label>
              <div className="col-md-8 col-xs-12">
                <input type="text" id="campaignTitle" placeholder="Campaign Title" className="form-control" />
              </div>
            </div>
        </div>
        <h3 className="mt-3">Story Achievements</h3>
        {gameData && <StoryAchievements achievements={gameData.storyAchievements} />}
        <hr/>
        <h3>Party Items</h3>
        {gameData && <PartyItems items={gameData.partyItems} />}
        <hr/>
        <h3>Characters</h3>
        <div className="container">
          <div className="row">
            {gameData && gameData.characters.map(character => (
              <CharacterCard key={character.name} character={character} />
            ))}
          </div>
        </div>
        <hr/>
        <h3>Scenarios</h3>
        {gameData && <Scenarios scenarios={gameData.scenarios} />}
        <div className="container text-center mb-3">
            <button type="button" className="btn btn-primary">Export<a id="exportFile"></a></button>
            <button type="button" className="btn btn-primary">Import</button>
            <button type="button" className="btn btn-danger">Clear Data</button>
        </div>
      </div>
    </>
  );
}
