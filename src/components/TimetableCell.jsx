export default function TimetableCell({ item, isCurrentDay = false, isCurrentLecture = false }) {
  if (!item) {
    return (
      <div className={"cell empty" + (isCurrentLecture ? ' currentLecture' : '')}>
        <div className="subject">—</div>
        <div className="badges">
          <span className="badge time">Free</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        'cell' +
        (isCurrentDay ? ' currentDay' : '') +
        (isCurrentLecture ? ' currentLecture' : '')
      }
    >
      <div className="subject">{item.subject}</div>
      <div className="badges">
        <span className="badge time">{item.time}</span>
        <span className="badge faculty">{item.faculty}</span>
      </div>
    </div>
  )
}


