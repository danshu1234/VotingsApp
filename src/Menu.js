import { useEffect, useState } from "react";
import VotingsList from "./VotingsList.js";
import SearchVoting from "./SearchVoting.js";
import './Menu.css';

const Menu = (props) => {
  const [myVotings, setMyVotings] = useState([]);
  let myVotingsList;

  if (myVotings.length === 0) {
    myVotingsList = <h3>Вы пока не опубликовали ни одного голосования</h3>;
  } else {
    myVotingsList = <VotingsList myVotings={myVotings} setVotingObj={props.setVotingObj} />;
  }

  const getThisVotings = async (userId) => {
    const getVotings = await fetch('http://localhost:4444/get/votings', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    const resPosts = await getVotings.json();
    if (resPosts.response !== 'Нет постов') {
      setMyVotings(resPosts.response);
    }
  };

  useEffect(() => {
    const getStorage = localStorage.getItem('userId');
    if (getStorage) {
      getThisVotings(getStorage);
    } else {
      const date = new Date();
      const uniqueId = date.getTime().toString();
      localStorage.setItem('userId', uniqueId);
    }
  }, []);

  return (
    <div className="Menu">
      <SearchVoting setVotingObj={props.setVotingObj} />
      {myVotingsList}
      <button onClick={() => props.setShow('create')}>Создать голосование</button>
    </div>
  );
};

export default Menu;