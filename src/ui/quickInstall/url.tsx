import { findByProps } from "@metro/filters";
import { ReactNative as RN } from "@metro/common";
import { PROXY_PREFIX } from "@lib/constants";
import { after, instead } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { showConfirmationAlert } from "@ui/alerts";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";

const showSimpleActionSheet = findByProps("showSimpleActionSheet");
const handleClick = findByProps("handleClick");

function installWithToast(url: string) {
    installPlugin(url).then(() => {
        showToast("Successfully installed", getAssetIDByName("Check"));
    }).catch((e: Error) => {
        showToast(e.message, getAssetIDByName("Small"));
    });
}

export default () => {
    const patches = new Array<Function>;

    patches.push(after("showSimpleActionSheet", showSimpleActionSheet, (args) => {
        if (args[0].key !== "LongPressUrl") return;
        const { header: { title: url }, options } = args[0];

        if (!url.startsWith(PROXY_PREFIX)) return;

        options.push({
            label: "Install Plugin",
            onPress: () => installWithToast(url),
        });
    }));

    patches.push(instead("handleClick", handleClick, async function (this: any, args, orig) {
        const { href: url } = args[0];

        if (!url.startsWith(PROXY_PREFIX)) return orig.apply(this, args);

        showConfirmationAlert({
            title: "Hold Up",
            content: ["This link is a ", <RN.Text style={{ fontFamily: "Whitney-Semibold" }}>Plugin</RN.Text>, ", would you like to install it?"],
            onConfirm: () => installWithToast(url),
            confirmText: "Install",
            cancelText: "Cancel",
        });
    }));

    return () => patches.forEach((p) => p());
}