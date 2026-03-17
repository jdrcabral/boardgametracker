
export default function CharacterCard({ character }) {
  return (
    <div className="col-md-3 col-xs-12 mb-3">
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{character.name}</h5>
                {/* We will add the rest of the character details here in the next steps */}
            </div>
        </div>
    </div>
  );
}
