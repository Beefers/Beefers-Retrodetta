import { ClientInfoManager } from "@lib/native";

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Retrodetta!");

import(".").then((m) => m.default()).catch((e) => {
    console.log(e?.stack ?? e.toString());
    alert([
        "Failed to load Retrodetta!\n",
        `Build Number: ${ClientInfoManager.Version.split(" - ")[2]}`,
        // @ts-expect-error, replaced in build script
        `Retrodetta: ${__vendettaVersion}`,
        e?.stack || e.toString(),
    ].join("\n"));
});
