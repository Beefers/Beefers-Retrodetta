import { findByProps } from "@metro/filters";
import { PROXY_PREFIX } from "@lib/constants";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";

const showSimpleActionSheet = findByProps("showSimpleActionSheet");

export default () => after("showSimpleActionSheet", showSimpleActionSheet, (args) => {
    if (args[0].key !== "LongPressUrl") return;
    const { header: { title: url }, options } = args[0];

    if (!url.startsWith(PROXY_PREFIX)) return;

    options.push({
        label: "Install Plugin", onPress: () =>
            installPlugin(url).then(() => {
                showToast("Successfully installed", getAssetIDByName("Check"));
            }).catch((e: Error) => {
                showToast(e.message, getAssetIDByName("Small"));
            }),
    });
});