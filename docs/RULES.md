# Rules

Assuming player's name is Alice.

1. The game contains 52 cards in the deck.
2. To win the game Alice needs to score points which is <= 21 but greater than points in Dealer's hands. See this [table](#points-distribution) for card points.
3. Alice places a bet to start the game.
4. Once the game starts, 2 cards are drawn - one for Alice and other for dealer. Then another one is drawn again for Alice.
5. Now Alice can either Hit or Stand. If Alice decides to Hit a new card is drawn for Alice. If Alice decides to stand it will be Dealer's turn to draw a card.
6. Alice will win if her score is <= 21 and Dealer's score is greater than 21 or less than Alice's score.
7. Alice will lose if her score is greater than 21 if she chooses to `Hit` or if dealer's score is greater than Alice's score if she chooses `Stand`.
8. If there is a tie in score, neither of them win. It is called a `Stand Off`.

Winnings is caluclated using the following formula:

```
round((bet_amount)*(trust_score/100))
```

## Demo

https://youtu.be/E6aPBEHzjpM?t=273

## Points Distribution

| Card Type | Points  |
| --------- | ------- |
| A         | 1 or 11 |
| 2         | 2       |
| 3         | 3       |
| 4         | 4       |
| 5         | 5       |
| 6         | 6       |
| 7         | 7       |
| 8         | 8       |
| 9         | 9       |
| 10        | 10      |
| J         | 10      |
| Q         | 10      |
| K         | 10      |
