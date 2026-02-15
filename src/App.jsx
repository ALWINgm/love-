import { useState } from 'react';
import './App.css';
import confetti from 'canvas-confetti';

function App() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const yesButtonSize = noCount * 20 + 16;

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really sure?",
      "Please be my girlfriend",
      "Don't do this to me",
      "I'm gonna cry...",
      "You're breaking my heart ;(",
      "Please be my girlfriend",
      "Pretty please?",
      "Please be my girlfriend",
      "No isn't an option",
    ];

    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const handleYesClick = () => {
    setYesPressed(true);
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="valentine-container">
      {yesPressed ? (
        <div className="yes-container">
          <img
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
            alt="bears kissing"
            className="bear-img"
          />
          <div className="text-container">Yay!!! 💖</div>
        </div>
      ) : (
        <>
          <img
            className="bear-img"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
            alt="bears with roses"
          />
          <h1 className="text-container">Will you be my girlfriend?</h1>
          <div className="button-container">
            <button
              className="yes-button"
              style={{ fontSize: yesButtonSize }}
              onClick={handleYesClick}
            >
              Yes
            </button>
            <button
              onClick={handleNoClick}
              className="no-button"
            >
              {noCount === 0 ? "No" : getNoButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
