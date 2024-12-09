"use client"
import { useState, useEffect } from 'react';
import type { GameState, GameEvent, Choice } from '@/types/game';

const initialState: GameState = {
  player: {
    name: "",
    money: {
      white: 100000,
      black: 500000,
      hidden: 1000000
    },
    reputation: {
      society: 50,
      business: 50,
      kanjoos: 0
    },
    skills: {
      haggling: 10,
      taxEvasion: 10,
      excuseMaking: 10,
      emotionalDrama: 10
    },
    inventory: {
      goldBricks: 5,
      calculators: ["Casio Basic", "Hidden Emergency Calculator"],
      hiddenLocations: ["Under Mattress", "False Cabinet Bottom"]
    }
  },
  currentDay: 1,
  lastITRaidDay: 0,
  activeEvents: []
};

const randomEvents: GameEvent[] = [
  {
    id: "iphone_launch",
    title: "New iPhone Launch Crisis!",
    description: "Apple just launched iPhone 15 Pro Max. Your Sharma ji's son already ordered it. Your iPhone 6 is still working fine though...",
    choices: [
      {
        text: "Buy immediately to maintain status (Cost: ₹1,45,000)",
        consequences: {
          money: { white: -145000 },
          reputation: { society: 20, kanjoos: -30 }
        }
      },
      {
        text: "Give speech about 'Simple Living High Thinking' while secretly feeling FOMO",
        consequences: {
          skills: { emotionalDrama: 5 },
          reputation: { kanjoos: 10 }
        }
      },
      {
        text: "Tell everyone you're waiting for iPhone 16 (while planning to buy iPhone 14)",
        consequences: {
          skills: { excuseMaking: 5 },
          reputation: { business: 5 }
        }
      }
    ]
  },
  {
    id: "relative_loan",
    title: "Rishtedaar Loan Request!",
    description: "Your distant cousin needs ₹2 lakhs for his 'startup'. He promises to return it in 2 months...",
    choices: [
      {
        text: "Give loan (while kissing goodbye to money)",
        consequences: {
          money: { white: -200000 },
          reputation: { society: 15 },
          skills: { emotionalDrama: -5 }
        }
      },
      {
        text: "Say you're also in debt due to business loss",
        consequences: {
          skills: { excuseMaking: 10, emotionalDrama: 5 },
          reputation: { kanjoos: 15 }
        }
      },
      {
        text: "Activate 'Phone not reachable' mode for next 3 months",
        consequences: {
          reputation: { society: -10, kanjoos: 20 },
          skills: { excuseMaking: 15 }
        }
      }
    ]
  },
  {
    id: "it_raid_rumor",
    title: "IT Raid Rumors!",
    description: "Word on the street is that IT department is conducting raids in your area...",
    choices: [
      {
        text: "Quickly move all documents to 'secret location'",
        consequences: {
          skills: { taxEvasion: 10 },
          money: { hidden: -100000 }
        }
      },
      {
        text: "Start crying about business losses preemptively",
        consequences: {
          skills: { emotionalDrama: 15 },
          reputation: { business: -5 }
        }
      },
      {
        text: "Convert black money to gold overnight",
        consequences: {
          money: { black: -200000, hidden: 180000 },
          skills: { taxEvasion: 5 }
        }
      }
    ]
  },
  {
    id: "sharma_ji_comparison",
    title: "Sharma Ji's Son Strikes Again!",
    description: "Sharma ji's son just bought a Tesla. Your Toyota Fortuner suddenly feels like a rickshaw...",
    choices: [
      {
        text: "Start Tesla booking process while crying about EMIs",
        consequences: {
          money: { white: -1000000, black: -500000 },
          reputation: { society: 25, kanjoos: -50 },
          skills: { emotionalDrama: 10 }
        }
      },
      {
        text: "Give lecture about 'Tesla's charging issues in India'",
        consequences: {
          skills: { excuseMaking: 15 },
          reputation: { kanjoos: 10, business: 5 }
        }
      },
      {
        text: "Spread rumor about Sharma ji's business troubles",
        consequences: {
          reputation: { society: -10 },
          skills: { emotionalDrama: 20, excuseMaking: 15 }
        }
      }
    ]
  },
  {
    id: "wedding_season_crisis",
    title: "Peak Wedding Season Emergency!",
    description: "You have 3 weddings to attend this weekend. Each shagun lifafa needs to be perfectly calculated based on complex family politics...",
    choices: [
      {
        text: "Use advanced Excel formula to calculate minimum acceptable amounts",
        consequences: {
          money: { white: -50000 },
          skills: { haggling: 10 },
          reputation: { kanjoos: 15 }
        }
      },
      {
        text: "Fake medical emergency for 2 weddings, attend the most important one",
        consequences: {
          money: { white: -20000 },
          skills: { excuseMaking: 20 },
          reputation: { society: -15 }
        }
      },
      {
        text: "Attend all with same gift amount, damage family relations forever",
        consequences: {
          money: { white: -30000 },
          reputation: { society: -25, kanjoos: 25 }
        }
      }
    ]
  },
  {
    id: "diwali_bonus_drama",
    title: "Diwali Bonus Dilemma!",
    description: "Employees expecting Diwali bonus. Your CA suggests showing losses this quarter...",
    choices: [
      {
        text: "Give bonus + sweets (secretly adjust in next year's salary)",
        consequences: {
          money: { white: -200000, hidden: 150000 },
          reputation: { business: 15 },
          skills: { taxEvasion: 10 }
        }
      },
      {
        text: "Give emotional speech about market conditions with tiny bonus",
        consequences: {
          money: { white: -50000 },
          skills: { emotionalDrama: 25 },
          reputation: { business: -10, kanjoos: 20 }
        }
      },
      {
        text: "Distribute motivational WhatsApp forwards instead of bonus",
        consequences: {
          reputation: { business: -20, kanjoos: 30 },
          skills: { excuseMaking: 25 }
        }
      }
    ]
  },
  {
    id: "gst_raid_panic",
    title: "Surprise GST Inspection!",
    description: "GST officers at the door! Your 'creative' accounting skills are about to be tested...",
    choices: [
      {
        text: "Quickly print new invoices while nephew creates distraction",
        consequences: {
          money: { black: -50000 },
          skills: { taxEvasion: 20 },
          reputation: { business: -5 }
        }
      },
      {
        text: "Start crying about digital India confusion",
        consequences: {
          money: { white: -100000 },
          skills: { emotionalDrama: 30 },
          reputation: { business: 5 }
        }
      },
      {
        text: "Show them the special 'inspection ready' accounts folder",
        consequences: {
          money: { hidden: -200000 },
          skills: { taxEvasion: 25 },
          reputation: { business: 10 }
        }
      }
    ]
  },
  {
    id: "property_deal",
    title: "Property Deal Opportunity!",
    description: "Someone's selling property at 40% white, 60% black. Your CA is having anxiety attacks...",
    choices: [
      {
        text: "Go all in with complex money routing through 5 relatives",
        consequences: {
          money: { white: -2000000, black: -3000000, hidden: 1000000 },
          skills: { taxEvasion: 30 },
          reputation: { business: 20 }
        }
      },
      {
        text: "Negotiate for 50-50 split while threatening to call IT dept",
        consequences: {
          money: { white: -2500000, black: -2500000 },
          skills: { haggling: 25 },
          reputation: { business: 15, kanjoos: 10 }
        }
      },
      {
        text: "Decline but spread rumors about property defects",
        consequences: {
          skills: { excuseMaking: 15, emotionalDrama: 10 },
          reputation: { business: -5, kanjoos: 15 }
        }
      }
    ]
  },
  {
    id: "competitive_marriage",
    title: "Marriage Competition Crisis!",
    description: "Neighbor's daughter's wedding has 101 dishes. Your son's upcoming wedding menu has only 51...",
    choices: [
      {
        text: "Quickly add 51 more dishes (mostly different types of daal)",
        consequences: {
          money: { white: -500000 },
          reputation: { society: 20, kanjoos: -20 },
          skills: { haggling: 15 }
        }
      },
      {
        text: "Start WhatsApp campaign about 'Simple Living, High Thinking'",
        consequences: {
          skills: { emotionalDrama: 20, excuseMaking: 15 },
          reputation: { kanjoos: 25 }
        }
      },
      {
        text: "Spread rumor about neighbor's daughter's wedding being funded by loans",
        consequences: {
          reputation: { society: -15 },
          skills: { emotionalDrama: 25 }
        }
      }
    ]
  },
  {
    id: "kitty_party_crisis",
    title: "Kitty Party Pe Vaar!",
    description: "Biwi ki kitty party mein Gupta ji ki wife ne Louis Vuitton bag dikha diya. Ab aapki biwi ki 'simple living' philosophy khatre mein hai...",
    choices: [
      {
        text: "Emotional blackmail: 'Beta ke college fees ka paisa bag mein udaa dein?'",
        consequences: {
          skills: { emotionalDrama: 20 },
          reputation: { kanjoos: 15, society: -10 }
        }
      },
      {
        text: "Buy fake LV bag from Karol Bagh. 'Asli hai ji, sale mein liya'",
        consequences: {
          money: { black: -20000 },
          skills: { excuseMaking: 15 },
          reputation: { society: 10 }
        }
      },
      {
        text: "Start WhatsApp campaign about 'Swadeshi Apnao, Videshi Hatao'",
        consequences: {
          skills: { emotionalDrama: 25 },
          reputation: { society: -5, kanjoos: 20 }
        }
      }
    ]
  },
  {
    id: "dhanda_expansion",
    title: "Dhande Ka Time Aa Gaya!",
    description: "Purana dushman Bansal ji ka business band ho gaya hai. Unka prime location shop available hai...",
    choices: [
      {
        text: "'Bhai-chara nibhao': Buy shop at premium but establish market dominance",
        consequences: {
          money: { white: -1000000, black: -2000000 },
          reputation: { business: 30, society: 15 }
        }
      },
      {
        text: "Spread rumor 'Shop mein vastu dosh hai' and negotiate hard",
        consequences: {
          money: { black: -1000000 },
          skills: { haggling: 25, emotionalDrama: 15 },
          reputation: { kanjoos: 20 }
        }
      },
      {
        text: "Tell Bansal ji 'Mere cousin interested hai' and flip property",
        consequences: {
          money: { hidden: 500000 },
          skills: { taxEvasion: 20 },
          reputation: { business: -10 }
        }
      }
    ]
  },
  {
    id: "beta_startup",
    title: "Beta Wants to Leave Dhanda!",
    description: "Aapka beta traditional business chodd ke startup karna chahta hai. 'Papa, AI is the future!' bol raha hai...",
    choices: [
      {
        text: "Give emotional speech about '3 generations ka dhanda' while crying",
        consequences: {
          skills: { emotionalDrama: 30 },
          reputation: { society: 10 }
        }
      },
      {
        text: "Secretly invest in competitor's AI startup as backup plan",
        consequences: {
          money: { hidden: -500000 },
          skills: { taxEvasion: 15 },
          reputation: { business: 20 }
        }
      },
      {
        text: "Tell relatives 'Beta MBA kar raha hai' to avoid shame",
        consequences: {
          skills: { excuseMaking: 25 },
          reputation: { society: -10 }
        }
      }
    ]
  }
  // Add more events here
];

const getRandomEvent = () => {
  return randomEvents[Math.floor(Math.random() * randomEvents.length)];
};

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [playerName, setPlayerName] = useState<string>("");
  const [gameStarted, setGameStarted] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [showTip, setShowTip] = useState<string>("");
  
  // Random tips array
  const baniyaTips = [
    "Tip: 'Bhaiya thoda aur kam kar do' works 60% of the time, every time",
    "Tip: Calculator is not just a device, it's an emotion",
    "Tip: 'Abhi market mein mandi hai' - Universal excuse since 1947",
    "Tip: Sharma ji ka beta is not your friend",
    "Tip: 'Pichle saal se loss chal raha hai' - Best line for tax season",
    "Tip: 'Beta business mein utaar-chadhaav toh hota rehta hai' - Every Baniya Dad Ever"
  ];

  // Show random tip every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTip = baniyaTips[Math.floor(Math.random() * baniyaTips.length)];
      setShowTip(randomTip);
      setTimeout(() => setShowTip(""), 5000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      player: { ...prev.player, name: playerName }
    }));
    setCurrentEvent(getRandomEvent());
    setGameStarted(true);
  };

  const handleChoice = (choice: Choice) => {
    setGameState(prev => {
      const newState = { ...prev };
      
      // Apply consequences
      if (choice.consequences.money) {
        Object.entries(choice.consequences.money).forEach(([key, value]) => {
          newState.player.money[key as keyof typeof newState.player.money] += value;
        });
      }
      
      if (choice.consequences.reputation) {
        Object.entries(choice.consequences.reputation).forEach(([key, value]) => {
          newState.player.reputation[key as keyof typeof newState.player.reputation] += value;
        });
      }
      
      if (choice.consequences.skills) {
        Object.entries(choice.consequences.skills).forEach(([key, value]) => {
          newState.player.skills[key as keyof typeof newState.player.skills] += value;
        });
      }

      newState.currentDay += 1;
      return newState;
    });

    // Generate next event
    setCurrentEvent(getRandomEvent());
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col items-center gap-6 p-8">
          <h1 className="text-5xl font-bold text-yellow-500 mb-4">🏠 Baniya Life Simulator</h1>
          <p className="text-2xl italic text-yellow-300">Paisa Hi Paisa Hoga™</p>
          <p className="text-md text-gray-400 italic">A direct attack on Mayank Agarwal & Aditya Varshney by Utkarsh, in collaboration with Akshat</p>
          <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl">
            <input
              type="text"
              placeholder="Enter your name, future Crorepati..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-3 border rounded bg-gray-700 text-white placeholder-gray-400 mb-4"
            />
            <button
              onClick={handleStartGame}
              className="w-full py-3 bg-yellow-500 text-black rounded-lg font-bold hover:bg-yellow-400 transition-colors"
            >
              Start Your Dhandha 📈
            </button>
            <div className="mt-4 text-sm text-gray-400 text-center">
              * Terms & Conditions: CA ko mat batana
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {showTip && (
          <div className="fixed top-4 right-4 bg-yellow-500 text-black p-3 rounded-lg shadow-xl animate-bounce">
            {showTip}
          </div>
        )}
        
        <div className="stats grid grid-cols-3 gap-4 mb-8">
          <div className="stat bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl mb-2 text-yellow-500">💰 Money Matters</h3>
            <div className="space-y-2">
              <p>White Money: ₹{gameState.player.money.white.toLocaleString()}</p>
              <p>Black Money: ₹{gameState.player.money.black.toLocaleString()}</p>
              <p className="text-xs text-gray-400">(Shh... Hidden: ₹{gameState.player.money.hidden.toLocaleString()})</p>
            </div>
          </div>
          
          <div className="stat bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl mb-2 text-yellow-500">🏆 Reputation</h3>
            <div className="space-y-2">
              <div>
                <p>Kanjoos Level: {gameState.player.reputation.kanjoos}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${gameState.player.reputation.kanjoos}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p>Society Status: {gameState.player.reputation.society}</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${gameState.player.reputation.society}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="stat bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-xl mb-2 text-yellow-500">📅 Timeline</h3>
            <div className="space-y-2">
              <p>Day: {gameState.currentDay}</p>
              <p>Last IT Raid: {gameState.lastITRaidDay === 0 ? 'Bhagwan ka shukr hai' : `Day ${gameState.lastITRaidDay}`}</p>
            </div>
          </div>
        </div>
        
        {currentEvent && (
          <div className="event-container bg-gray-800 p-8 rounded-lg shadow-xl mb-8 transform hover:scale-[1.01] transition-transform">
            <h2 className="text-3xl font-bold mb-4 text-yellow-500">{currentEvent.title}</h2>
            <p className="text-xl text-gray-300 mb-8">{currentEvent.description}</p>
            
            <div className="choices-grid grid gap-6">
              {currentEvent.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="choice-button p-6 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-all hover:transform hover:translate-x-2"
                >
                  <div className="text-lg mb-3">{choice.text}</div>
                  <div className="consequences text-sm text-gray-400 grid grid-cols-2 gap-2">
                    {choice.consequences.money && (
                      <div className="consequence-money">
                        <span className="text-yellow-500">💰 Money Impact:</span>
                        {Object.entries(choice.consequences.money).map(([key, value]) => (
                          <div key={key} className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                            {key}: ₹{value > 0 ? '+' : ''}{value.toLocaleString()}
                          </div>
                        ))}
                      </div>
                    )}
                    {choice.consequences.reputation && (
                      <div className="consequence-reputation">
                        <span className="text-yellow-500">🏆 Reputation Impact:</span>
                        {Object.entries(choice.consequences.reputation).map(([key, value]) => (
                          <div key={key} className={value > 0 ? 'text-green-400' : 'text-red-400'}>
                            {key}: {value > 0 ? '+' : ''}{value}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}