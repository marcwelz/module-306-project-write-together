import './style.css';
import {useParams, useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {standard_url} from "../../config/global_configurations";
import applicationProperties from "../../config/application-properties.json"

function EnterNickname() {
    const {gamecode, create} = useParams();
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("")
    const navigate = useNavigate();

    useEffect(() => {

        if (!create) {
            if (checkGameAvailability()) {
                setErrorMessage("Game not found")
            } else if (containsAnyLetter(gamecode)) {
                setErrorMessage("Gamecode invalid")
            }
        }


    }, [])

    function checkGameAvailability() {
        if(!applicationProperties.development) {
            fetch(standard_url + "/lobby.php?lobbyid=" + gamecode)
            .then(result => {
                if (result.status === 404) {
                    navigate("/");
                    return false;
                }
                return true;
            })
            .catch(error => {
                console.log(error, "error")
            })

        return false;
        } else {
            return true;
        }
    }

    function handleSubmit() {
        if(!applicationProperties.development) {
            if (create === '1'){

                const requestOptions = {
                    method: 'POST'
                };
                fetch(standard_url + "/lobby.php?lobbyid=" + gamecode + "&username=" + username, requestOptions)
                    .then(r => navigate("/lobby/game=" + gamecode + "&username=" + username))
            } else {
    
                const requestOptions = {
                    method: 'POST',
                    // headers: { 'Content-Type': 'application/json' },
                    // body: JSON.stringify({ title: 'React POST Request Example' })
                };
                fetch(standard_url + "/users.php?lobbyid=" + gamecode + "&username=" + username, requestOptions)
                    .then(r => navigate("/lobby/game=" + gamecode + "&username=" + username))
            }
        } else {
            navigate("/lobby/game=" + gamecode + "&username=" + username)
        }
    }

  return (
    <div className="main">
      <div className="main-container">
          <h3>Your code: {gamecode}</h3>
          <h6>{errorMessage}</h6>
          <div className="main-container-form">
            <div className='main-container-form__input'>
              {errorMessage ?
                <button
                  className="button-9"
                  style={{backgroundColor: "#eb4034", marginRight:"10px"}}
                  onClick={() => navigate("/")}
                  value="cancel">
                cancel</button> :
                <input type="text"
                  onChange={e => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Enter nickname..." >
                </input>
              }
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
