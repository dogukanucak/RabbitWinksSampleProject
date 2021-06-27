import { addMessage, animateGift, isPossiblyAnimatingGift } from "./dom_updates.js";

/**
 * Organizes events
 * Stores new events into event queues
 * Display events by extracting from event repository
 * @param {*} queuer repository for events
 * @param {number} messageLifeTime defines after how many seconds a message is expired
 */
export const EventManager = function (queuer, messageLifeTime = 20) {
  this.queuer = queuer;
  this.messageLifeTime = messageLifeTime;

  /**
   * Provides next message from message queue
   * If a message is expired depending on `messageLifeTime`, skips it
   */
  const getNextMessage = () => {
    const lifeTimeInSeconds = messageLifeTime * 1000;

    let message = this.queuer.dequeueMessage();
    while (message && new Date().getTime() - message.timestamp > lifeTimeInSeconds) {
      message = this.queuer.dequeueMessage();
    }

    return message || null;
  };

  /**
   * For animated gifts: it may display it immediately if there is no animated gift in queue.
   * If there is pending animated gift, add newest animated gift to queue and displays pending one
   * @param {ApiEvent} message as instance of Animated Gift
   */
  const displayAnimatedGift = (message) => {
    // Add animated gift to animated gift queque
    this.queuer.enqueueAnimatedGift(message);
    // If there is not any animated gift displaying right now, display next animated gift
    if (!isPossiblyAnimatingGift()) {
      animateGift(this.queuer.dequeueAnimatedGift());
    }
  };

  /*
   * Display gift and message events
   */
  const displayMessage = (message) => {
    addMessage(message);
  };

  /**
   * Adds or displays next events depending on type and state
   * If next event is an animated gift, runs this method one more time immediately for other type of messages
   */
  const proceedNextEvent = () => {
    const message = getNextMessage();
    if (message) {
      if (message.type === "ag") {
        displayAnimatedGift(message);
        // If next event is type animated gift, get next message immediately for other types
        proceedNextEvent();
      } else {
        displayMessage(message);
      }
    }
  };

  /**
   * Lifecycle hook
   */
  const doCheck = () => {
    proceedNextEvent();
  };

  /**
   * Starts manager cycle
   * @param {number} cycleInterval determines the time interval between two life cycle where event processes are handled
   */
  this.start = (cycleInterval = 500) => {
    setInterval(doCheck, cycleInterval);
  };

  /**
   * Adds new events to queues
   * @param {ApiEvent[]} events recieved from api to be displayed through event queues
   */
  this.addEvents = (events) => {
    queuer.enqueueMessages(events);
  };
};
