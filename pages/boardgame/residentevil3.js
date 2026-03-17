
import Head from 'next/head';
import CharactersTab from '../../components/resident_evil_3/CharactersTab';
import ItemsTab from '../../components/resident_evil_3/ItemsTab';
import DecksTab from '../../components/resident_evil_3/DecksTab';
import ScenariosTab from '../../components/resident_evil_3/ScenariosTab';

export default function ResidentEvil3Page() {
  return (
    <>
      <Head>
        <title>Resident Evil 3 - Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your Resident Evil 3 campaigns" />
        <meta name="keywords" content="board, game, campaign, tracker, resident, evil, 3" />
      </Head>

      <div className="container">
        <h1>Resident Evil 3: The Board Game</h1>
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
        <h3>City Danger</h3>
        <div className="container">
          <input type="number" className="form-control" id="cityDanger" min="0" max="20" />
        </div>
        <hr />
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="character-tab" data-bs-toggle="tab" data-bs-target="#character-tab-pane" type="button" role="tab" aria-controls="character-tab-pane" aria-selected="true">Characters</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="item-tab" data-bs-toggle="tab" data-bs-target="#item-tab-pane" type="button" role="tab" aria-controls="item-tab-pane" aria-selected="false">Items</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Decks</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-tab-pane" type="button" role="tab" aria-controls="map-tab-pane" aria-selected="false">Scenarios</button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <CharactersTab />
          <ItemsTab />
          <DecksTab />
          <ScenariosTab />
        </div>
        <div className="mb-3">
          <label htmlFor="gameNotes" className="form-label">Notes</label>
          <textarea className="form-control" id="gameNotes" rows="3"></textarea>
        </div>
        <div className="container text-center mb-3">
          <button type="button" className="btn btn-primary">Export<a id="exportFile"></a></button>
          <button type="button" className="btn btn-primary">Import</button>
          <button type="button" className="btn btn-danger">Clear Data</button>
        </div>
      </div>
    </>
  );
}
