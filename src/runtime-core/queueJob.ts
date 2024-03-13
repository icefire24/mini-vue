let queue: any[] = []
let isFlushPending = false
export function nextTick(fn) {
  return fn ? Promise.resolve().then(fn) : Promise.resolve()
}
function queueJobs(job) {
  console.log('scheduler')

  if (queue.includes(job)) return
  queueFlush(job)
}
export { queueJobs }
function queueFlush(job: any) {
  if (isFlushPending) {
    return
  }
  isFlushPending = true
  queue.push(job)
  new Promise((resolve) => {
    resolve(1)
  }).then(() => {
    isFlushPending = false
    queue.forEach((job) => {
      job()
    })
    queue = []
  })
}
