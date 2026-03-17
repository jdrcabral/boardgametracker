
export default function CharacterCard({ characterNumber }) {
  return (
    <div className="col-md-3 col-xs-12">
      <div className="card">
        <div className="card-body">
          <select className="form-select" aria-label={`Character Select ${characterNumber}`} id={`characterSelect${characterNumber}`}>
            <option>Select Character</option>
          </select>
          <label htmlFor={`characterHealth${characterNumber}`} className="form-label">Health</label>
          <input type="number" min="1" max="5" className="form-control" id={`characterHealth${characterNumber}`} />
          <h5 className="mt-3">Inventory</h5>
          <div className="row">
            <div className="col">
              <select className="form-select" aria-label={`Character ${characterNumber} Item Select`} id={`character${characterNumber}ItemSelect`}>
                <option>Select Item</option>
              </select>
            </div>
            <div className="col mb-3">
              <button type="button" className="btn btn-primary">Add Item</button>
            </div>
          </div>
          <ul className="list-group" id={`character${characterNumber}InventoryList`}></ul>
        </div>
      </div>
    </div>
  );
}
