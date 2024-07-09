import mongoose from "mongoose";

import { restartCounters } from "./counters";

export async function clearDatabase() {
  await mongoose.connection.dropDatabase();
}

export async function clearDbAndRestartCounters() {
  await clearDatabase();
  restartCounters();
}
