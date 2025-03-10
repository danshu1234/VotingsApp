import { useEffect, useState } from "react";
import './CreateVoting.css';

const CreateVoting = (props) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [options, setOptions] = useState([]);
  const [optionInput, setOptionInput] = useState('');
  const [resultSave, setResultSave] = useState('');
  let optionsList;
  let addOptionComponent;

  const addOption = () => {
    if (optionInput !== '') {
      const findSameOption = options.find((el) => el.option === optionInput);
      if (findSameOption === undefined) {
        setOptions([
          ...options,
          {
            option: optionInput,
            count: 0,
          },
        ]);
        setOptionInput('');
      } else {
        console.log('Вы уже добавляли этот вариант ранее');
      }
    }
  };

  if (options.length < 11) {
    addOptionComponent = (
      <div>
        <input value={optionInput} placeholder="Add option" onChange={(event) => setOptionInput(event.target.value)} /><br />
        <button onClick={addOption}>Add option</button><br />
      </div>
    );
  }

  if (options.length !== 0) {
    optionsList = (
      <ul>
        {options.map((item, index) => (
          <p key={index}>{item.option}</p>
        ))}
      </ul>
    );
  }

  const saveVoting = async () => {
    const userId = localStorage.getItem('userId');
    const date = new Date();
    const randomPostId = date.getTime().toString();
    if (name !== '' && desc !== '' && options.length > 1) {
      const resultVotingPost = {
        userId: userId,
        postId: randomPostId,
        name: name,
        description: desc,
        votings: [],
        options: options,
      };
      const addPostReq = await fetch('http://localhost:4444/create/voting', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resultVotingPost }),
      });
      const saveResponse = await addPostReq.json();
      setResultSave(saveResponse.response);
    } else {
      console.log('Пожалуйста, заполните все поля и добавьте хотя бы 2 варианта ответа');
    }
  };

  useEffect(() => {
    if (resultSave !== '') {
      setTimeout(() => {
        props.setShow('menu');
      }, 1500);
    }
  }, [resultSave]);

  return (
    <div className="CreateVoting">
      <input placeholder="name of voting" onChange={(event) => setName(event.target.value)} /><br />
      <textarea placeholder="description of voting" onChange={(event) => setDesc(event.target.value)} /><br />
      {optionsList}<br />
      {addOptionComponent}
      <button onClick={saveVoting}>Сохранить голосование</button>
      <h2>{resultSave}</h2>
    </div>
  );
};

export default CreateVoting;