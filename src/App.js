import React, { useEffect, useState } from 'react';
import Menu from './Menu.js';
import CreateVoting from './CreateVoting.js';
import VotingPage from './VotingPage.js';
import './App.css';

const App = () => {
  const [votingObj, setVotingObj] = useState(null);
  const [show, setShow] = useState('menu');
  let interArr;

  useEffect(() => {
    if (votingObj !== null) {
      setShow('voting');
    }
  }, [votingObj]);

  if (show === 'menu') {
    interArr = <Menu setShow={setShow} setVotingObj={setVotingObj} />;
  } else if (show === 'create') {
    interArr = <CreateVoting setShow={setShow} />;
  } else if (show === 'voting') {
    interArr = <VotingPage votingObj={votingObj} setVotingObj={setVotingObj} setShow={setShow} />;
  }

  return (
    <div className="App">
      <div className="App-header">
        <h1>VotingsApp</h1>
      </div>
      <div className="App-content">
        {interArr}
      </div>
    </div>
  );
};

export default App;