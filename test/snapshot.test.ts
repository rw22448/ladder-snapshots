import { sortRankedSnapshots } from "../compare"
import { Snapshot } from "../models/summoner"

describe(sortRankedSnapshots.name, () => {
  it("should sort ranks in the same tier", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "i",
        tier: "diamond",
        leaguePoints: 50,
      },
      {
        name: "Name 2",
        rank: "i",
        tier: "diamond",
        leaguePoints: 99,
      },
    ]

    sortRankedSnapshots(snapshots)

    expect(snapshots[0].name).toBe("Name 2")
    expect(snapshots[1].name).toBe("Name 1")
  })

  it("should sort ranks in the same tier in high elo", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "i",
        tier: "challenger",
        leaguePoints: 500,
      },
      {
        name: "Name 2",
        rank: "i",
        tier: "challenger",
        leaguePoints: 600,
      },
    ]

    sortRankedSnapshots(snapshots)

    expect(snapshots[0].name).toBe("Name 2")
    expect(snapshots[1].name).toBe("Name 1")
  })

  it("should sort ranks in the different tier", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "i",
        tier: "gold",
        leaguePoints: 99,
      },
      {
        name: "Name 2",
        rank: "i",
        tier: "platinum",
        leaguePoints: 50,
      },
      {
        name: "Name 3",
        rank: "i",
        tier: "diamond",
        leaguePoints: 1,
      },
      {
        name: "Name 4",
        rank: "i",
        tier: "master",
        leaguePoints: 0,
      },
    ]

    sortRankedSnapshots(snapshots)

    expect(snapshots[0].name).toBe("Name 4")
    expect(snapshots[1].name).toBe("Name 3")
    expect(snapshots[2].name).toBe("Name 2")
    expect(snapshots[3].name).toBe("Name 1")
  })

  it("should sort ranks in the different ranks", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "i",
        tier: "gold",
        leaguePoints: 0,
      },
      {
        name: "Name 2",
        rank: "ii",
        tier: "gold",
        leaguePoints: 20,
      },
      {
        name: "Name 3",
        rank: "iii",
        tier: "gold",
        leaguePoints: 40,
      },
      {
        name: "Name 4",
        rank: "iv",
        tier: "gold",
        leaguePoints: 60,
      },
    ]

    sortRankedSnapshots(snapshots)

    expect(snapshots[0].name).toBe("Name 4")
    expect(snapshots[1].name).toBe("Name 3")
    expect(snapshots[2].name).toBe("Name 2")
    expect(snapshots[3].name).toBe("Name 1")
  })

  it("should sort by leaguePoints if in the different tier within master/grandmaster/challenger", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "i",
        tier: "master",
        leaguePoints: 300,
      },
      {
        name: "Name 2",
        rank: "i",
        tier: "grandmaster",
        leaguePoints: 200,
      },
      {
        name: "Name 3",
        rank: "i",
        tier: "challenger",
        leaguePoints: 150,
      },
      {
        name: "Name 4",
        rank: "iv",
        tier: "diamond",
        leaguePoints: 99,
      },
      {
        name: "Name 5",
        rank: "i",
        tier: "master",
        leaguePoints: 0,
      },
    ]

    sortRankedSnapshots(snapshots)

    expect(snapshots[0].name).toBe("Name 1")
    expect(snapshots[1].name).toBe("Name 2")
    expect(snapshots[2].name).toBe("Name 3")
    expect(snapshots[3].name).toBe("Name 5")
    expect(snapshots[4].name).toBe("Name 4")
  })
})
