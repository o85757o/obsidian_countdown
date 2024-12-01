import { App, PluginSettingTab, Setting } from 'obsidian';
import CountdownPlugin from '../main';

export class CountdownSettingTab extends PluginSettingTab {
    plugin: CountdownPlugin;

    constructor(app: App, plugin: CountdownPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Countdown Settings' });

        new Setting(containerEl)
            .setName('Default Style')
            .setDesc('Choose the default countdown style')
            .addDropdown(dropdown => dropdown
                .addOption('flip-clock', 'Flip Clock')
                .addOption('ios-circular', 'iOS Circular')
                .addOption('circular', 'Simple Circular')
                .addOption('digital', 'Digital')
                .addOption('analog', 'Analog')
                .setValue(this.plugin.settings.defaultDialId)
                .onChange(async (value) => {
                    this.plugin.settings.defaultDialId = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Days')
            .setDesc('Show days in countdown')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.appearance.showDays)
                .onChange(async (value) => {
                    this.plugin.settings.appearance.showDays = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Hours')
            .setDesc('Show hours in countdown')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.appearance.showHours)
                .onChange(async (value) => {
                    this.plugin.settings.appearance.showHours = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Minutes')
            .setDesc('Show minutes in countdown')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.appearance.showMinutes)
                .onChange(async (value) => {
                    this.plugin.settings.appearance.showMinutes = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show Seconds')
            .setDesc('Show seconds in countdown')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.appearance.showSeconds)
                .onChange(async (value) => {
                    this.plugin.settings.appearance.showSeconds = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Default Size')
            .setDesc('Choose the default size for countdowns')
            .addDropdown(dropdown => dropdown
                .addOption('small', 'Small')
                .addOption('medium', 'Medium')
                .addOption('large', 'Large')
                .setValue(this.plugin.settings.appearance.defaultSize)
                .onChange(async (value) => {
                    this.plugin.settings.appearance.defaultSize = value;
                    await this.plugin.saveSettings();
                }));
    }
}
