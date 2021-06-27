export const MessageQueuer = function () {
  /**
   * Queque storage for all messages
   * New messages are stored here
   * Display messages are removed from queque
   */
  const msgQueue = [];
  /**
   * ID storage for all messages
   * Used to keep track on possible duplicate messages
   */
  const receivedIds = [];

  /**
   * Prioritization order
   */
  const TYPE_ORDER = ["ag"];

  /**
   * Queue storage for animated gifts
   */
  const animatedGiftQueue = [];

  /**
   * Adds new events to queue
   * @param {ApiEvent[]} msgs
   */
  this.enqueueMessages = function (msgs) {
    // Sorts events according to prioritization
    msgs.sort((a, b) => {
      return TYPE_ORDER.indexOf(b.type) - TYPE_ORDER.indexOf(a.type);
    });

    // Filter passes if current message queue does not contain `msgs` and not a duplicate of any previous received events
    const itemsToPush = msgs.filter((msg) => msgQueue.indexOf((queueMsg) => queueMsg.id === msg.id) === -1 && !receivedIds.includes(msg.id));

    // Store recieved ids to prevent future duplicate events
    receivedIds.push(...itemsToPush.map((item) => item.id));

    msgQueue.push(...itemsToPush);
  };

  /**
   * Removes first element in queque and returns it
   */
  this.dequeueMessage = function () {
    return msgQueue.splice(0, 1)[0];
  };

  /**
   * Appends animated gift event into queue for animated gifts
   * @param {ApiEvent} ag
   */
  this.enqueueAnimatedGift = function (ag) {
    animatedGiftQueue.push(ag);
  };

  /**
   * Removes first animated gift and returns it
   */
  this.dequeueAnimatedGift = function () {
    return animatedGiftQueue.splice(0, 1)[0];
  };
};
