import { mongooseConnection } from "./mongoose-connection";
import { mongooseDisconnect } from "./mongoose-disconnect";

beforeAll(mongooseConnection);
afterAll(mongooseDisconnect);
