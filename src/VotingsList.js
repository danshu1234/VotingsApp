import './VotingsList.css';

const VotingsList = (props) => {
  const findVotingPost = async (postId) => {
    const findPost = await fetch('http://localhost:4444/find/post', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId }),
    });
    const resultPost = await findPost.json();
    props.setVotingObj(resultPost.response);
  };

  return (
    <div className="VotingsList">
      <ul>
        {props.myVotings.map((item, index) => (
          <li key={index}>
            <div>
              <h2 onClick={() => findVotingPost(item.postId)}>{item.name}</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingsList;