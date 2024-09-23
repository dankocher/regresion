import React, {useEffect, useState} from "react";
import { SimpleLinearRegression } from 'ml-regression';

const x = [12500, 12000];
const y = [1086684160, 1086748160];

const generateValues = () => {
  return x.map((value, i) => {
    return {id: value, value, encrypted: y[i]}
  })
}


export default function App() {
  // const [inputList, setInputList] = useState(generateValues());
    const [inputList, setInputList] = useState(() => {
        const saved =
            typeof window !== 'undefined'
                ? JSON.parse(localStorage.getItem('inputList'))
                : null;
        return saved || generateValues();
    });

    useEffect(() => {
        typeof window !== 'undefined' &&
        localStorage.setItem('inputList', JSON.stringify(inputList));
    }, [inputList]);
  const [value, setValue] = useState("");
  const [encrypted, setEncrypted] = useState("");

  useEffect(() => {
    if (!isNaN(value) && value > 0) {
      let x = inputList.map(item => item.value);
      let y = inputList.map(item => item.encrypted);
      const regression = new SimpleLinearRegression(x, y);

// Ahora puede predecir un valor "y" basado en un valor "x":
      let newY = regression.predict(value); // predecir "y" para newX

      setEncrypted(newY)
    }
  }, [value]);

  // handle input change
  const handleInputChange = (e, index) => {
    const {name, value} = e.target;
    const list = [...inputList];
    list[index][name] = parseInt(value.split(" ").join(""));
    setInputList(list);
  };

  // handle add button click event
  const handleAddClick = (index) => {
    const list = [...inputList];
    const newItem = {id: Date.now(), value: "", encrypted: ""};
    if (index >= list.length - 1) {
      list.push(newItem); // append at the end if index is the last one or beyond
    } else {
      list.splice(index + 1, 0, newItem); // insert after the specified index
    }

    setInputList(list);
  };
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const saveCurrentValue = () => {
      const list = [...inputList];
      const isValueExists = list.some(item => item.value === parseInt(value));

      if (!isValueExists) {
          const newItem = {id: Date.now(), value: parseInt(value), encrypted: parseInt(encrypted)};
          const newList = [newItem, ...list].sort((a, b) => b.value - a.value);
          setInputList(newList);
          setValue("")
      } else {
          alert("This value already exists in the list");
      }
  }

  return (
      <div className="App">
        {inputList.map((item, i) => {
          return (
              <div key={`${item.id}`}>
                <input
                    name="value"
                    placeholder="Value"
                    value={item.value.toLocaleString('en-US', {maximumFractionDigits: 0}).split(',').join(' ')}
                    onChange={e => handleInputChange(e, i)}
                />
                <input
                    name="encrypted"
                    placeholder="Encrypted"
                    // value={item.encrypted}
                    value={item.encrypted.toLocaleString('en-US', {maximumFractionDigits: 0}).split(',').join(' ')}
                    onChange={e => handleInputChange(e, i)}
                />
                <button onClick={() => handleAddClick(i)}>Add</button>
                <button onClick={() => handleRemoveClick(i)}>Remove</button>
              </div>
          );
        })}
        <hr/>

        <div>
          <input
              name="value"
              placeholder="Value"
              value={!isNaN(value) ? value.toLocaleString('en-US', {maximumFractionDigits: 0}).split(',').join(' ') : ""}
              onChange={e => setValue(parseInt(e.target.value.split(" ").join("")))}
          />
          <input
              name="encrypted"
              placeholder="Encrypted"
              value={encrypted.toLocaleString('en-US', {maximumFractionDigits: 0}).split(',').join(' ')}
              onChange={e => setEncrypted(e.target.value.split(" ").join(""))}
          />
          <button onClick={saveCurrentValue}>Save</button>
        </div>
      </div>
  )
}
