import { useMemo, useState } from 'react'
import TimetableCell from './TimetableCell.jsx'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TIME_SLOTS = [
  { label: '09:00 - 09:55', code: 'S1' },
  { label: '10:00 - 10:55', code: 'S2' },
  { label: '11:00 - 11:55', code: 'S3' },
  { label: '12:00 - 12:55', code: 'S4' },
  { label: '02:00 - 02:55', code: 'S5' },
  { label: '03:00 - 03:55', code: 'S6' }
]

// Example dataset (can be replaced with real data later)
const TIMETABLE = {
  Mon: {
    S1: { subject: 'Data Structures', time: '09:00 - 09:55', faculty: 'Dr. A. Kumar' },
    S2: { subject: 'Operating Systems', time: '10:00 - 10:55', faculty: 'Prof. R. Singh' },
    S3: { subject: 'Mathematics III', time: '11:00 - 11:55', faculty: 'Dr. N. Verma' },
    S4: null,
    S5: { subject: 'Discrete Math', time: '02:00 - 02:55', faculty: 'Dr. P. Iyer' },
    S6: null
  },
  Tue: {
    S1: { subject: 'Web Development', time: '09:00 - 09:55', faculty: 'Prof. S. Mehta' },
    S2: null,
    S3: { subject: 'Database Systems', time: '11:00 - 11:55', faculty: 'Dr. L. Shah' },
    S4: { subject: 'Software Design', time: '12:00 - 12:55', faculty: 'Dr. K. Rao' },
    S5: null,
    S6: { subject: 'Lab Session', time: '03:00 - 03:55', faculty: 'TA Team' }
  },
  Wed: {
    S1: null,
    S2: { subject: 'Computer Networks', time: '10:00 - 10:55', faculty: 'Prof. V. Desai' },
    S3: { subject: 'Mathematics III', time: '11:00 - 11:55', faculty: 'Dr. N. Verma' },
    S4: null,
    S5: { subject: 'Web Development', time: '02:00 - 02:55', faculty: 'Prof. S. Mehta' },
    S6: null
  },
  Thu: {
    S1: { subject: 'Operating Systems', time: '09:00 - 09:55', faculty: 'Prof. R. Singh' },
    S2: { subject: 'Data Structures', time: '10:00 - 10:55', faculty: 'Dr. A. Kumar' },
    S3: null,
    S4: { subject: 'Database Systems', time: '12:00 - 12:55', faculty: 'Dr. L. Shah' },
    S5: null,
    S6: { subject: 'Seminar', time: '03:00 - 03:55', faculty: 'Guest Lecturer' }
  },
  Fri: {
    S1: null,
    S2: { subject: 'Discrete Math', time: '10:00 - 10:55', faculty: 'Dr. P. Iyer' },
    S3: { subject: 'Computer Networks', time: '11:00 - 11:55', faculty: 'Prof. V. Desai' },
    S4: null,
    S5: { subject: 'Software Design', time: '02:00 - 02:55', faculty: 'Dr. K. Rao' },
    S6: null
  },
  Sat: {
    S1: { subject: 'Lab Session', time: '09:00 - 09:55', faculty: 'TA Team' },
    S2: null,
    S3: null,
    S4: { subject: 'Capstone Review', time: '12:00 - 12:55', faculty: 'Mentor' },
    S5: null,
    S6: null
  },
  Sun: {
    S1: null,
    S2: null,
    S3: null,
    S4: null,
    S5: null,
    S6: null
  }
}

function normalize(s) {
  return (s || '').toString().trim().toLowerCase()
}

const VIEW_MODES = ['weekly', 'daily', 'subject']

function formatDayFull(day) {
  const map = {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
    Sun: 'Sunday'
  }
  return map[day] || day
}

export default function Timetable() {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('weekly')
  const [selectedDay, setSelectedDay] = useState('Mon')
  const [subjectFilter, setSubjectFilter] = useState('')

  // Current-day/current-lecture highlighting (approx based on local time).
  const now = new Date()
  const currentDayIndex = now.getDay() // 0=Sun..6=Sat
  const dayCodeOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentDay = dayCodeOrder[currentDayIndex] || 'Mon'

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  // Map current time to the closest slot (S1..S6). We'll define ranges by label start.
  // These are approximate and can be replaced later.
  const currentSlotCode = (() => {
    if (currentMinutes < 9 * 60) return null
    if (currentMinutes < 10 * 60) return 'S1'
    if (currentMinutes < 11 * 60) return 'S2'
    if (currentMinutes < 12 * 60) return 'S3'
    if (currentMinutes < 13 * 60) return 'S4'
    if (currentMinutes < 15 * 60) return 'S5'
    return 'S6'
  })()


  const DAYS_INDEX = useMemo(() => {
    const m = new Map()
    DAYS.forEach((d, i) => m.set(d, i))
    return m
  }, [])

  const goPrevDay = () => {
    const i = DAYS_INDEX.get(selectedDay) ?? 0
    const next = (i - 1 + DAYS.length) % DAYS.length
    setSelectedDay(DAYS[next])
  }

  const goNextDay = () => {
    const i = DAYS_INDEX.get(selectedDay) ?? 0
    const next = (i + 1) % DAYS.length
    setSelectedDay(DAYS[next])
  }


  const q = normalize(query)
  const subjectQ = normalize(subjectFilter)

  const filtered = useMemo(() => {
    // Start from sample timetable; apply query + subject filter.
    // Keep output shape: filtered[day][slotCode] -> item | null
    const next = {}
    for (const day of DAYS) {
      next[day] = {}
      for (const slot of TIME_SLOTS) {
        const item = TIMETABLE[day]?.[slot.code]
        if (!item) {
          next[day][slot.code] = null
          continue
        }

        let ok = true

        if (q) {
          const haystack = normalize(`${item.subject} ${item.faculty} ${item.time}`)
          ok = ok && haystack.includes(q)
        }

        if (subjectQ) {
          ok = ok && normalize(item.subject).includes(subjectQ)
        }

        next[day][slot.code] = ok ? item : null
      }
    }
    return next
  }, [q, subjectQ])

  const matchedCount = useMemo(() => {
    if (!q && !subjectQ) return null
    let count = 0
    for (const day of DAYS) {
      for (const slot of TIME_SLOTS) {
        if (filtered[day]?.[slot.code]) count++
      }
    }
    return count
  }, [filtered, q, subjectQ])


  return (
    <section className="card">
      <div className="timetableWrap">
        <div className="controls">
          <div className="search">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: OS, Data Structures, Dr. L. Shah"
            />
          </div>

          <div className="search" style={{ minWidth: 220 }}>
            <label htmlFor="subjectFilter">Subject filter</label>
            <input
              id="subjectFilter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              placeholder="e.g. OS / Maths"
            />
          </div>

          <div className="pill" aria-live="polite">
            <span>Matches:</span>
            <strong>{matchedCount === null ? 'All' : matchedCount}</strong>
          </div>
        </div>

        <div className="controls" style={{ paddingTop: 0 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="pill">
              <span>View</span>
              <strong style={{ textTransform: 'capitalize' }}>{viewMode}</strong>
            </div>

            <div className="seg">
              {VIEW_MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={m === viewMode ? 'segBtn active' : 'segBtn'}
                  onClick={() => setViewMode(m)}
                >
                  {m === 'weekly' ? 'Weekly' : m === 'daily' ? 'Daily' : 'Subject-wise'}
                </button>
              ))}
            </div>

            {viewMode !== 'weekly' && (
              <div className="nav">
                <button type="button" className="navBtn" onClick={goPrevDay} aria-label="Previous day">
                  ◀
                </button>
                <div className="navDay">
                  <span className="navDayLabel">{formatDayFull(selectedDay)}</span>
                  <select
                    className="navSelect"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    aria-label="Select day"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="navBtn" onClick={goNextDay} aria-label="Next day">
                  ▶
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="tableScroll">
          <table className="timetable">
            <thead>
              <tr>
                <th className="timeCol">Time</th>
                {(viewMode === 'daily' || viewMode === 'subject') ? [selectedDay].map((d) => <th key={d}>{d}</th>) : DAYS.map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot) => (
                <tr key={slot.code}>
                  <td className="timeCol">
                    <div className="slotTime">
                      <div className="time">{slot.label}</div>
                      <div className="tag">Slot {slot.code}</div>
                    </div>
                  </td>
                  {(viewMode === 'daily' || viewMode === 'subject')
                    ? [selectedDay].map((day) => (
                        <td key={day + slot.code}>
                          <TimetableCell
                            item={filtered[day]?.[slot.code] ?? null}
                            isCurrentDay={day === currentDay}
                            isCurrentLecture={
                              day === currentDay && slot.code === currentSlotCode
                            }
                          />
                        </td>
                      ))
                    : DAYS.map((day) => (
                        <td key={day + slot.code}>
                          <TimetableCell
                            item={filtered[day]?.[slot.code] ?? null}
                            isCurrentDay={day === currentDay}
                            isCurrentLecture={
                              day === currentDay && slot.code === currentSlotCode
                            }
                          />
                        </td>
                      ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}


