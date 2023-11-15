import { Snapshot } from "./models/summoner"

const tierMap: Record<string, number> = {
  challenger: 8,
  grandmaster: 7,
  master: 6,
  diamond: 5,
  emerald: 4,
  platinum: 3,
  gold: 2,
  silver: 1,
  bronze: 0,
}

const rankMap: Record<string, number> = {
  iv: 3,
  iii: 2,
  ii: 1,
  i: 0,
}

const rankedSnapshotCompare = (a: Snapshot, b: Snapshot) => {
  if (
    (a.tier === "challenger" ||
      a.tier === "grandmaster" ||
      a.tier === "master") &&
    (b.tier === "challenger" || b.tier === "grandmaster" || b.tier === "master")
  ) {
    return a.leaguePoints - b.leaguePoints
  } else if (a.tier === b.tier) {
    if (a.rank === b.rank) {
      console.log(a.leaguePoints - b.leaguePoints)
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
