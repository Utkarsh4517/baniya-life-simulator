"use client"
import { useState } from 'react';
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
      <div className="flex flex-col items-center gap-4 p-8">
        <h1 className="text-3xl font-bold">🏠 Baniya Life Simulator</h1>
        <p className="text-xl italic">Where Every Paisa Counts™</p>
        <input
          type="text"
          placeholder="Enter your name, future Crorepati..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={handleStartGame}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Start Business Empire
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="stats grid grid-cols-3 gap-4 mb-4 bg-gray-800 p-4 rounded-lg">
        <div className="stat">
          <h3>White Money: ₹{gameState.player.money.white}</h3>
          <h3>Black Money: ₹{gameState.player.money.black}</h3>
          <h3 className="text-xs">(Shh... Hidden: ₹{gameState.player.money.hidden})</h3>
        </div>
        <div className="stat">
          <h3>Kanjoos Level: {gameState.player.reputation.kanjoos}</h3>
          <h3>Society Status: {gameState.player.reputation.society}</h3>
        </div>
        <div className="stat">
          <h3>Day: {gameState.currentDay}</h3>
          <h3>Last IT Raid: {gameState.lastITRaidDay === 0 ? 'Never' : `Day ${gameState.lastITRaidDay}`}</h3>
        </div>
      </div>
      
      {currentEvent && (
        <div className="event-container bg-gray-800 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-bold mb-2">{currentEvent.title}</h2>
          <p className="text-gray-300 mb-6">{currentEvent.description}</p>
          
          <div className="choices-grid grid gap-4">
            {currentEvent.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoice(choice)}
                className="choice-button p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-left transition-colors"
              >
                {choice.text}
                <div className="consequences text-sm text-gray-400 mt-2">
                  {choice.consequences.money && (
                    <div>
                      {Object.entries(choice.consequences.money).map(([key, value]) => (
                        <span key={key}>₹{value > 0 ? '+' : ''}{value} {key} </span>
                      ))}
                    </div>
                  )}
                  {choice.consequences.reputation && (
                    <div>
                      {Object.entries(choice.consequences.reputation).map(([key, value]) => (
                        <span key={key}>{value > 0 ? '+' : ''}{value} {key} </span>
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
  );
}