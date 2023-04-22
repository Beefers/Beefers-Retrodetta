import { NavigationNative } from "@metro/common";
import { useProxy } from "@lib/storage";
import { ErrorBoundary, Forms } from "@ui/components";
import settings from "@lib/settings";

const { FormRow, FormSection, FormDivider } = Forms;

export default function SettingsSection() {
    const navigation = NavigationNative.useNavigation();
    useProxy(settings);

    return (
        <ErrorBoundary>
            {/* I commented out all of the icons here to match Discord's UI */}
            <FormSection key="Vendetta" title={`Onetwosixetta${settings.safeMode?.enabled ? " (Safe Mode)" : ""}`}>
                <FormRow
                    label="General"
                    // leading={<FormRow.Icon source={getAssetIDByName("settings")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaSettings")}
                />
                <FormDivider />
                <FormRow
                    label="Plugins"
                    // leading={<FormRow.Icon source={getAssetIDByName("debug")} />}
                    trailing={FormRow.Arrow}
                    onPress={() => navigation.push("VendettaPlugins")}
                />
                {settings.developerSettings && (
                    <>
                        <FormDivider />
                        <FormRow
                            label="Developer"
                            // leading={<FormRow.Icon source={getAssetIDByName("ic_robot_24px")} />}
                            trailing={FormRow.Arrow}
                            onPress={() => navigation.push("VendettaDeveloper")}
                        />
                    </>
                )}
            </FormSection>
        </ErrorBoundary>
    )
}