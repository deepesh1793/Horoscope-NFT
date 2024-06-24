import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import NFT from "./abi/horoscopeNFT.json";
const NFT_CONTRACT_ADDRESS = "0x41335b3AEDb934e114287952c96485CA252d1753"

function App() {
  const [isWalletInstalled, setIsWalletInstalled] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [NFTContract, setNFTContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [date, setDate] = useState("1992-08-31")
  const [zodiacSign, setZodiacSign] = useState(null)
  const svgStyle = {
    preserveAspectRatio: 'xMinYMin meet',
    viewBox: '0 0 350 350',
  };
  const textStyle = {
    fill: 'white',
    fontFamily: 'serif',
    fontSize: '24px',
  };


  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true)
    }
  }, [])

  function handleDateInput({ target }) {
    setDate(target.value);
  }

  async function connectWallet() {
    window.ethereum
      .request({ method: "eth_requestAccounts", })
      .then((accounts) => {
        setAccount(accounts[0])
      })
      .catch((error) => {
        alert("Something went wrong");
      })
  }

  useEffect(() => {
    calculateZodiacSign(date);
  }, [date])

  function calculateZodiacSign(date) {
    let dateObject = new Date(date)
    let day = dateObject.getDate()
    let month = dateObject.getMonth()
    if (month == 0) {
      if (day >= 20) {
        setZodiacSign("Aquarius")
      }
      else {
        setZodiacSign("Capricon")
      }
    }
    else if (month == 1) {
      if (day >= 19) {
        setZodiacSign("Pisces");
      } else {
        setZodiacSign("Aquarius");
      }
    } else if (month == 2) {
      if (day >= 21) {
        setZodiacSign("Aries");
      } else {
        setZodiacSign("Pisces");
      }
    } else if (month == 3) {
      if (day >= 20) {
        setZodiacSign("Taurus");
      } else {
        setZodiacSign("Aries");
      }
    } else if (month == 4) {
      if (day >= 21) {
        setZodiacSign("Gemini");
      } else {
        setZodiacSign("Taurus");
      }
    } else if (month == 5) {
      if (day >= 21) {
        setZodiacSign("Cancer");
      } else {
        setZodiacSign("Gemini");
      }
    } else if (month == 6) {
      if (day >= 23) {
        setZodiacSign("Leo");
      } else {
        setZodiacSign("Cancer");
      }
    } else if (month == 7) {
      if (day >= 23) {
        setZodiacSign("Virgo");
      } else {
        setZodiacSign("Leo");
      }
    } else if (month == 8) {
      if (day >= 23) {
        setZodiacSign("Libra");
      } else {
        setZodiacSign("Virgo");
      }
    } else if (month == 9) {
      if (day >= 23) {
        setZodiacSign("Scorpio");
      } else {
        setZodiacSign("Libra");
      }
    } else if (month == 10) {
      if (day >= 22) {
        setZodiacSign("Sagittarius");
      } else {
        setZodiacSign("Scorpio");
      }
    } else if (month == 11) {
      if (day >= 22) {
        setZodiacSign("Capricorn");
      } else {
        setZodiacSign("Sagittarius");
      }
    }
  }

  useEffect(() => {
    function initNFTContract() {
      const provider = new BrowserProvider(window.ethereum)
      provider.getSigner().then((signer) => {
        setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer))
      }).catch((error) => {
        console.error("Error initializing contract:")
      })
    }
    initNFTContract()

  }, [])

  async function mintNFT() {
    setIsMinting(true)
    try {
      const transaction = await NFTContract.mintNFT(account, zodiacSign);
      await transaction.wait();
    }
    catch (e) {
      console.error(e)
    }
    finally {
      alert("Minting Successful")
      setIsMinting(false)
    }
  }
  if (account === null) {
    return (
      <div className="App">
        {
          isWalletInstalled ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <p>Install Metamask wallet</p>
          )
        }

      </div>
    );
  }
  return (
    <div className="App">
      <h1>Horoscope NFT Minting Dapp</h1>
      <p>Connected as: {account}</p>

      <input onChange={handleDateInput} value={date} type="date" id="dob" />
      <br />
      <br />
      {zodiacSign ? (
        <div style={{ width: '400px', height: '400px', paddingLeft: '425px' }}>
          <svg xmlns='http://www.w3.org/2000/svg' {...svgStyle}>
            <defs>
              <linearGradient id='backgroundGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' style={{ stopColor: '#ff7e5f', stopOpacity: 1 }} />
                <stop offset='100%' style={{ stopColor: '#feb47b', stopOpacity: 1 }} />
              </linearGradient>
              <filter id='blur' x='-10%' y='-10%' width='120%' height='120%'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='5' />
              </filter>
            </defs>
            <rect width='100%' height='100%' fill='url(#backgroundGradient)' />
            <circle cx='175' cy='175' r='80' fill='white' opacity='0.3' />
            <circle cx='175' cy='175' r='60' fill='white' filter='url(#blur)' opacity='0.5' />
            <text x='50%' y='50%' style={textStyle} dominantBaseline='middle' textAnchor='middle'>
              {zodiacSign}
            </text>
            <line x1='50' y1='300' x2='300' y2='300' stroke='white' strokeWidth='2' />
            <circle cx='50' cy='300' r='5' fill='white' />
            <circle cx='300' cy='300' r='5' fill='white' />
          </svg>
        </div>

      ) : null
      }

      <br />
      <br />
      <button disabled={isMinting} onClick={mintNFT}>
        {isMinting ? "Minting..." : "Mint"}
      </button>
    </div >
  );

}



export default App;