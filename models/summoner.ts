export interface AccountDto {
  puuid?: string
  gameName?: string
  tagLine?: string
}

export interface SummonerDto {
  accountId?: string
  profileIconId?: number
  revisionDate?: number
  name?: string
  id?: string
  puuid?: string
  summonerLevel?: number
}

export interface EntriesBySummonerResponse {
  puuid?: string
  leagueId?: string
  summonerId?: string
  summonerName?: string
  queueType?: string
  ratedTier?: string
  ratedRating?: number
  tier?: string
  rank?: string
  leaguePoints?: number
  wins?: number
  losses?: number
  hotStreak?: boolean
  veteran?: boolean
  freshBlood?: boolean
  inactive?: boolean
  miniSeries?: MiniSeriesDTO
}

interface MiniSeriesDTO {
  losses?: number
  progress?: string
  target?: number
  wins?: number
}

export interface SummonerProfile extends Pick<AccountDto, "puuid"> {
  name: string
  id?: string
}

export interface Snapshot {
  name: string
  rank: string
  tier: string
  leaguePoints: number
}
