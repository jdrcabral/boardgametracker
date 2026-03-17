
import Head from 'next/head';
import CharacterCard from '../../components/dark_souls/CharacterCard';

export default function DarkSoulsPage() {
  return (
    <>
      <Head>
        <title>Dark Souls - Board Game Campaign Tracker</title>
        <meta name="description" content="Board Game Campaign Tracker is a tool to help you track of your Dark Souls campaigns" />
        <meta name="keywords" content="board, game, campaign, tracker, dark, souls" />
      </Head>

      <div className="container">
        <h1>Dark Souls</h1>
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
        <hr />
        <div className="container">
            <div className="row">
                <div className="col-xs-6 col-sm-4 col-md-2">
                    <label htmlFor="souls" className="col-form-label">Souls</label>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-2">
                    <input className="form-control" id="souls" type="number" />
                </div>
                <div className="col-xs-6 col-sm-4 col-md-2">
                    <label htmlFor="sparks" className="col-form-label">Sparks</label>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-2">
                    <input className="form-control" id="sparks" type="number" />
                </div>
            </div>
        </div>
        <hr />
        <h3>Characters</h3>
        <div className="container">
          <div className="row">
            {[1, 2, 3, 4].map(characterNumber => (
              <CharacterCard key={characterNumber} characterNumber={characterNumber} />
            ))}
          </div>
        </div>
        <hr />
        <h3>Inventory</h3>
        <div className="row">
            <div className="col">
                <select className="form-select" aria-label="Campaign Select" id="itemSelect">
                    <option>Select Item</option>
                </select>
            </div>
            <div className="col mb-3">
                <button type="button" className="btn btn-primary">Add Item</button>
            </div>
          </div>
            <div className="row" id="itemsContainer">

            </div>
        <hr />
        <h3>Campaign</h3>
        <div className="container">
            <div className="row">
                <div className="col">
                    <select className="form-select" aria-label="Campaign Select" id="scenarioSelect">
                        <option>Campaign</option>
                    </select>
                </div>
                <div className="col mb-3">
                    <button type="button" className="btn btn-primary">Add Scenario</button>
                </div>
              </div>
            <div className="row" id="scenariosContainer">

            </div>
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
