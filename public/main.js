// @ts-check

import { APIWrapper } from "./api.js";
import { EventManager } from "./eventManager.js";
import { MessageQueuer } from "./messageQueuer.js";

const api = new APIWrapper(null, true, true);
const messageQueuer = new MessageQueuer();

const manager = new EventManager(messageQueuer);
manager.start();

api.setEventHandler((events) => {
  manager.addEvents(events);
});

// NOTE: UI helper methods from `dom_updates` are already imported above.
