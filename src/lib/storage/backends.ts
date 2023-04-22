import { StorageBackend } from "@types";
import { MMKVManager } from "@lib/native";

export const createMMKVBackend = (store: string): StorageBackend => ({
    get: async () => JSON.parse((await MMKVManager.getItem(store)) ?? "{}"),
    set: (data) => MMKVManager.setItem(store, JSON.stringify(data)),
});