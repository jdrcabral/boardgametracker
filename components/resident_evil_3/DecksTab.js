
export default function DecksTab() {
  return (
    <div className="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabIndex="0">
      <h3>Tension Deck</h3>
      <div className="alert alert-info" role="info">
        Add the current cards in tension deck
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Tension Card Select" id="tensionCardSelect">
              <option>Select Tension Card</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add</button>
          </div>
        </div>
        <div className="row" id="tensionDeck"></div>
      </div>
      <h3>Narrative Cards</h3>
      <div className="alert alert-info" role="info">
        Add the played narrative event cards
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Narrative Select" id="narrativeCardSelect">
              <option>Select Narrative</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add</button>
          </div>
        </div>
        <div className="row" id="narrativeDeck"></div>
      </div>
    </div>
  );
}
