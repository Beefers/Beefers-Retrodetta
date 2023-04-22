import { Settings } from "@types";
import { createMMKVBackend, createStorage, wrapSync } from "@lib/storage";

export default wrapSync(createStorage<Settings>(createMMKVBackend("VENDETTA_SETTINGS")));