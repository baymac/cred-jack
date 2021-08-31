import { useEffect, useState } from 'react';
import useUser from '../../lib/useUser';
import styles from './credjack.module.css';
import rootStyles from '../../styles/root.module.css';
import cn from 'classnames';

interface Card {
  number: number;
  suit: string;
}

type TDeck = Array<Card>;

interface RandomCard {
  randomCard: Card;
  updatedDeck: TDeck;
}

enum States {
  idle,
  progress,
}

const generateDeck = (): TDeck => {
  const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
  const suits = ['♦', '♣', '♥', '♠'];
  const deck = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({ number: cards[i], suit: suits[j] });
    }
  }
  return deck;
};

export default function CredJack() {
  const { user } = useUser();

  const [dealer, setDealer] = useState(null);
  const [deck, setDeck] = useState(generateDeck());
  const [player, setPlayer] = useState(null);
  const [wallet, setWallet] = useState(user.coins);
  const [input, setInput] = useState('');
  const [currentBet, setCurrentBet] = useState(null);
  const [gameStates, setGameState] = useState(States.idle);
  const [gameOver, setGameOver] = useState(null);
  const [message, setMessage] = useState(null);

  const dealCards = (deck) => {
    const playerCard1 = getRandomCard(deck);
    const dealerCard1 = getRandomCard(playerCard1.updatedDeck);
    const playerCard2 = getRandomCard(dealerCard1.updatedDeck);
    const playerStartingHand = [playerCard1.randomCard, playerCard2.randomCard];
    const dealerStartingHand = [dealerCard1.randomCard, {}];

    const player = {
      cards: playerStartingHand,
      count: getCount(playerStartingHand),
    };
    const dealer = {
      cards: dealerStartingHand,
      count: getCount(dealerStartingHand),
    };

    return { updatedDeck: playerCard2.updatedDeck, player, dealer };
  };

  const startGame = () => {
    setGameState(States.progress);
    if (wallet > 0) {
      const updatedDeck = deck.length < 10 ? generateDeck() : deck;
      const {
        updatedDeck: postDealDeck,
        player: updatedPlayer,
        dealer: updatedDealer,
      } = dealCards(updatedDeck);
      setDeck(postDealDeck);
      setPlayer(updatedPlayer);
      setDealer(updatedDealer);
      setCurrentBet(null);
      setGameOver(false);
      setMessage(null);
    } else {
      setMessage('You are broke. Buy more Solana using cred coins.');
    }
  };

  const getRandomCard = (deck): RandomCard => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const randomCard = deck[randomIndex];
    deck.splice(randomIndex, 1);
    return { randomCard, updatedDeck: deck };
  };

  const placeBet = () => {
    const updatedCurrentBet = parseInt(input);
    if (updatedCurrentBet > wallet) {
      setMessage('Insufficient funds to bet that amount.');
    } else if (updatedCurrentBet % 1 !== 0) {
      setMessage('Please bet whole numbers only.');
    } else {
      // Deduct current bet from wallet
      const updatedWallet = wallet - updatedCurrentBet;
      setWallet(updatedWallet);
      setInput('');
      setCurrentBet(updatedCurrentBet);
      setMessage(null);
    }
  };

  const hit = () => {
    if (!gameOver) {
      if (currentBet) {
        const { randomCard, updatedDeck } = getRandomCard(deck);
        const updatedPlayerCards = player.cards.concat(randomCard);
        const updatedCount = getCount(updatedPlayerCards);

        if (updatedCount > 21) {
          setPlayer((prev) => ({
            ...prev,
            cards: prev.cards.concat(randomCard),
            count: updatedCount,
          }));
          setGameOver(true);
          setCurrentBet(null);
          setMessage(`Dealer wins. You lost ${currentBet} sol`);
        } else {
          setPlayer((prev) => ({
            ...prev,
            cards: prev.cards.concat(randomCard),
            count: updatedCount,
          }));
          setDeck(updatedDeck);
        }
      } else {
        setMessage('Please place bet.');
      }
    } else {
      setMessage('Game over! Please select play again.');
    }
  };

  const dealerDraw = (dealer, deck) => {
    const { randomCard, updatedDeck } = getRandomCard(deck);
    dealer.cards.push(randomCard);
    dealer.count = getCount(dealer.cards);
    return { dealer, updatedDeck };
  };

  const getCount = (cards) => {
    const rearranged = [];
    cards.forEach((card) => {
      if (card.number === 'A') {
        rearranged.push(card);
      } else if (card.number) {
        rearranged.unshift(card);
      }
    });

    return rearranged.reduce((total, card) => {
      if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
        return total + 10;
      } else if (card.number === 'A') {
        return total + 11 <= 21 ? total + 11 : total + 1;
      } else {
        return total + card.number;
      }
    }, 0);
  };

  const stand = () => {
    if (!gameOver) {
      if (!currentBet) {
        setMessage('Please place bet.');
      } else {
        // Show dealer's 2nd card
        const randomCard = getRandomCard(deck);
        let updatedDeck = randomCard.updatedDeck;
        let localDealer = dealer;
        localDealer.cards.pop();
        localDealer.cards.push(randomCard.randomCard);
        localDealer.count = getCount(localDealer.cards);

        // Keep drawing cards until count is 17 or more
        while (localDealer.count < 17) {
          const draw = dealerDraw(localDealer, deck);
          localDealer = draw.dealer;
          updatedDeck = draw.updatedDeck;
        }

        if (localDealer.count > 21) {
          setDeck(updatedDeck);
          setDealer(localDealer);
          setWallet(wallet + currentBet * 2);
          setGameOver(true);
          setCurrentBet(null);
          setMessage(`${user.first_name} wins. You won ${currentBet} sol.`);
        } else {
          const winner = getWinner(localDealer, player);
          let updatedWallet = wallet;
          let message;

          if (winner === 'dealer') {
            message = `Dealer wins. You lost ${currentBet} sol.`;
          } else if (winner === 'player') {
            updatedWallet += currentBet * 2;
            message = `${user.first_name} wins. You won ${currentBet} sol.`;
          } else {
            updatedWallet += currentBet;
            message = 'Push.';
          }

          setDeck(updatedDeck);
          setDealer(localDealer);
          setWallet(updatedWallet);
          setGameOver(true);
          setCurrentBet(null);
          setMessage(message);
        }
      }
    } else {
      setMessage('Game over! Please start a new game.');
    }
  };

  const getWinner = (dealer, player) => {
    if (dealer.count > player.count) {
      return 'dealer';
    } else if (dealer.count < player.count) {
      return 'player';
    } else {
      return 'push';
    }
  };

  const inputChange = (e) => {
    const inputValue = e.target.value;
    setInput(inputValue.toString());
  };

  const endGame = () => {
    setGameState(States.idle);
    setMessage(null);
  };

  return (
    <section
      className={cn(rootStyles.section, styles.about__section)}
      id="userInfo"
    >
      <div className={cn(rootStyles.container, styles.about__container)}>
        <h1 className={styles.heading}>Cred Jack</h1>
        {gameStates === States.idle && (
          <>
            <h3 className={styles.heading}>
              Welcome {user.first_name}, select Start Game to play Cred Jack.
            </h3>
            <div className={styles.input_box}>
              <button
                onClick={() => {
                  startGame();
                }}
              >
                Start Game
              </button>
            </div>
          </>
        )}
        {gameStates === States.progress && (
          <>
            <div className={styles.board_wrapper}>
              <div className={styles.board}>
                <p>Dealer's Hand ({dealer.count})</p>
                <div className={styles.cards}>
                  {dealer.cards.map((card, i) => {
                    return (
                      <Card key={i} number={card.number} suit={card.suit} />
                    );
                  })}
                </div>
              </div>
              <div className={styles.board}>
                <div className={styles.cards}>
                  {player.cards.map((card, i) => (
                    <Card
                      key={`${i}${card.suit}`}
                      number={card.number}
                      suit={card.suit}
                    />
                  ))}
                </div>
                <p>
                  {user.first_name}'s Hand ({player.count})
                </p>
              </div>
            </div>
            <div className={styles.player_arena}>
              <div className={styles.game_actions}>
                <div className={styles.game_action_buttons}>
                  <button
                    onClick={() => {
                      hit();
                    }}
                  >
                    Hit
                  </button>
                </div>
                <div className={styles.game_action_buttons}>
                  <button
                    onClick={() => {
                      stand();
                    }}
                  >
                    Stand
                  </button>
                </div>
              </div>
              {currentBet && (
                <div className={styles.bet_info}>
                  Your current bet is {currentBet}
                </div>
              )}
              {gameOver && (
                <div
                  className={cn(styles.game_action_buttons, styles.play_again)}
                >
                  <button
                    onClick={() => {
                      startGame();
                    }}
                  >
                    Play Again
                  </button>
                </div>
              )}
              <p className={styles.message}>{message}</p>
              <div className={styles.place_bet_form}>
                {!currentBet && !gameOver && (
                  <>
                    <div className={styles.input_box}>
                      <input
                        type="text"
                        name="bet"
                        placeholder="Add your bet here"
                        value={input}
                        onChange={inputChange}
                      />
                    </div>
                    <div className={styles.input_box}>
                      <button
                        onClick={() => {
                          placeBet();
                        }}
                      >
                        Place Bet
                      </button>
                    </div>
                  </>
                )}
                <div className={styles.input_box}>
                  <button
                    onClick={() => {
                      endGame();
                    }}
                  >
                    End Game
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        <div className={styles.balance_info}>
          <p className={styles.balance}>Balance: {wallet} cred coins</p>
          <p className={styles.balance}>Trust Score: {user.trust_score}</p>
        </div>
      </div>
    </section>
  );
}

const Card = ({ number, suit }) => {
  const combo = number ? `${number}${suit}` : null;
  const color = suit === '♦' || suit === '♥' ? styles.card_red : styles.card;

  return <div className={color}>{combo}</div>;
};