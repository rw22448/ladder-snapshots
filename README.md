# ladder-snapshots

## Building the app

1. Run `ncc-build`.
2. Run `pkg-create-mac` or `yarn pkg-create-windows` to create executable shell scripts of the application native to either Mac or Windows platforms.

## Running the app

### Mac

Application is dependant on current working directory (on Mac) to be the directory with the executable, and relies on the `input.txt` file containing Summoner Names is located next to the executable.

1. Run `./ladder-snapshots` to run the script. Ensure that `input.txt` file containing Summoner Names, and `.env` file containing the API_KEY, are located next to the executable.

### Windows

1. Run `ladder-snapshots.exe`. Ensure that `input.txt` file containing Summoner Names, and `.env` file containing the API_KEY, are located next to the executable.

### Details

Won't capture snapshots if the player has not played RANKED_TFT (normal ranked ladder).
