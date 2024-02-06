# Board Game Campaign Tracker

An application to keep track of multiple board game campaign.

This application is developed using only HTML, Bootstrap and JavaScript(Vanilla). The purpose is to be a lightweight page to keep track of board game that have a campaign

The application is a little messy and I'm trying to refactor a little. It gets a little tricky because it does not have any tests.

### Supported Board Games

| Board Game                      | Status      |
|---------------------------------|-------------|
| Dark Souls                      | Done        |
| Mice and Mystics                | Done        |
| Resident Evil: The Board Game   | Done        |
| Resident Evil 3: The Board Game | Done        |

## Tests

The are made using the Playwright, to execute you just need to run

```bash
npm test
```

or

```bash
npx playwright test
```

# How to Include a New Game

To include it is needed to created a new `html` file in the `pages/boardgame` directory and there set the elements needed for the game.

In the `data` directory is stored the components of the game, like card list, scenarios. For a new game it's recommended to create a new one for it.

Also its recommended to include in the `js/boardgame` a directory for the game and all the needed scripts there. Give a look at the `modules` and `dom` script to make it easier to make the changes.

# Script Structure 

### BoardGame

The `boardgame` directory should include the directories for each game and the specific scripts.


### DOM

The `dom` directory should include the generic scripts for DOM manipulation, like element creation and removal.

### Modules

The `modules` directory should include the scripts that are shared across multiples games.

- `io.js`- Responsible for handling the Import/Export functionality
