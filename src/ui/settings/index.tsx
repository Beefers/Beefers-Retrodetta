import { NavigationNative, i18n } from "@metro/common";
import { findByName } from "@metro/filters";
import { after } from "@lib/patcher";
import { installPlugin } from "@lib/plugins";
import { Forms } from "@ui/components";
import findInReactTree from "@lib/utils/findInReactTree";
import without from "@lib/utils/without";
import ErrorBoundary from "@ui/components/ErrorBoundary";
import SettingsSection from "@ui/settings/components/SettingsSection";
import InstallButton from "@ui/settings/components/InstallButton";
import General from "@ui/settings/pages/General";
import Plugins from "@ui/settings/pages/Plugins";
import Developer from "@ui/settings/pages/Developer";
import AssetBrowser from "@ui/settings/pages/AssetBrowser";

const screensModule = findByName("getScreens", false);
const settingsModule = findByName("UserSettingsOverviewWrapper", false);

export default function initSettings() {
    const patches = new Array<Function>;

    patches.push(after("default", screensModule, (args, existingScreens) => {
        return {
            ...existingScreens,
            VendettaSettings: {
                title: "Retrodetta",
                render: General,
            },
            VendettaPlugins: {
                title: "Plugins",
                render: Plugins,
                headerRight: () => <InstallButton alertTitle="Install Plugin" installFunction={installPlugin} />,
            },
            VendettaDeveloper: {
                title: "Developer",
                render: Developer,
            },
            VendettaAssetBrowser: {
                title: "Asset Browser",
                render: AssetBrowser,
            },
            VendettaCustomPage: {
                title: "Retrodetta Page",
                render: ({ render: PageView, noErrorBoundary, ...options }: { render: React.ComponentType, noErrorBoundary: boolean } & Record<string, object>) => {
                    const navigation = NavigationNative.useNavigation();
                    React.useEffect(() => options && navigation.setOptions(without(options, "render", "noErrorBoundary")), []);
                    return noErrorBoundary ? <PageView /> : <ErrorBoundary><PageView /></ErrorBoundary>;
                }
            }
        }
    }));

    after("default", settingsModule, (_, ret) => {
        // Upload logs button gone
        patches.push(after("renderSupportAndAcknowledgements", ret.type.prototype, (_, { props: { children } }) => {
            const index = children.findIndex((c: any) => c?.type?.name === "UploadLogsButton");
            if (index !== -1) children.splice(index, 1);
        }));

        patches.push(after("render", ret.type.prototype, (_, { props: { children } }) => {
            const titles = [i18n.Messages["BILLING_SETTINGS"], i18n.Messages["PREMIUM_SETTINGS"]];
            //! Fix for Android 174201 and iOS 42188
            children = findInReactTree(children, (tree) => tree.children[1].type === Forms.FormSection).children;
            const index = children.findIndex((c: any) => titles.includes(c?.props.label));
            children.splice(index === -1 ? 4 : index, 0, <SettingsSection />);
        }));
    }, true);

    return () => patches.forEach(p => p());
}
