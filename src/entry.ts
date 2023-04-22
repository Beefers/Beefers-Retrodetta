import { ClientInfoManager } from "@lib/native";

// This logs in the native logging implementation, e.g. logcat
console.log("Hello from Onetwosixetta!");

import(".").then((m) => m.default()).catch((e) => {
    console.log(e?.stack ?? e.toString());
    alert([
        "Failed to load Onetwosixetta!\n",
        `Build Number: ${ClientInfoManager.Version.split(" - ")[2]}`,
        // @ts-expect-error, replaced in build script
        `Onetwosixetta: ${__vendettaVersion}`,
        e?.stack || e.toString(),
    ].join("\n"));
});
