import axios, { AxiosResponse } from "axios"
import fs from "fs"
import path from "path"
import { exit } from "process"
import {
  AccountDto,
  EntriesBySummonerResponse,
  Snapshot,
  SummonerDto,
  SummonerProfile,
} from "./models/summoner"
import { sortRankedSnapshots } from "./compare"

require("dotenv").config()

const PERSONAL_API_KEY: string = process.env.PERSONAL_API_KEY || ""
const OCE_API_HOST: string = "https://oc1.api.riotgames.com"
const AMERICAS_API_HOST: string = "https://americas.api.riotgames.com"
const DEFAULT_API_DELAY: number = 1200 // To prevent hitting Riot API limit

axios.interceptors.request.use((req) => {
  req.headers["X-Riot-Token"] = PERSONAL_API_KEY
  return req
})

const errorAndExit = (error: any) => {
  console.error(error)
  exit(0)
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const getMessageByCondition = (string: string, condition: boolean) =>
  condition ? string : ""

export const generateSnapshot = async () => {
  console.log("Running ladder-snapshot...")
  console.log("Generating snapshot...")

  let input: string = ""

  // Read input file
  try {
    input = fs.readFileSync(path.resolve(process.cwd(), "input.txt"), "utf-8")
  } catch {
    errorAndExit("Error: File 'input.txt' not found in expected position.")
  }

  let names: string[] = input.split(/\r?\n/)
  let successfulSummonerProfilesWithoutId: SummonerProfile[] = []
  let successfulSummonerProfilesWithId: SummonerProfile[] = []
  let failedNames: string[] = []

  console.log("Fetching account details...")

  // Fetch account details from API
  for (let i = 0; i < names.length; i++) {
    let name: string = names[i].trim()
    let nameParts: string[] = name.split("#")
    let riotName: string = nameParts[0]
    let riotTag: string = nameParts[1]

    if (!!nameParts.length) {
      await axios({
        method: "get",
        url: `${AMERICAS_API_HOST}/riot/account/v1/accounts/by-riot-id/${riotName}/${riotTag}`,
      })
        .then((response: AxiosResponse<AccountDto>) => {
          successfulSummonerProfilesWithoutId.push({
            puuid: response.data.puuid,
            name,
            id: "",
          })

          console.log(`Fetched account details for ${name}.`)
        })
        .catch((_error) => {
          console.log(`Failed to fetch summoner details for ${name}.`)
          failedNames.push(name)
        })

      await sleep(DEFAULT_API_DELAY)
    }
  }

  console.log("Fetching summoner details...")

  // Fetch summoner details from API
  for (let m = 0; m < successfulSummonerProfilesWithoutId.length; m++) {
    let name: string = successfulSummonerProfilesWithoutId[m].name.trim()
    let puuid: string =
      successfulSummonerProfilesWithoutId[m].puuid?.trim() ?? ""

    await axios({
      method: "get",
      url: `${OCE_API_HOST}/tft/summoner/v1/summoners/by-puuid/${puuid}`,
    })
      .then((response: AxiosResponse<SummonerDto>) => {
        successfulSummonerProfilesWithId.push({
          puuid: response.data.puuid,
          name,
          id: response.data.id,
        })

        console.log(`Fetched summoner details for ${name}.`)
      })
      .catch((_error) => {
        console.log(`Failed to fetch summoner details for ${name}.`)
        failedNames.push(name)
      })

    await sleep(DEFAULT_API_DELAY)
  }

  let successfulSnapshots: Snapshot[] = []

  console.log("Fetching snapshot details...")

  // Fetch snapshot details from API
  for (let j = 0; j < successfulSummonerProfilesWithId.length; j++) {
    let summonerProfile = successfulSummonerProfilesWithId[j]

    await axios({
      method: "get",
      url: `${OCE_API_HOST}/tft/league/v1/entries/by-summoner/${summonerProfile.id}`,
    })
      .then((response: AxiosResponse<EntriesBySummonerResponse[]>) => {
        const data = response.data
        const rankedTftData = data.find(
          (entry) => entry.queueType === "RANKED_TFT"
        )

        if (
          rankedTftData &&
          rankedTftData.leaguePoints !== undefined &&
          rankedTftData.rank !== undefined &&
          rankedTftData.tier !== undefined
        ) {
          successfulSnapshots.push({
            name: summonerProfile.name ?? "",
            rank: rankedTftData.rank,
            tier:
              rankedTftData.tier.charAt(0).toUpperCase() +
              rankedTftData.tier.slice(1).toLocaleLowerCase(),
            leaguePoints: rankedTftData.leaguePoints,
          })

          console.log(
            `Successfully captured snapshot for ${summonerProfile.name}.`
          )
        } else {
          console.log(
            `Failed to capture snapshot for ${summonerProfile.name}. Missing rank, tier, or leaguePoints data.`
          )
          failedNames.push(summonerProfile.name ?? "")
        }
      })
      .catch((error) => {
        console.log(`Failed to capture snapshot for ${summonerProfile.name}.`)
        console.log(error)
        failedNames.push(summonerProfile.name ?? "")
      })

    await sleep(DEFAULT_API_DELAY)
  }

  sortRankedSnapshots(successfulSnapshots)

  console.log("Saving snapshot details...")

  // Create output file
  const date = new Date()
  const baseFileName = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}-${("0" + date.getHours()).slice(-2)}-${(
    "0" + date.getMinutes()
  ).slice(-2)}-${("0" + date.getSeconds()).slice(-2)}`

  await fs.promises.mkdir("./output", { recursive: true })

  var file = fs.createWriteStream(
    path.resolve(`${process.cwd()}/output`, `${baseFileName}.txt`)
  )

  for (let k = 0; k < successfulSnapshots.length; k++) {
    let snapshot = successfulSnapshots[k]

    file.write(
      `${snapshot.name} ${snapshot.tier} ${snapshot.rank} ${
        snapshot.leaguePoints
      }${getMessageByCondition("\n", k !== successfulSnapshots.length - 1)}`
    )
  }

  if (failedNames.length) {
    var file = fs.createWriteStream(
      path.resolve(
        `${process.cwd()}/output`,
        `${baseFileName}-failed-names.txt`
      )
    )

    for (let l = 0; l < failedNames.length; l++) {
      let failedName = failedNames[l]

      file.write(
        `${failedName}${getMessageByCondition(
          "\n",
          l !== successfulSnapshots.length - 1
        )}`
      )
    }
  }

  var csvFile = fs.createWriteStream(
    path.resolve(`${process.cwd()}/output`, `${baseFileName}.csv`)
  )

  for (let n = 0; n < successfulSnapshots.length; n++) {
    let snapshot = successfulSnapshots[n]

    csvFile.write(
      `${n + 1}, ${snapshot.name.split("#")[0]}, ${snapshot.tier} ${
        snapshot.rank
      } ${snapshot.leaguePoints}${getMessageByCondition(
        "\n",
        n !== successfulSnapshots.length - 1
      )}`
    )
  }

  console.log("Finished creating snapshot.")
}

generateSnapshot()
