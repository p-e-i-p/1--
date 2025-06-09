export function formateTime(time: number) {
  if (!time) return ''
  const date = new Date(time)
  const year: string | number = date.getFullYear()
  let month: string | number = date.getMonth() + 1
  let day: string | number = date.getDate()
  let hour: string | number = date.getHours()
  let minute: string | number = date.getMinutes()
  let seconds: string | number = date.getSeconds()

  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hour = hour < 10 ? '0' + hour : hour
  minute = minute < 10 ? '0' + minute : minute
  seconds = seconds < 10 ? '0' + seconds : seconds
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
  )
}
export function formateDate(time: number) {
  if (!time) return ''
  const date = new Date(time)
  const year: string | number = date.getFullYear()
  let month: string | number = date.getMonth() + 1
  let day: string | number = date.getDate()

  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day

  return year + '-' + month + '-' + day
}
