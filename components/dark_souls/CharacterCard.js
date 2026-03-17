
export default function CharacterCard({ characterNumber }) {
  const cardId = `character${characterNumber}`;

  return (
    <div className="col-md-6 col-xs-12 mt-3">
        <div className="card" style={{ height: '30rem', overflowY: 'auto' }}>
            <div className="card-body">
                <select className="form-select mb-3" aria-label={`Character Select ${characterNumber}`} id={`characterSelect${characterNumber}`}>
                    <option>Select Class</option>
                </select>
                <h5>Tokens</h5>
                <div className="row">
                    <div className="col"><div className="form-check"><input className="form-check-input" type="checkbox" value="" id={`emberCharacter${characterNumber}`} /><label className="form-check-label" htmlFor={`emberCharacter${characterNumber}`}>Ember Token</label></div></div>
                    <div className="col"><div className="form-check"><input className="form-check-input" type="checkbox" value="" id={`estusCharacter${characterNumber}`} /><label className="form-check-label" htmlFor={`estusCharacter${characterNumber}`}>Estus</label></div></div>
                    <div className="col"><div className="form-check"><input className="form-check-input" type="checkbox" value="" id={`heroicActionCharacter${characterNumber}`} /><label className="form-check-label" htmlFor={`heroicActionCharacter${characterNumber}`}>Heroic Action</label></div></div>
                    <div className="col"><div className="form-check"><input className="form-check-input" type="checkbox" value="" id={`luckCharacter${characterNumber}`} /><label className="form-check-label" htmlFor={`luckCharacter${characterNumber}`}>Luck</label></div></div>
                </div>
                <h5 className="mt-3">Equip</h5>
                <div className="row"><div className="col-sm-6 col-md-4"><label htmlFor={`character${characterNumber}LeftHandSelect`} className="form-label">Left Hand</label></div><div className="col"><select className="form-select" id={`character${characterNumber}LeftHandSelect`}><option value="">Weapon/Shield/Spell</option></select></div></div>
                <div className="row mt-2"><div className="col-sm-6 col-md-3"><label htmlFor={`character${characterNumber}LeftHandNotes`} className="form-label">Notes</label></div><div className="col-sm-6 col-md-9"><input className="form-control" id={`character${characterNumber}LeftHandNotes`} /></div></div>
                <hr />
                <div className="row"><div className="col-sm-6 col-md-4"><label htmlFor={`character${characterNumber}RightHandSelect`} className="form-label">Right Hand</label></div><div className="col"><select className="form-select" id={`character${characterNumber}RightHandSelect`}><option value="">Weapon/Shield/Spell</option></select></div></div>
                <div className="row mt-2"><div className="row mt-2"><div className="col-sm-6 col-md-3"><label htmlFor={`character${characterNumber}RightHandNotes`} className="form-label">Notes</label></div><div className="col-sm-6 col-md-9"><input className="form-control" id={`character${characterNumber}RightHandNotes`} /></div></div></div>
                <hr />
                <div className="row"><div className="col-sm-6 col-md-4"><label htmlFor={`character${characterNumber}ArmorSelect`} className="form-label">Armor</label></div><div className="col"><select className="form-select" id={`character${characterNumber}ArmorSelect`}><option value="">Armor</option></select></div></div>
                <div className="row mt-2"><div className="row mt-2"><div className="col-sm-6 col-md-3"><label htmlFor={`character${characterNumber}ArmorNotes`} className="form-label">Notes</label></div><div className="col-sm-6 col-md-9"><input className="form-control" id={`character${characterNumber}ArmorNotes`} /></div></div></div>
                <hr />
                <div className="row"><div className="col-sm-6 col-md-4"><label htmlFor={`character${characterNumber}BeltSelect`} className="form-label">Belt</label></div><div className="col"><select className="form-select" id={`character${characterNumber}BeltSelect`}><option value="">Weapon/Shield/Spell</option></select></div></div>
                <div className="row mt-2"><div className="row mt-2"><div className="col-sm-6 col-md-3"><label htmlFor={`character${characterNumber}BeltNotes`} className="form-label">Notes</label></div><div className="col-sm-6 col-md-9"><input className="form-control" id={`character${characterNumber}BeltNotes`} /></div></div></div>
                <hr />
                <h5 className="mt-3">Status</h5>
                <div className="row mb-3"><div className="col-sm-3 col-md-4"><label htmlFor={`characterStrength${characterNumber}`} className="form-label">Strength</label></div><div className="col-sm-3 col-md-3"><input type="number" min="1" max="10" className="form-control" id={`characterStrength${characterNumber}`} disabled readOnly /></div><div className="col-sm-3 col-md-5"><select className="form-select" id={`characterStrengthSelect${characterNumber}`}><option value="0">Base</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option></select></div></div>
                <div className="row mb-3"><div className="col-sm-3 col-md-4"><label htmlFor={`characterDexterity${characterNumber}`} className="form-label">Dexterity</label></div><div className="col-sm-3 col-md-3"><input type="number" min="1" max="10" className="form-control" id={`characterDexterity${characterNumber}`} disabled readOnly /></div><div className="col-sm-3 col-md-5"><select className="form-select" id={`characterDexteritySelect${characterNumber}`}><option value="0">Base</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option></select></div></div>
                <div className="row mb-3"><div className="col-sm-3 col-md-4"><label htmlFor={`characterIntelligence${characterNumber}`} className="form-label">Intelligence</label></div><div className="col-sm-3 col-md-3"><input type="number" min="1" max="10" className="form-control" id={`characterIntelligence${characterNumber}`} disabled readOnly /></div><div className="col-sm-3 col-md-5"><select className="form-select" id={`characterIntelligenceSelect${characterNumber}`}><option value="0">Base</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option></select></div></div>
                <div className="row"><div className="col-sm-3 col-md-4"><label htmlFor={`characterFaith${characterNumber}`} className="form-label">Faith</label></div><div className="col-sm-3 col-md-3"><input type="number" min="1" max="10" className="form-control" id={`characterFaith${characterNumber}`} disabled readOnly /></div><div className="col-sm-3 col-md-5"><select className="form-select" id={`characterFaithSelect${characterNumber}`}><option value="0">Base</option><option value="1">Tier 1</option><option value="2">Tier 2</option><option value="3">Tier 3</option></select></div></div>
            </div>
        </div>
    </div>
  );
}
