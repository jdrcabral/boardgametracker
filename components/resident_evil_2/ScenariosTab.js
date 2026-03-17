
export default function ScenariosTab() {
  return (
    <div className="tab-pane fade" id="map-tab-pane" role="tabpanel" aria-labelledby="map-tab" tabIndex="0">
      <h3>Scenarios</h3>
      <div className="container">
        <div className="table-responsive">
          <table className="table" id="scenariosTable" style={{overflowX: 'auto'}}>
            <thead>
              <tr>
                <th scope="col">Location</th>
                <th scope="col">Unlocked</th>
                <th scope="col">Completed</th>
                <th scope="col">Locked By</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
