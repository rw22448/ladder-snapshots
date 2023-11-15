import axios from "axios"

require("dotenv").config()

const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY || ""

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const logThenDelay = async (
  message: string,
  delayMilliseconds: number = 2000
) => {
  console.log(message)
  await delay(delayMilliseconds)
}

export const generateSnapshot = async () => {
  await logThenDelay("Running ladder-snapshot...")
  await logThenDelay("Generating snapshot...")
}

generateSnapshot()
