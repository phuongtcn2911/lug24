export default function InfoLabel({children, layout, label}) {
    return (
        <div className={`column ${layout}`}>
            <div className="field">
                <label className="label has-text-left mb-0">{label}</label>
                <div className="control">
                    <p className="subtitle is-6 has-text-left">{children}</p>
                    {/* <input className="input is-static" type="text" placeholder="Text input" readOnly value={value}/> */}
                </div>
            </div>
        </div>
    );
}