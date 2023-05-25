import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { BiMicrophone, BiMicrophoneOff, BiMap } from "react-icons/bi"
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     position: 'relative',
//     marginTop: theme.spacing(2),
//   },
//   button: {
//     marginTop: theme.spacing(2),
//   },
// }));

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [stot, setStot] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [latitude,setLat] = useState(null)
  const [longitude,setLng] = useState(null)

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  const [listening, setListening] = useState(false);

  const startRecognition = () => {
    var recognition = new window.webkitSpeechRecognition();
    setStot(recognition)
    recognition.lang = 'en-us';
    recognition.start();
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMsg(transcript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const stopRecognition = () => {
    stot.stop();
    setListening(false);
  };

  const handlelocation = () =>{
    navigator.geolocation.getCurrentPosition(function(position) { 
      setMsg( `http://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`)
    });
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <div className="speechtotext">
          <IconButton
            color={listening ? 'secondary' : 'primary'}
            onClick={listening ? stopRecognition : startRecognition}
            className="emoji"
          >
            {listening ? <BiMicrophoneOff /> : <BiMicrophone />}
          </IconButton>
        </div>
        <div className="emoji">
            <BiMap 
              onClick={handlelocation} />
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`

  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #394867;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #FFFFFF;
        cursor: pointer;
      }
      .emoji-picker-react {
        position: absolute;
        top: -350px;
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
        .emoji-scroll-wrapper::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
          &-thumb {
            background-color: #9a86f3;
          }
        }
        .emoji-categories {
          button {
            filter: contrast(0);
          }
        }
        .emoji-search {
          background-color: transparent;
          border-color: #9a86f3;
        }
        .emoji-group:before {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 85%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 6rem;
    background-color: black;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 3rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      padding-left: 2rem;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 0.9rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
