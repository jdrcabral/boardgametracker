
export default function DecksTab() {
  return (
    <div className="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex="0">
      <h3>Tension Deck</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="tensionCardSelect">
              <option>Select Tension Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Tension Card</button>
          </div>
        </div>
        <div className="row" id="tensionDeck"></div>
      </div>
      <hr />
      <h3>Removed Tension Card</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="removedTensionCardSelect">
              <option>Select Tension Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Tension Card</button>
          </div>
        </div>
        <div className="row" id="removedTensionDeck"></div>
      </div>
      <hr />
      <h3>Played Narratives</h3>
      <div className="container">
        <p>Add the played narratives that are removed from the game</p>
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="narrativeCardSelect">
              <option>Select Narrative Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Narrative Card</button>
          </div>
        </div>
        <div className="row" id="narrativeDeck"></div>
      </div>
      <hr />
      <h3>Added Narratives</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="addedNarrativeCardSelect">
              <option>Select Narrative Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Narrative Card</button>
          </div>
        </div>
        <div className="row" id="addedNarrativeDeck"></div>
      </div>
      <hr />
      <h3>Played Missions</h3>
      <div className="container">
        <p>Add the played missions that are removed from the game</p>
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="missionCardSelect">
              <option>Select Mission Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Mission Card</button>
          </div>
        </div>
        <div className="row" id="missionDeck"></div>
      </div>
      <h3>Added Missions</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="addedMissionCardSelect">
              <option>Select Mission Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Mission Card</button>
          </div>
        </div>
        <div className="row" id="addedMissionDeck"></div>
      </div>
      <hr />
      <h3>Encounters</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="encounterCardSelect">
              <option>Select Encounter Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Encounter Card</button>
          </div>
        </div>
        <div className="row" id="encounterDeck"></div>
      </div>
      <hr />
    </div>
  );
}
