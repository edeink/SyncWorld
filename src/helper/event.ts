import { EventEmitter } from 'events'

const eventBus = new EventEmitter()
export default eventBus

const EVENTS = {
  ADD_FAKE_VIDEO: 'add-fake-video',
}

export { EVENTS }
