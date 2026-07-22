import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\n').forEach(line => {
    const parts = line.split('=')
    if (parts.length >= 2) {
      const key = parts[0].trim()
      const value = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '')
      process.env[key] = value
    }
  })
}

import { getServiceRoleClient } from '../lib/supabase'

async function run() {
  console.log("Verifying Application Summary Totals...\n")

  const now = new Date()

  // Today (local day boundaries mapped to UTC ISO)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Yesterday
  const yesterdayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
  const yesterdayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, -1)

  // Last 7 Days
  const last7DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)

  // Last 14 Days
  const last14DaysStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13)

  // Last Month
  const monthToDateStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const oldestDate = monthToDateStart < last14DaysStart ? monthToDateStart : last14DaysStart

  const supabase = getServiceRoleClient()
  const { data: apps, error } = await supabase
    .from('programme_applications')
    .select('programme_title, created_at')
    .gte('created_at', oldestDate.toISOString())

  if (error) {
    console.error("Error fetching data:", error)
    return
  }

  const summaryMap: Record<string, { today: number; yesterday: number; last7: number; last14: number; lastMonth: number }> = {}

  if (apps) {
    apps.forEach((app: any) => {
      const appDate = new Date(app.created_at)
      const title = app.programme_title || 'Unknown Programme'

      if (!summaryMap[title]) {
        summaryMap[title] = { today: 0, yesterday: 0, last7: 0, last14: 0, lastMonth: 0 }
      }

      const isToday = appDate >= todayStart
      const isYesterday = appDate >= yesterdayStart && appDate <= yesterdayEnd
      const isLast7 = appDate >= last7DaysStart
      const isLast14 = appDate >= last14DaysStart
      const isLastMonth = appDate >= monthToDateStart

      if (isToday) summaryMap[title].today++
      if (isYesterday) summaryMap[title].yesterday++
      if (isLast7) summaryMap[title].last7++
      if (isLast14) summaryMap[title].last14++
      if (isLastMonth) summaryMap[title].lastMonth++
    })
  }

  const summary = Object.entries(summaryMap).map(([title, counts]) => ({
    programmeTitle: title,
    ...counts
  }))

  console.log("Programme Summary Results:")
  console.table(summary)

  const totals = summary.reduce(
    (acc, curr) => {
      acc.today += curr.today
      acc.yesterday += curr.yesterday
      acc.last7 += curr.last7
      acc.last14 += curr.last14
      acc.lastMonth += curr.lastMonth
      return acc
    },
    { today: 0, yesterday: 0, last7: 0, last14: 0, lastMonth: 0 }
  )

  console.log("\nComputed Totals Across All Programmes:")
  console.log(`- Today: ${totals.today}`)
  console.log(`- Yesterday: ${totals.yesterday}`)
  console.log(`- Last 7 Days: ${totals.last7}`)
  console.log(`- Last 14 Days: ${totals.last14}`)
  console.log(`- Last Month: ${totals.lastMonth}`)
  
  console.log("\nValidation check: complete.")
}

run().catch(console.error)
