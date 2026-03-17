
export default function ItemsTab() {
  return (
    <div className="tab-pane fade" id="item-tab-pane" role="tabpanel" aria-labelledby="item-tab" tabIndex="0">
      <h3>Item Box</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="itemSelect">
              <option>Select Item</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Item</button>
          </div>
        </div>
        <div className="row" id="itemBox"></div>
      </div>
      <hr />
      <h3>Item A Deck</h3>
      <div className="container">
        <div className="row">
          <div className="col">
            <select className="form-select" aria-label="Item Select" id="itemASelect">
              <option>Select Item</option>
            </select>
          </div>
          <div className="col mb-3">
            <button type="button" className="btn btn-primary">Add Item</button>
          </div>
        </div>
        <div className="row" id="itemADeck"></div>
      </div>
      <hr />
    </div>
  );
}
