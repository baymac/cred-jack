import cn from 'classnames';
import { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import fetchJson from '../../lib/fetchJson';
import useUser from '../../lib/useUser';
import {
  getAccountFromLocalStorage,
  getBalance,
  getConnection,
  requestAirDrops,
} from '../../lib/utils';
import rootStyles from '../../styles/root.module.css';
import AddWallet from '../AddWallet/AddWallet';
import ButtonLoading from '../ButtonLoading/ButtonLoading';
import Loading from '../Loading/Loading';
import styles from './credjack.module.css';

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

// Inspired by https://codepen.io/jeffleu/pen/MbVGmM

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
  const { user, mutateUser } = useUser();

  useEffect(() => {
    if (user?.sol_addr) {
      window.localStorage.setItem('paymentKey', user.sol_addr);
    }
  }, []);

  const [dealer, setDealer] = useState(null);
  const [deck, setDeck] = useState(generateDeck());
  const [player, setPlayer] = useState(null);
  const [wallet, setWallet] = useState(user.coins);
  const [input, setInput] = useState('');
  const [currentBet, setCurrentBet] = useState(null);
  const [gameStates, setGameState] = useState(States.idle);
  const [gameOver, setGameOver] = useState(null);
  const [message, setMessage] = useState(null);
  const [placingBet, setPlacingBet] = useState(false);
  const [solBalance, setSolBalance] = useState(null);
  const [fundingUserProgress, setFundingUserProgress] = useState(null);

  const updateBalance = async () => {
    if (window.localStorage.getItem('paymentKey')) {
      var newBalance = await getBalance(
        getAccountFromLocalStorage('paymentKey').publicKey,
        true
      );
      if (newBalance < solBalance + calculateWinnings()) {
        console.log(
          `Requesting Airdrop: ${solBalance + calculateWinnings() - newBalance}`
        );
        await requestAirDrops(
          getConnection().connection,
          getAccountFromLocalStorage('paymentKey'),
          solBalance + calculateWinnings() - newBalance
        );
      }
      newBalance = await getBalance(
        getAccountFromLocalStorage('paymentKey').publicKey
      );
      console.log(`New Balance: ${newBalance}`);
      console.log(`Current Balance: ${solBalance}`);
      console.log(`Winnings: ${calculateWinnings()}`);
      if (newBalance === solBalance + calculateWinnings()) {
        setFundingUserProgress(null);
        setSolBalance(newBalance);
        setCurrentBet(null);
      } else if (newBalance > solBalance + calculateWinnings()) {
        console.log('Memory Leak Occurred');
        setFundingUserProgress(null);
        setSolBalance(newBalance);
        setCurrentBet(null);
      }
    }
  };

  useInterval(updateBalance, fundingUserProgress);

  useEffect(() => {
    if (user.sol_addr) {
      getBalance(getAccountFromLocalStorage('paymentKey').publicKey, true).then(
        (bal) => {
          setSolBalance(bal);
        }
      );
    }
  }, [user]);

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
      setGameOver(null);
      setMessage(null);
    } else {
      setMessage(
        'You are broke. Pay more credit card uses to earn cred coins.'
      );
    }
  };

  const getRandomCard = (deck): RandomCard => {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const randomCard = deck[randomIndex];
    deck.splice(randomIndex, 1);
    return { randomCard, updatedDeck: deck };
  };

  const placeBet = async () => {
    const updatedCurrentBet = parseInt(input);
    if (updatedCurrentBet > wallet) {
      setMessage('Insufficient funds to bet that amount.');
    } else if (updatedCurrentBet % 1 !== 0) {
      setMessage('Please bet whole numbers only.');
    } else {
      setPlacingBet(true);
      const resp = await fetchJson('/api/spendCoin', {
        method: 'POST',
        body: JSON.stringify({ coins: updatedCurrentBet }),
      });
      setPlacingBet(false);
      setWallet(wallet - updatedCurrentBet);
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
          setMessage(`Dealer wins. You lost ${currentBet} cred coins`);
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

  const calculateWinnings = () =>
    Math.round(currentBet * (user.trust_score / 100));

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
          setWallet(wallet);
          setGameOver(true);
          setMessage(
            `${user.first_name} wins. You won ${calculateWinnings()} lamports.`
          );
          fundUserWithWinnings();
        } else {
          const winner = getWinner(localDealer, player);
          let updatedWallet = wallet;
          let message;

          if (winner === 'dealer') {
            message = `Dealer wins. You lost ${currentBet} cred coins.`;
          } else if (winner === 'player') {
            message = `${
              user.first_name
            } wins. You won ${calculateWinnings()} lamports.`;
            fundUserWithWinnings();
          } else {
            message = 'Stand Off! Select Play Again to place another bet.';
          }

          setDeck(updatedDeck);
          setDealer(localDealer);
          setWallet(updatedWallet);
          setGameOver(true);
          setMessage(message);
        }
      }
    } else {
      setMessage('Game over! Select Play Again to place another bet.');
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
    setInput('');
  };

  const fundUserWithWinnings = () => {
    setFundingUserProgress(2000);
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
                  if (user?.sol_addr) {
                    startGame();
                  }
                }}
                style={!user?.sol_addr ? { cursor: 'no-drop' } : {}}
              >
                Start Game
              </button>
            </div>
            {!user?.sol_addr && (
              <>
                <div className={cn(styles.message, styles.input_bet)}>
                  Create a Solana wallet to start the game
                </div>
                <AddWallet />
              </>
            )}
          </>
        )}
        {gameStates === States.progress && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div>
                Checkout the rules{' '}
                <a
                  href="https://github.com/baymac/cred-jack/blob/main/docs/RULES.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
              </div>
            </div>
            {((gameOver === null && currentBet !== null) || gameOver) && (
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
            )}
            <div className={styles.player_arena}>
              {((gameOver === null && currentBet !== null) || gameOver) && (
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
              )}
              {currentBet && (
                <div className={styles.bet_info}>
                  Your current bet is {currentBet}
                </div>
              )}
              {gameOver && !fundingUserProgress && (
                <div
                  className={cn(styles.game_action_buttons, styles.play_again, {
                    [styles.button_disable]: fundingUserProgress,
                  })}
                >
                  <button
                    onClick={() => {
                      if (!fundingUserProgress) {
                        startGame();
                      }
                    }}
                    disabled={fundingUserProgress}
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
                    <div
                      className={cn(styles.input_box, {
                        [styles.button_disable]: placingBet,
                      })}
                    >
                      <button
                        onClick={() => {
                          placeBet();
                        }}
                        disabled={placingBet}
                      >
                        {placingBet ? <ButtonLoading /> : 'Place Bet'}
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
          <p className={styles.balance}>Phone: {user.phone}</p>
          <p className={styles.balance}>
            Solana Address: &nbsp;
            {/* @ts-ignore */}
            {user.sol_addr ?? 'null'}
          </p>
          <div className={styles.balance}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Solana Balance: &nbsp;
              {/* @ts-ignore */}
              {fundingUserProgress ? (
                <Loading />
              ) : (
                `${JSON.stringify(solBalance)} lamports`
              )}
            </div>
          </div>
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
