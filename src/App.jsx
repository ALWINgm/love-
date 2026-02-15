import { useState, useEffect } from 'react';
import './App.css';
import confetti from 'canvas-confetti';

function App() {
  const [step, setStep] = useState('loading'); // loading, create, intro, proposal, accepted

  // Creator State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Recipient State
  const [recipientName, setRecipientName] = useState('');
  const [urlParams, setUrlParams] = useState({ sender: '', phone: '' });

  // Proposal State
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const yesButtonSize = noCount * 20 + 16;

  useEffect(() => {
    // Check URL params on mount
    const params = new URLSearchParams(window.location.search);
    const sender = params.get('sender');
    const phone = params.get('phone');
    const name = params.get('name'); // Optional pre-filled recipient name

    if (sender && phone) {
      setUrlParams({ sender, phone });
      if (name) {
        setRecipientName(name);
        setStep('proposal');
      } else {
        setStep('intro');
      }
    } else {
      setStep('create');
    }
  }, []);

  const handleGenerateLink = (e) => {
    e.preventDefault();
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?sender=${encodeURIComponent(senderName)}&phone=${encodeURIComponent(senderPhone)}`;
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const startProposal = (e) => {
    e.preventDefault();
    if (recipientName.trim()) {
      setStep('proposal');
    }
  };

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
    setStep('accepted');
    confetti({
      particleCount: 150,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const sendWhatsAppMessage = () => {
    const text = `Hey ${urlParams.sender}! ${recipientName} said YES! 💖💍`;
    const url = `https://wa.me/${urlParams.phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // RENDER UI ----------------------------------------------------------------

  if (step === 'loading') return null;

  // 1. CREATOR MODE
  if (step === 'create') {
    return (
      <div className="valentine-container">
        <h1>Create Your Valentine Proposal 💘</h1>
        <p className="subtitle">Make a custom link to ask your special someone out!</p>

        {!generatedLink ? (
          <form onSubmit={handleGenerateLink} className="creator-form">
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Romeo"
                required
              />
            </div>
            <div className="input-group">
              <label>Your WhatsApp Number (with country code)</label>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                required
              />
              <small>So they can send you their "Yes!" answer directly.</small>
            </div>
            <button type="submit" className="action-button">Create Link</button>
          </form>
        ) : (
          <div className="result-container">
            <p>Here is your unique link:</p>
            <div className="link-box">
              <input readOnly value={generatedLink} />
              <button onClick={copyToClipboard} className="copy-btn">
                {copySuccess ? "Copied!" : "Copy"}
              </button>
            </div>
            <button
              onClick={() => {
                setGeneratedLink('');
                setSenderName('');
                setSenderPhone('');
              }}
              className="reset-btn"
            >
              Create Another
            </button>
          </div>
        )}
      </div>
    );
  }

  // 2. RECIPIENT INTRO (Enter Name)
  if (step === 'intro') {
    return (
      <div className="valentine-container">
        <img
          className="bear-img"
          src="https://media.tenor.com/-p-KdcjB8sAAAAAC/hi-sticker.gif"
          alt="cute bear waving"
        />
        <h1>Hey there! Someone has a question for you...</h1>
        <form onSubmit={startProposal} className="intro-form">
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Enter your beautiful name"
            required
            autoFocus
          />
          <button type="submit" className="action-button">Continue &rarr;</button>
        </form>
      </div>
    );
  }

  // 3. PROPOSAL & ACCEPTED
  return (
    <div className="valentine-container">
      {step === 'accepted' ? (
        <div className="yes-container">
          <img
            src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
            alt="bears kissing"
            className="bear-img"
          />
          <div className="text-container">Yay!!! 💖</div>
          <p>Let {urlParams.sender} know you said YES!</p>
          <button onClick={sendWhatsAppMessage} className="whatsapp-button">
            Send the Good News 💌
          </button>
        </div>
      ) : (
        <>
          <img
            className="bear-img"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
            alt="bears with roses"
          />
          <h1 className="text-container">
            {recipientName}, will you be my girlfriend?
          </h1>
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
