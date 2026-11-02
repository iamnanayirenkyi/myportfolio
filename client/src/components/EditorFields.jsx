import { useId } from 'react';

export function TextField({ label, value, onChange, multiline = false, type = 'text', placeholder = '' }) {
  const fieldId = useId();
  return (
    <div className="fieldGroup">
      <label htmlFor={fieldId}>{label}</label>
      {multiline ? (
        <textarea id={fieldId} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={fieldId} type={type} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function ChoiceField({ label, value, options, onChange }) {
  return (
    <div className="fieldGroup">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

/* Edits a list of items. `fields` says which inputs each item shows. */
export function ListEditor({ items, onChange, fields, blankItem, itemName }) {
  function changeItem(position, key, newValue) {
    onChange(items.map((item, spot) => (spot === position ? { ...item, [key]: newValue } : item)));
  }
  function removeItem(position) {
    onChange(items.filter((_, spot) => spot !== position));
  }
  function moveItem(position, step) {
    const target = position + step;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[position], reordered[target]] = [reordered[target], reordered[position]];
    onChange(reordered);
  }

  return (
    <div>
      {items.map((item, position) => (
        <div className="listItemBox" key={position}>
          <div className="listItemHead">
            <span>{itemName} {position + 1}</span>
            <span>
              <button type="button" className="smallButton" onClick={() => moveItem(position, -1)} aria-label="Move up">&uarr;</button>{' '}
              <button type="button" className="smallButton" onClick={() => moveItem(position, 1)} aria-label="Move down">&darr;</button>{' '}
              <button type="button" className="smallButton smallButtonDanger" onClick={() => removeItem(position)}>Remove</button>
            </span>
          </div>
          {fields.map((field) =>
            field.choices ? (
              <ChoiceField key={field.key} label={field.label} value={item[field.key]} options={field.choices} onChange={(v) => changeItem(position, field.key, v)} />
            ) : (
              <TextField key={field.key} label={field.label} value={item[field.key]} multiline={field.multiline} type={field.type} placeholder={field.placeholder} onChange={(v) => changeItem(position, field.key, v)} />
            )
          )}
        </div>
      ))}
      <button type="button" className="smallButton" onClick={() => onChange([...items, { ...blankItem }])}>
        + Add {itemName.toLowerCase()}
      </button>
    </div>
  );
}
