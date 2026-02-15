import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Smartphone, User, Copy, RotateCcw, Link as LinkIcon, Sparkles } from 'lucide-react';
import './App.css';
import confetti from 'canvas-confetti';

// Floating Hearts Background Component
const FloatingHearts = () => {
  return (
    <div className="floating-hearts-bg">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-heart"
          initial={{
            y: "110vh",
            x: Math.random() * 100 + "vw",
            opacity: 0,
            scale: 0.5 + Math.random() * 0.5
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 0.8, 0],
            rotate: Math.random() * 360
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

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

  // Variants for animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
  };

  if (step === 'loading') return null;

  return (
    <div className="app-wrapper">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {/* 1. CREATOR MODE */}
        {step === 'create' && (
          <motion.div
            key="create"
            className="card glass-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="icon-badge">
              <Sparkles size={32} color="#d32f2f" />
            </div>
            <h1>Create Proposal 💘</h1>
            <p className="subtitle">Craft your perfect ask.</p>

            {!generatedLink ? (
              <form onSubmit={handleGenerateLink} className="creator-form">
                <div className="input-group">
                  <label><User size={16} /> Your Name</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Romeo"
                    required
                  />
                </div>
                <div className="input-group">
                  <label><Smartphone size={16} /> WhatsApp Number</label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    required
                  />
                  <small>To receive the "Yes!" notification</small>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="action-button gradient-btn"
                >
                  Create Magic Link <LinkIcon size={18} />
                </motion.button>
              </form>
            ) : (
              <div className="result-container">
                <p>✨ Your magic link is ready! ✨</p>
                <div className="link-box">
                  <input readOnly value={generatedLink} />
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={copyToClipboard}
                    className="copy-btn"
                  >
                    {copySuccess ? <span className="success-icon">✓</span> : <Copy size={18} />}
                  </motion.button>
                </div>
                <button
                  onClick={() => {
                    setGeneratedLink('');
                    setSenderName('');
                    setSenderPhone('');
                  }}
                  className="reset-btn"
                >
                  <RotateCcw size={14} /> Create Another
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* 2. RECIPIENT INTRO */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            className="card glass-card"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.img
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bear-img-small"
              src="https://media.tenor.com/-p-KdcjB8sAAAAAC/hi-sticker.gif"
              alt="cute bear waving"
            />
            <h1>Presentation for...</h1>
            <p className="subtitle">Please enter your name to verify it's you!</p>
            <form onSubmit={startProposal} className="intro-form">
              <div className="input-group">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Your beautiful name..."
                  required
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="action-button gradient-btn"
              >
                Open Gift 🎁
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* 3. PROPOSAL & ACCEPTED */}
        {(step === 'proposal' || step === 'accepted') && (
          <motion.div
            key="proposal"
            className="valentine-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {step === 'accepted' ? (
              <motion.div
                className="yes-container"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <img
                  src="https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
                  alt="bears kissing"
                  className="bear-img"
                />
                <div className="text-container">Yay!!! 💖</div>
                <p>Let {urlParams.sender} know you said YES!</p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={sendWhatsAppMessage}
                  className="whatsapp-button"
                >
                  Send the Good News <Send size={20} />
                </motion.button>
              </motion.div>
            ) : (
              <>
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="bear-img"
                  src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
                  alt="bears with roses"
                />
                <motion.h1
                  className="text-container"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  delay={0.2}
                >
                  {recipientName}, will you be my girlfriend?
                </motion.h1>
                <div className="button-container">
                  <motion.button
                    className="yes-button"
                    style={{ fontSize: yesButtonSize }}
                    onClick={handleYesClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Yes
                  </motion.button>
                  <motion.button
                    onClick={handleNoClick}
                    className="no-button"
                    whileHover={{ x: [0, -5, 5, -5, 5, 0] }} // Shake effect on hover
                    transition={{ duration: 0.4 }}
                  >
                    {noCount === 0 ? "No" : getNoButtonText()}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
