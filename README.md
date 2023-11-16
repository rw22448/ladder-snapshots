# ladder-snapshots

## Building the app

TODO.

## Running the app

- Application is dependant on current working directory (on Mac) to be the directory with the executable, and relies on the `input.txt` file containing Summoner Names is located next to the executable.

### Mac

1. Open Terminal.
2. Navigate to working directory containing `index` script.
3. Run `./ladder-snapshot` to run the script. Ensure that `input.txt` file containing Summoner Names, and `.env` file containing the API_KEY, are located next to the executable.

### Windows

1. Run `ladder-snapshot.exe`. Ensure that `input.txt` file containing Summoner Names, and `.env` file containing the API_KEY, are located next to the executable.

### Details

- Won't capture snapshots if the player has not played RANKED_TFT (normal ranked ladder).
