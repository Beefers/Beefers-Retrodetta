import { findByName, findByProps } from "@metro/filters";
import { DISCORD_SERVER_ID, PLUGINS_CHANNEL_ID, HTTP_REGEX_MULTI, PROXY_PREFIX } from "@lib/constants";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { findInReactTree } from "@lib/utils";
import { getAssetIDByName } from "@ui/assets";
import { showToast } from "@ui/toasts";
import { Forms } from "@ui/components";

const ForumPostLongPressActionSheet = findByName("ForumPostLongPressActionSheet", false);
const { FormRow } = Forms;
// Discord uses this Icon in action sheets. FormRow.Icon is too dark.
const Icon = findByName("Icon");

const { useFirstForumPostMessage } = findByProps("useFirstForumPostMessage");
const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");

export default () => after("default", ForumPostLongPressActionSheet, ([{ thread }], ret) => {
    if (thread.guild_id !== DISCORD_SERVER_ID || thread.parent_id !== PLUGINS_CHANNEL_ID) return;

    const { firstMessage } = useFirstForumPostMessage(thread);

    let urls = firstMessage?.content?.match(HTTP_REGEX_MULTI).filter((url: string) => url.startsWith(PROXY_PREFIX));
    if (!urls) return;

    const url = urls[0];
    if (!url) return;

    const actionsContainer = findInReactTree(ret, i => Array.isArray(i?.props?.children))?.props?.children;

    actionsContainer.unshift(<FormRow
        leading={<Icon source={getAssetIDByName("ic_download_24px")} />}
        label="Install Plugin"
        onPress={() =>
            installPlugin(url).then(() => {
                showToast(`Successfully installed ${thread.name}`, getAssetIDByName("Check"));
            }).catch((e: Error) => {
                showToast(e.message, getAssetIDByName("Small"));
            }).finally(() => hideActionSheet())
        }
    />);
});