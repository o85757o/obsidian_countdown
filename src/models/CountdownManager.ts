import { TFile } from 'obsidian';
import { EventEmitter } from 'events';

export interface CountdownItem {
    id: string;
    title: string;
    endDate: Date;
    clockFace: string;
    path: string;
    notifications: {
        percentage: number;
        triggered: boolean;
    }[];
    parentId?: string;
}

export class CountdownManager extends EventEmitter {
    private items: Map<string, CountdownItem> = new Map();
    private hierarchy: Map<string, string[]> = new Map(); // parentId -> childIds

    constructor() {
        super();
    }

    addItem(item: CountdownItem) {
        this.items.set(item.id, item);
        if (item.parentId) {
            const siblings = this.hierarchy.get(item.parentId) || [];
            siblings.push(item.id);
            this.hierarchy.set(item.parentId, siblings);
        }
        this.emit('itemAdded', item);
    }

    removeItem(id: string) {
        const item = this.items.get(id);
        if (item) {
            this.items.delete(id);
            if (item.parentId) {
                const siblings = this.hierarchy.get(item.parentId) || [];
                const index = siblings.indexOf(id);
                if (index > -1) {
                    siblings.splice(index, 1);
                }
            }
            // Remove all children
            const children = this.hierarchy.get(id) || [];
            children.forEach(childId => this.removeItem(childId));
            this.hierarchy.delete(id);
            this.emit('itemRemoved', id);
        }
    }

    getItem(id: string): CountdownItem | undefined {
        return this.items.get(id);
    }

    getAllItems(): CountdownItem[] {
        return Array.from(this.items.values());
    }

    getChildren(parentId: string): CountdownItem[] {
        const childIds = this.hierarchy.get(parentId) || [];
        return childIds.map(id => this.items.get(id)).filter(item => item !== undefined) as CountdownItem[];
    }

    getRootItems(): CountdownItem[] {
        return this.getAllItems().filter(item => !item.parentId);
    }

    updateItem(id: string, updates: Partial<CountdownItem>) {
        const item = this.items.get(id);
        if (item) {
            Object.assign(item, updates);
            this.emit('itemUpdated', item);
        }
    }

    checkNotifications() {
        const now = new Date();
        this.getAllItems().forEach(item => {
            const timeLeft = item.endDate.getTime() - now.getTime();
            const totalTime = item.endDate.getTime() - new Date(item.id).getTime();
            const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

            item.notifications.forEach(notification => {
                if (!notification.triggered && progressPercent >= notification.percentage) {
                    notification.triggered = true;
                    this.emit('notification', {
                        item,
                        percentage: notification.percentage,
                        message: `${item.title} has reached ${notification.percentage}% completion`
                    });
                }
            });
        });
    }

    // 解析文件中的倒计时锚点
    async parseFile(file: TFile): Promise<CountdownItem[]> {
        const content = await file.vault.read(file);
        const matches = content.matchAll(/\(\((.*?)\|(.*?)(?:\|(.*?))?\)\)/g);
        const items: CountdownItem[] = [];
        const parentMap = new Map<string, string>(); // childId -> parentId

        for (const match of matches) {
            const [_, dateStr, face, options = ''] = match;
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                // 解析选项
                const optionsObj = this.parseOptions(options);
                const parentId = optionsObj.parent;
                delete optionsObj.parent; // 从选项中移除 parent，因为它已经被处理

                const item: CountdownItem = {
                    id: `${file.path}-${dateStr}`,
                    title: optionsObj.title || file.basename,
                    endDate: date,
                    clockFace: face || 'ios-circular',
                    path: file.path,
                    notifications: [
                        { percentage: 25, triggered: false },
                        { percentage: 50, triggered: false },
                        { percentage: 75, triggered: false }
                    ],
                    ...optionsObj
                };

                if (parentId) {
                    parentMap.set(item.id, parentId);
                }

                items.push(item);
            }
        }

        // 处理层级关系
        items.forEach(item => {
            const parentId = parentMap.get(item.id);
            if (parentId) {
                const parentItem = items.find(i => i.id === parentId);
                if (parentItem) {
                    item.parentId = parentId;
                }
            }
        });

        return items;
    }

    private parseOptions(optionsStr: string): any {
        const options: any = {};
        if (!optionsStr) return options;

        const pairs = optionsStr.split(',').map(pair => pair.trim());
        pairs.forEach(pair => {
            const [key, value] = pair.split('=').map(s => s.trim());
            if (key && value) {
                // 处理布尔值
                if (value === 'true') options[key] = true;
                else if (value === 'false') options[key] = false;
                // 处理数字
                else if (!isNaN(Number(value))) options[key] = Number(value);
                // 其他作为字符串处理
                else options[key] = value;
            }
        });

        return options;
    }
}
