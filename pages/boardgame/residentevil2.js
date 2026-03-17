
import Head from 'next/head';
import CharactersTab from '../../components/resident_evil_2/CharactersTab';
import ScenariosTab from '../../components/resident_evil_2/ScenariosTab';

export default function ResidentEvil2Page() {
  return (
    <>
      <Head>
        <title>Resident Evil 2 - Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your Resident Evil 2 campaigns" />
        <meta name="keywords" content="board, game, campaign, tracker, resident, evil, 2" />
      </Head>

      <div className="container">
        <h1>Resident Evil 2: The Board Game</h1>
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
        <hr />
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="character-tab" data-bs-toggle="tab" data-bs-target="#character-tab-pane" type="button" role="tab" aria-controls="character-tab-pane" aria-selected="true">Characters</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-tab-pane" type="button" role="tab" aria-controls="map-tab-pane" aria-selected="false">Scenarios</button>
          </li>
        </ul>
        <hr />
        <div className="tab-content" id="myTabContent">
          <CharactersTab />
          <ScenariosTab />
        </div>
        <hr />
        <div className="mb-3">
          <label htmlFor="gameNotes" className="form-label">Notes</label>
          <textarea className="form-control" id="gameNotes" rows="3"></textarea>
        </div>
        <div className="container text-center mb-3">
          <button type="button" className="btn btn-primary">Export <a id="exportFile"></a>
          </button>
          <button type="button" className="btn btn-primary">Import</button>
          <button type="button" className="btn btn-danger">Clear Data</button>
        </div>
      </div>
    </>
  );
}
