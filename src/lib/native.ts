import { MMKVManager as _MMKVManager } from "@types";
const nmp = window.nativeModuleProxy;

export const MMKVManager = nmp.MMKVManager as _MMKVManager;
export const ClientInfoManager = nmp.InfoDictionaryManager
export const DeviceManager = nmp.DCDDeviceManager;
export const BundleUpdaterManager = nmp.BundleUpdaterManager;