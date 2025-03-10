import React, { useEffect, useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './VotingPage.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const VotingPage = (props) => {
  const [namesOfOptions, setNamesOfOptions] = useState([]);
  const [countsOfOptions, setCountsOfOptions] = useState([]);
  const [optinosOrNot, setOptionsorNot] = useState(null);
  let options;
  let chart;

  const data = {
    labels: namesOfOptions,
    datasets: [
      {
        label: 'Голоса',
        data: countsOfOptions,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
          'rgba(40, 167, 69, 0.6)',
          'rgba(220, 53, 69, 0.6)',
        ],
        borderColor: 'black',
        borderWidth: 1,
      },
    ],
  };

  const optionsChart = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Результаты голосования',
      },
    },
  };

  if (namesOfOptions.length !== 0 && countsOfOptions.every(el => el === 0) === false) {
    chart = <div className="chart-container"><Doughnut data={data} options={optionsChart} /></div>;
  }

  const addVoting = async (opt) => {
    const thisUserId = localStorage.getItem('userId');
    const newOptions = props.votingObj.options.map((el) => {
      if (el.option === opt) {
        return {
          option: el.option,
          count: el.count + 1,
        };
      } else {
        return el;
      }
    });
    const newVotingObj = {
      userId: props.votingObj.userId,
      postId: props.votingObj.postId,
      name: props.votingObj.name,
      description: props.votingObj.description,
      votings: [...props.votingObj.votings, { usId: thisUserId }],
      options: newOptions,
    };
    props.setVotingObj(newVotingObj);
    const votingId = props.votingObj.postId;
    const newVotingsList = [...props.votingObj.votings, { usId: thisUserId }];
    const updateThisVoting = await fetch('http://localhost:4444/update/post', {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ votingId, newVotingsList, newOptions }),
    });
    setOptionsorNot('no');
    const resultUpdate = await updateThisVoting.json();
    console.log(resultUpdate.response);
  };

  if (optinosOrNot === 'no') {
    options = <h2>Вы уже проголосовали в этом опросе</h2>;
  } else if (optinosOrNot === 'yes') {
    options = (
      <div>
        <h3>Варианты: </h3>
        <ul>
          {props.votingObj.options.map((item, index) => (
            <li key={index} onClick={() => addVoting(item.option)}>
              {item.option}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  useEffect(() => {
    const thisUserId = localStorage.getItem('userId');
    const findThisUser = props.votingObj.votings.find((el) => el.usId === thisUserId);
    if (findThisUser === undefined) {
      setOptionsorNot('yes');
    } else {
      setOptionsorNot('no');
    }
    const options = props.votingObj.options.map((el) => el.option);
    const counts = props.votingObj.options.map((el) => el.count);
    setNamesOfOptions(options);
    setCountsOfOptions(counts);
  }, [props.votingObj]);

  const findThisPost = async () => {
    const postId = props.votingObj.postId;
    const getThisPost = await fetch('http://localhost:4444/find/post', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });
    const resultObj = await getThisPost.json();
    if (resultObj.response.votings.length !== props.votingObj.votings.length) {
      props.setVotingObj(resultObj.response);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('update');
      findThisPost();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="VotingPage">
      <button onClick={() => props.setShow('menu')}>Назад</button>
      <h1>Поделитесь этим голосованием: {props.votingObj.postId}</h1>
      <h2>{props.votingObj.name}</h2>
      <p>{props.votingObj.description}</p>
      {chart}
      <h3>Количество проголосовавших: {props.votingObj.votings.length}</h3>
      {options}
    </div>
  );
};

export default VotingPage;