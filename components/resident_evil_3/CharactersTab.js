
import CharacterCard from './CharacterCard';

export default function CharactersTab() {
  return (
    <div className="tab-pane fade show active" id="character-tab-pane" role="tabpanel" aria-labelledby="character-tab" tabIndex="0">
      <h3>Characters</h3>
      <div className="container">
        <div className="row">
          {[1, 2, 3, 4].map(characterNumber => (
            <CharacterCard key={characterNumber} characterNumber={characterNumber} />
          ))}
        </div>
      </div>
      <hr />
      <h3>Reserve</h3>
      <div className="container">
        <table className="table" id="reserveCharacters">
          <thead>
            <tr>
              <th scope="col">Character</th>
              <th scope="col">Unlocked</th>
              <th scope="col">Dead</th>
              <th scope="col">Health Tracker</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </div>
  );
}
