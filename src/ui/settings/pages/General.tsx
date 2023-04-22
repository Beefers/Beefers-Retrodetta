import { ReactNative as RN, url } from "@metro/common";
import { DISCORD_SERVER, GITHUB } from "@lib/constants";
import { getDebugInfo, toggleSafeMode } from "@lib/debug";
import { useProxy } from "@lib/storage";
import { BundleUpdaterManager } from "@lib/native";
import { getAssetIDByName } from "@ui/assets";
import { Forms, Summary, ErrorBoundary } from "@ui/components";
import settings from "@lib/settings";
import Version from "@ui/settings/components/Version";

const { FormRow, FormSwitchRow, FormSection, FormDivider } = Forms;
const debugInfo = getDebugInfo();

export default function General() {
    useProxy(settings);

    const versions = [
        {
            label: "Retrodetta",
            version: debugInfo.vendetta.version,
            icon: "debug",
        },
        {
            label: "Discord",
            version: `${debugInfo.discord.version} (${debugInfo.discord.build})`,
            icon: "Discord",
        },
        {
            label: "React",
            version: debugInfo.react.version,
            icon: "ic_category_16px",
        },
        {
            label: "React Native",
            version: debugInfo.react.nativeVersion,
            icon: "grid",
        },
        {
            label: "Bytecode",
            version: debugInfo.hermes.bytecodeVersion,
            icon: "ic_server_security_24px",
        },
    ];

    const platformInfo = [
        {
            label: "Loader",
            version: debugInfo.vendetta.loader,
            icon: "ic_download_24px",
        },
        {
            label: "Operating System",
            version: `${debugInfo.os.name} ${debugInfo.os.version}`,
            icon: "ic_cog_24px"
        },
        ...(debugInfo.os.sdk ? [{
            label: "SDK",
            version: debugInfo.os.sdk,
            icon: "ic_profile_badge_verified_developer_color"
        }] : []),
        {
            label: "Manufacturer",
            version: debugInfo.device.manufacturer,
            icon: "submarine"
        },
        {
            label: "Brand",
            version: debugInfo.device.brand,
            icon: "img_nitro_server_avatar"
        },
        {
            label: "Model",
            version: debugInfo.device.model,
            icon: "voice_bar_phone"
        },
        {
            label: RN.Platform.select({ android: "Codename", ios: "Machine ID" })!,
            version: debugInfo.device.codename,
            icon: "ic_compose_24px"
        }
    ];

    return (
        <ErrorBoundary>
            <RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
                <FormSection title="Links" android_noDivider={true}>
                    <FormRow
                        label="Discord Server"
                        leading={<FormRow.Icon source={getAssetIDByName("Discord")} />}
                        trailing={FormRow.Arrow}
                        onPress={() => url.openDeeplink(DISCORD_SERVER)}
                    />
                    <FormDivider />
                    <FormRow
                        label="GitHub"
                        leading={<FormRow.Icon source={getAssetIDByName("img_account_sync_github_white")} />}
                        trailing={FormRow.Arrow}
                        onPress={() => url.openURL(GITHUB)}
                    />
                </FormSection>
                <FormSection title="Actions">
                    <FormRow
                        label="Reload Discord"
                        leading={<FormRow.Icon source={getAssetIDByName("ic_message_retry")} />}
                        onPress={() => BundleUpdaterManager.reload()}
                    />
                    <FormDivider />
                    <FormRow
                        label={settings.safeMode?.enabled ? "Return to Normal Mode" : "Reload in Safe Mode"}
                        subLabel={`This will reload Discord ${settings.safeMode?.enabled ? "normally." : "without loading plugins."}`}
                        leading={<FormRow.Icon source={getAssetIDByName("ic_auto_moderation_shield")} />}
                        onPress={toggleSafeMode}
                    />
                    <FormDivider />
                    <FormSwitchRow
                        label="Developer Settings"
                        leading={<FormRow.Icon source={getAssetIDByName("ic_robot_24px")} />}
                        value={settings.developerSettings}
                        onValueChange={(v: boolean) => {
                            settings.developerSettings = v;
                        }}
                    />
                </FormSection>
                <FormSection title="Info">
                    <Summary label="Versions" icon="ic_information_filled_24px">
                        {versions.map((v, i) => (
                            <>
                                <Version label={v.label} version={v.version} icon={v.icon} />
                                {i !== versions.length - 1 && <FormDivider />}
                            </>
                        ))}
                    </Summary>
                    <FormDivider />
                    <Summary label="Platform" icon="screenshare">
                        {platformInfo.map((p, i) => (
                            <>
                                <Version label={p.label} version={p.version} icon={p.icon} />
                                {i !== platformInfo.length - 1 && <FormDivider />}
                            </>
                        ))}
                    </Summary>
                </FormSection>
            </RN.ScrollView>
        </ErrorBoundary>
    )
}