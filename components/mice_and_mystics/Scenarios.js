
export default function Scenarios({ scenarios }) {
  return (
    <div className="container">
        <div className="table-responsive">
            <table className="table" style={{overflowX: 'auto'}}>
                <thead>
                    <tr>
                        <th scope="col">Chapter</th>
                        <th scope="col">Name</th>
                        <th scope="col">Completed</th>
                        <th scope="col">Game</th>
                    </tr>
                </thead>
                <tbody>
                    {/* We will map over the scenarios here */}
                </tbody>
            </table>
        </div>
    </div>
  );
}
