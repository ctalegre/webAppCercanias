import moment from 'moment'
let utils = {}
utils.target = (hour) => {
  return moment(hour.trim().replace('.', ':'), 'HH:mm')
}
utils.isTrainLost = (hour, now=moment()) => {
  let target = utils.target(hour)
  let isAfter = moment(target).isSameOrAfter(now, 'minutes')
  return isAfter ? now.to(target, true) : ''
}

utils.isOnMinutesBefore = (hour, minutesBefore) => {
  let initTarget = utils.target(hour)
  let beforeTarget = moment(initTarget).subtract(minutesBefore, 'minutes')
  let isAfter = moment().isSameOrAfter(moment(beforeTarget), 'minutes')
  return isAfter
}

utils.goodTrains = (minutesOfTravel, maxium) => {
  return Number(minutesOfTravel) <= Number(maxium)
}

utils.getLineClassname = (line) => {
  if(line !== 'C6') return 'C6_'
  return line
}

export default utils
