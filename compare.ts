import { Snapshot } from "./models/summoner"

const tierMap: Record<string, number> = {
  Challenger: 8,
  Grandmaster: 7,
  Master: 6,
  Diamond: 5,
  Emerald: 4,
  Platinum: 3,
  Gold: 2,
  Silver: 1,
  Bronze: 0,
}

const rankMap: Record<string, number> = {
  IV: 3,
  III: 2,
  II: 1,
  I: 0,
}

const rankedSnapshotCompare = (a: Snapshot, b: Snapshot) => {
  if (
    (a.tier === "Challenger" ||
      a.tier === "Grandmaster" ||
      a.tier === "Master") &&
    (b.tier === "Challenger" || b.tier === "Grandmaster" || b.tier === "Master")
  ) {
    return a.leaguePoints - b.leaguePoints
  } else if (a.tier === b.tier) {
    if (a.rank === b.rank) {
      return a.leaguePoints - b.leaguePoints
    } else {
      return rankMap[a.tier] - rankMap[b.tier]
    }
  } else {
    return tierMap[a.tier] - tierMap[b.tier]
  }
}

export const sortRankedSnapshots = (snapshots: Snapshot[]): void => {
  snapshots.sort(rankedSnapshotCompare)
  snapshots.reverse()
}
