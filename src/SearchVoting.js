import { useState } from "react";
import './SearchVoting.css';

const SearchVoting = (props) => {
  const [codeInput, setCodeInput] = useState('');
  const [undefWarn, setUndefWarn] = useState('');

  const searchVoting = async () => {
    const findVoting = await fetch('http://localhost:4444/find/voting', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codeInput }),
    });
    const resultFindVoting = await findVoting.json();
    if (resultFindVoting.response === 'undefined') {
      setUndefWarn('Голосование не найдено');
    } else {
      props.setVotingObj(resultFindVoting.response);
    }
  };

  return (
    <div className="SearchVoting">
      <input placeholder="Код голосования" onChange={(event) => {
        setCodeInput(event.target.value);
        setUndefWarn('');
      }} />
      <button onClick={searchVoting}>Найти голосование</button>
      <p>{undefWarn}</p>
    </div>
  );
};

export default SearchVoting;