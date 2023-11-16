import axios, { AxiosResponse } from "axios"
import fs from "fs"
import path from "path"
import { exit } from "process"
import {
  EntriesBySummonerResponse,
  Snapshot,
  SummonerByNameResponse,
  SummonerProfile,
} from "./models/summoner"
import { sortRankedSnapshots } from "./compare"

require("dotenv").config()

const PERSONAL_API_KEY: string = process.env.PERSONAL_API_KEY || ""
const API_HOST: string = "https://oc1.api.riotgames.com"
const DEFAULT_API_DELAY: number = 1200 // To prevent hitting Riot API limit
const SHORT_API_DELAY: number = 50

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

export const generateSnapshot = async () => {
  console.log("Running ladder-snapshot...")
  console.log("Generating snapshot...")

  let data: string = ""

  try {
    data = fs.readFileSync(path.resolve(process.cwd(), "input.txt"), "utf-8")
  } catch {
    errorAndExit("Error: File 'input.txt' not found in expected position.")
  }

  let names = data.split(/\r?\n/)
  let successfulSummonerProfiles: SummonerProfile[] = []
  let failedNames: string[] = []

  const delay = names.length <= 50 ? SHORT_API_DELAY : DEFAULT_API_DELAY

  for (let i = 0; i < names.length; i++) {
    let name = names[i].trim()

    if (!!name) {
      await axios({
        method: "get",
        url: `${API_HOST}/lol/summoner/v4/summoners/by-name/${names[i]}`,
      })
        .then((response: AxiosResponse<SummonerByNameResponse>) => {
          successfulSummonerProfiles.push({
            id: response.data.id,
            name,
          })

          console.log(`Fetched summoner details for ${name}.`)
        })
        .catch((_error) => {
          console.log(`Failed to fetch summoner details for ${name}.`)
          failedNames.push(name)
        })
    }

    await sleep(delay)
  }

  let successfulSnapshots: Snapshot[] = []

  for (let j = 0; j < successfulSummonerProfiles.length; j++) {
    let summonerProfile = successfulSummonerProfiles[j]

    await axios({
      method: "get",
      url: `${API_HOST}/tft/league/v1/entries/by-summoner/${summonerProfile.id}`,
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
            rank: rankedTftData.rank.toLocaleLowerCase(),
            tier: rankedTftData.tier.toLocaleLowerCase(),
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

    await sleep(delay)
  }

  sortRankedSnapshots(successfulSnapshots)

  const date = new Date()
  const baseFileName = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${(
    "0" + date.getHours()
  ).slice(-2)}-${("0" + date.getMinutes()).slice(-2)}-${(
    "0" + date.getSeconds()
  ).slice(-2)}`

  await fs.promises.mkdir("./output", { recursive: true })

  var file = fs.createWriteStream(
    path.resolve(`${process.cwd()}/output`, `${baseFileName}.txt`)
  )
  for (let k = 0; k < successfulSnapshots.length; k++) {
    let snapshot = successfulSnapshots[k]

    file.write(
      `${snapshot.name} ${snapshot.tier} ${snapshot.rank} ${snapshot.leaguePoints}\n`
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

      file.write(`${failedName}\n`)
    }
  }

  console.log("Finished creating snapshot.")
}

generateSnapshot()
