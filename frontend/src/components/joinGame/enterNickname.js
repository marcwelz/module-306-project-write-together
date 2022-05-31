import './style.css';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function EnterNickname () {
  const {gamecode} = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    if(checkGameAvailability()) {
      setErrorMessage("Game not found")
    } else if (containsAnyLetter(gamecode)) {
      setErrorMessage("Gamecode invalid")
    }
  }, [])

  function checkGameAvailability() {
    fetch("http://localhost/m306_faltgeschichten/backend/api/getLobby.php?lobbyid=" + gamecode)
        .then(result => {
          if (result.status === 404) return false;
          console.log("valid")
          return true;
        })
        .catch(error => {
          console.log(error, "error")
        })

    return false;
  }

  function handleSubmit(event) {
    navigate("/lobby/game=" + gamecode + "&username=" + username)
  }

  return (
    <div className="main">
      <div className="main-container">
          <h3>Your code: {gamecode}</h3>
          <h6>{errorMessage}</h6>
          <div className="main-container-form">
            <div className='main-container-form__input'>
              <input type="text" onChange={e => setUsername(e.target.value)} placeholder="Enter nickname..." ></input>
              <input type="button" onClick={e => handleSubmit(e)} value="Go"></input>
            </div>
          </div>
      </div>
    </div>
  );

  function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
}

export default EnterNickname;
