import axios from "axios"
import fs from "fs"
import path from "path"
import { exit } from "process"

require("dotenv").config()

const PERSONAL_API_KEY = process.env.PERSONAL_API_KEY || ""
const API_HOST = process.env.API_HOST || ""
const DEFAULT_LOG_DELAY = 2000 // TODO: Set to 2000

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

const logThenDelay = async (
  message: string,
  delayMilliseconds: number = DEFAULT_LOG_DELAY
) => {
  console.log(message)
  await delay(delayMilliseconds)
}

export const generateSnapshot = async () => {
  await logThenDelay("Running ladder-snapshot...")
  await logThenDelay("Generating snapshot...")

  let data: string = ""
  try {
    logThenDelay(__dirname, 0)
    logThenDelay(process.cwd(), 0)
    data = fs.readFileSync(path.resolve(process.cwd(), "input.txt"), "utf-8")
    // logThenDelay(data)
  } catch {
    console.error("Error: File 'input.txt' not found in expected position.")
    exit(0)
  }

  let names: string[] = data.split(/\r?\n/)
  names.forEach((name, index) => {
    logThenDelay(`${index + 1}: ${name}`)
  })

  fs.writeFileSync(path.resolve(process.cwd(), "output.txt"), data)
}

generateSnapshot()
