
import Head from 'next/head';
import CharactersTab from '../../components/resident_evil/CharactersTab';
import ItemsTab from '../../components/resident_evil/ItemsTab';
import DecksTab from '../../components/resident_evil/DecksTab';
import MapTab from '../../components/resident_evil/MapTab';

export default function ResidentEvilPage() {
  return (
    <>
      <Head>
        <title>Resident Evil - Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your Resident Evil campaigns" />
        <meta name="keywords" content="board, game, campaign, tracker, resident, evil" />
      </Head>

      <div className="container">
        <h1>Resident Evil: The Board Game</h1>
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
        <div className="container mt-3 mb-3">
          <h3>Threat Level</h3>
          <input type="number" className="form-control" id="threatLevel" min="0" max="22" />
        </div>
        <hr />
        <div className="modal fade" id="mapModal" tabIndex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 id="modalTitle"></h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p id="modalExtraInfo"></p>
                <div className="d-grid gap-2 d-md-block">
                  <button className="btn btn-primary" data-bs-dismiss="modal" type="button">Reveal <i className="bi bi-eye"></i>
                  </button>
                  <button className="btn btn-success" data-bs-dismiss="modal" type="button">Complete <i className="bi bi-check2-circle"></i>
                  </button>
                  <button className="btn btn-secondary" id="unlockButton" data-bs-dismiss="modal" type="button">Unlock <i className="bi bi-unlock"></i>
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
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
            <button className="nav-link" id="map-tab" data-bs-toggle="tab" data-bs-target="#map-tab-pane" type="button" role="tab" aria-controls="map-tab-pane" aria-selected="false">Mansion Map</button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <CharactersTab />
          <ItemsTab />
          <DecksTab />
          <MapTab />
        </div>
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
