export interface Player {
    name: string;
    money: {
      white: number;  // Declared income
      black: number;  // "Alternative" income
      hidden: number; // Even family doesn't know
    };
    reputation: {
      society: number;      // Log kya kahenge meter
      business: number;     // Market reputation
      kanjoos: number;      // Penny-pincher level
    };
    skills: {
      haggling: number;
      taxEvasion: number;
      excuseMaking: number;
      emotionalDrama: number;
    };
    inventory: {
      goldBricks: number;
      calculators: string[];
      hiddenLocations: string[];
    };
  }
  
  export interface GameState {
    player: Player;
    currentDay: number;
    lastITRaidDay: number;
    activeEvents: GameEvent[];
  }
  
  export interface GameEvent {
    id: string;
    title: string;
    description: string;
    choices: Choice[];
  }
  
  export interface Choice {
    text: string;
    consequences: {
      money?: Partial<Record<keyof Player['money'], number>>;
      reputation?: Partial<Record<keyof Player['reputation'], number>>;
      skills?: Partial<Record<keyof Player['skills'], number>>;
    };
  }