import { sortRankedSnapshots } from "../compare"
import { Snapshot } from "../models/summoner"

describe(sortRankedSnapshots.name, () => {
  it("should sort ranks in the same tier", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "I",
        tier: "Diamond",
        leaguePoints: 50,
      },
      {
        name: "Name 2",
        rank: "I",
        tier: "Diamond",
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
        rank: "I",
        tier: "Challenger",
        leaguePoints: 500,
      },
      {
        name: "Name 2",
        rank: "I",
        tier: "Challenger",
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
        rank: "I",
        tier: "Gold",
        leaguePoints: 99,
      },
      {
        name: "Name 2",
        rank: "I",
        tier: "Platinum",
        leaguePoints: 50,
      },
      {
        name: "Name 3",
        rank: "I",
        tier: "Diamond",
        leaguePoints: 1,
      },
      {
        name: "Name 4",
        rank: "I",
        tier: "Master",
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
        rank: "IV",
        tier: "Gold",
        leaguePoints: 60,
      },
      {
        name: "Name 2",
        rank: "III",
        tier: "Gold",
        leaguePoints: 40,
      },
      {
        name: "Name 3",
        rank: "II",
        tier: "Gold",
        leaguePoints: 20,
      },
      {
        name: "Name 4",
        rank: "I",
        tier: "Gold",
        leaguePoints: 0,
      },
    ]

    sortRankedSnapshots(snapshots)

    console.log(snapshots)

    expect(snapshots[0].name).toBe("Name 4")
    expect(snapshots[1].name).toBe("Name 3")
    expect(snapshots[2].name).toBe("Name 2")
    expect(snapshots[3].name).toBe("Name 1")
  })

  it("should sort by leaguePoints if in the different tier within master/grandmaster/challenger", () => {
    const snapshots: Snapshot[] = [
      {
        name: "Name 1",
        rank: "I",
        tier: "Master",
        leaguePoints: 300,
      },
      {
        name: "Name 2",
        rank: "I",
        tier: "Grandmaster",
        leaguePoints: 200,
      },
      {
        name: "Name 3",
        rank: "I",
        tier: "Challenger",
        leaguePoints: 150,
      },
      {
        name: "Name 4",
        rank: "IV",
        tier: "Diamond",
        leaguePoints: 99,
      },
      {
        name: "Name 5",
        rank: "I",
        tier: "Master",
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
