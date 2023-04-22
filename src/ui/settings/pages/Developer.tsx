import { ReactNative as RN, NavigationNative } from "@metro/common";
import { findByProps } from "@metro/filters";
import { connectToDebugger } from "@lib/debug";
import { useProxy } from "@lib/storage";
import { getAssetIDByName } from "@ui/assets";
import { Forms, ErrorBoundary } from "@ui/components";
import settings from "@lib/settings";

const { FormSection, FormRow, FormInput, FormDivider } = Forms;
const { hideActionSheet } = findByProps("openLazy", "hideActionSheet");
const { showSimpleActionSheet } = findByProps("showSimpleActionSheet");

export default function Developer() {
    const navigation = NavigationNative.useNavigation();

    useProxy(settings);

    return (
        <ErrorBoundary>
            <RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
                <FormSection title="Debug" android_noDivider={true}>
                    <FormInput
                        value={settings.debuggerUrl}
                        onChange={(v: string) => settings.debuggerUrl = v}
                        placeholder="127.0.0.1:9090"
                        title="DEBUGGER URL"
                    />
                    <FormDivider />
                    <FormRow
                        label="Connect to debug websocket"
                        leading={<FormRow.Icon source={getAssetIDByName("copy")} />}
                        onPress={() => connectToDebugger(settings.debuggerUrl)}
                    />
                    {window.__vendetta_rdc && <>
                        <FormDivider />
                        <FormRow
                            label="Connect to React DevTools"
                            leading={<FormRow.Icon source={getAssetIDByName("ic_badge_staff")} />}
                            onPress={() => window.__vendetta_rdc?.connectToDevTools({
                                host: settings.debuggerUrl.split(":")?.[0],
                                resolveRNStyle: RN.StyleSheet.flatten,
                            })}
                        />
                    </>}
                </FormSection>
                <FormSection title="Other">
                    <FormRow
                        label="Asset Browser"
                        leading={<FormRow.Icon source={getAssetIDByName("customization")} />}
                        trailing={FormRow.Arrow}
                        onPress={() => navigation.push("VendettaAssetBrowser")}
                    />
                    <FormDivider />
                    <FormRow
                        label="ErrorBoundary Tools"
                        leading={<FormRow.Icon source={getAssetIDByName("ic_warning_24px")} />}
                        trailing={FormRow.Arrow}
                        onPress={() => showSimpleActionSheet({
                            key: "ErrorBoundaryTools",
                            header: {
                                title: "Which ErrorBoundary do you want to trip?",
                                icon: <FormRow.Icon style={{ marginRight: 8 }} source={getAssetIDByName("ic_warning_24px")} />,
                                onClose: () => hideActionSheet(),
                            },
                            options: [
                                // @ts-expect-error 
                                // Of course, to trigger an error, we need to do something incorrectly. The below will do!
                                { label: "Vendetta", onPress: () => navigation.push("VendettaCustomPage", { render: () => <undefined /> }) },
                                { label: "Discord", isDestructive: true, onPress: () => navigation.push("VendettaCustomPage", { noErrorBoundary: true }) },
                            ],
                        })}
                    />
                </FormSection>
            </RN.ScrollView>
        </ErrorBoundary>
    )
}
