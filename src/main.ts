import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { ClockFace } from './components/ClockFace';
import { CountdownSettingTab } from './settings/SettingsTab';

interface CountdownSettings {
    appearance: {
        showDays: boolean;
        showHours: boolean;
        showMinutes: boolean;
        showSeconds: boolean;
        defaultSize: string;
    };
    defaultDialId: string;
    refreshInterval: number;
}

const DEFAULT_SETTINGS: CountdownSettings = {
    appearance: {
        showDays: true,
        showHours: true,
        showMinutes: true,
        showSeconds: true,
        defaultSize: 'medium'
    },
    defaultDialId: 'flip-clock',  // 设置默认样式为 flip-clock
    refreshInterval: 1000
};

export default class CountdownPlugin extends Plugin {
    settings: CountdownSettings;

    async onload() {
        await this.loadSettings();

        // 注册 Markdown 处理器
        this.registerMarkdownPostProcessor((element, context) => {
            // 支持两种语法：((date)) 和 ((date|style|options))
            const countdownRegex = /\(\(([\d-]+)(?:\|([\w-]+))?(?:\|(.*?))?\)\)/g;
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        return node.textContent?.includes('((') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                }
            );

            const nodesToReplace: { node: Text; matches: RegExpMatchArray[] }[] = [];
            let currentNode: Text | null;
            
            while ((currentNode = walker.nextNode() as Text)) {
                const matches: RegExpMatchArray[] = [];
                const text = currentNode.textContent || '';
                let match: RegExpExecArray | null;
                
                while ((match = countdownRegex.exec(text))) {
                    if (match.index !== undefined) {
                        matches.push(match);
                    }
                }
                
                if (matches.length > 0) {
                    nodesToReplace.push({ node: currentNode, matches });
                }
            }

            nodesToReplace.forEach(({ node, matches }) => {
                const text = node.textContent || '';
                let lastIndex = 0;
                const fragment = document.createDocumentFragment();

                matches.forEach(match => {
                    const index = match.index !== undefined ? match.index : 0;
                    
                    // 添加匹配前的文本
                    if (index > lastIndex) {
                        fragment.appendChild(
                            document.createTextNode(text.slice(lastIndex, index))
                        );
                    }

                    // 使用默认样式 flip-clock 如果没有指定样式
                    const [_, dateStr, style = this.settings.defaultDialId, optionsStr] = match;
                    const date = new Date(dateStr);
                    const options = this.parseOptions(optionsStr);

                    if (!isNaN(date.getTime())) {
                        const container = document.createElement('div');
                        container.addClass('countdown-container');
                        
                        // 如果有标题，添加标题
                        if (options.title) {
                            const titleEl = container.createDiv({ cls: 'countdown-title' });
                            titleEl.textContent = options.title;
                        }

                        // 创建倒计时组件
                        new ClockFace(container, {
                            endDate: date,
                            style: style,
                            showDays: this.settings.appearance.showDays,
                            showHours: this.settings.appearance.showHours,
                            showMinutes: this.settings.appearance.showMinutes,
                            showSeconds: this.settings.appearance.showSeconds,
                            size: options.size || this.settings.appearance.defaultSize,
                            title: options.title,
                            parent: options.parent
                        });

                        fragment.appendChild(container);
                    }

                    lastIndex = index + match[0].length;
                });

                // 添加最后剩余的文本
                if (lastIndex < text.length) {
                    fragment.appendChild(
                        document.createTextNode(text.slice(lastIndex))
                    );
                }

                // 替换原始节点
                if (node.parentNode) {
                    node.parentNode.replaceChild(fragment, node);
                }
            });
        });

        // 添加设置选项卡
        this.addSettingTab(new CountdownSettingTab(this.app, this));
    }

    parseOptions(optionsStr: string | undefined): any {
        if (!optionsStr) return {};
        
        const options: any = {};
        const pairs = optionsStr.split(',');
        
        pairs.forEach(pair => {
            const [key, value] = pair.split('=').map(s => s.trim());
            if (key && value) {
                options[key] = value;
            }
        });
        
        return options;
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
