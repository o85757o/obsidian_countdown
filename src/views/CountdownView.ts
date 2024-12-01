import { ItemView, WorkspaceLeaf } from 'obsidian';
import { CountdownItem } from '../models/CountdownManager';

export class CountdownView extends ItemView {
    private items: CountdownItem[] = [];

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        return 'countdown-view';
    }

    getDisplayText(): string {
        return 'Countdown Dashboard';
    }

    async onOpen() {
        await this.render();
    }

    async render() {
        const container = this.containerEl.children[1];
        container.empty();
        container.addClass('countdown-dashboard');

        // 创建标题
        container.createEl('h2', { text: 'Countdown Dashboard' });

        // 创建搜索栏
        const searchContainer = container.createDiv({ cls: 'countdown-search' });
        const searchInput = searchContainer.createEl('input', {
            type: 'text',
            placeholder: 'Search countdowns...'
        });
        searchInput.addEventListener('input', () => this.filterItems(searchInput.value));

        // 创建层级视图容器
        const hierarchyContainer = container.createDiv({ cls: 'countdown-hierarchy' });
        this.renderHierarchy(hierarchyContainer, this.items.filter(item => !item.parentId), 0);
    }

    private renderHierarchy(container: HTMLElement, items: CountdownItem[], level: number = 0) {
        const list = container.createDiv({ cls: 'countdown-list' });
        list.style.marginLeft = `${level * 20}px`;

        items.forEach(item => {
            const itemEl = this.createCountdownItem(list, item, level);
            
            // 如果有子项，递归渲染
            const children = this.items.filter(child => child.parentId === item.id);
            if (children.length > 0) {
                this.renderHierarchy(itemEl, children, level + 1);
            }
        });
    }

    private createCountdownItem(container: HTMLElement, item: CountdownItem, level: number): HTMLElement {
        const itemEl = container.createDiv({ cls: 'countdown-item' });
        itemEl.style.marginLeft = `${level * 20}px`;

        // 添加展开/折叠按钮
        const toggleButton = itemEl.createDiv({ cls: 'toggle-button' });
        const children = this.items.filter(child => child.parentId === item.id);
        if (children.length > 0) {
            toggleButton.addClass('has-children');
            toggleButton.addEventListener('click', () => {
                itemEl.classList.toggle('collapsed');
            });
        }

        // 添加标题和链接
        const titleEl = itemEl.createDiv({ cls: 'title' });
        titleEl.createEl('a', {
            text: item.title,
            href: item.path
        });

        // 添加倒计时显示
        const countdownEl = itemEl.createDiv({ cls: 'countdown-display' });
        this.renderCountdown(countdownEl, item);

        return itemEl;
    }

    private renderCountdown(container: HTMLElement, item: CountdownItem) {
        // 根据不同的表盘类型渲染倒计时
        container.addClass(`face-${item.clockFace}`);
        
        const now = new Date();
        const timeLeft = item.endDate.getTime() - now.getTime();
        
        if (timeLeft <= 0) {
            const textDiv = container.createDiv();
            textDiv.textContent = '已结束';
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        switch (item.clockFace) {
            case 'ios-circular':
                this.renderIOSCircularCountdown(container, item);
                break;
            case 'digital':
                const textDiv = container.createDiv();
                textDiv.textContent = `${days}d ${hours}h ${minutes}m`;
                break;
            case 'circular':
                this.renderCircularCountdown(container, item);
                break;
            case 'analog':
                this.renderAnalogCountdown(container, item);
                break;
            default:
                this.renderIOSCircularCountdown(container, item);
                break;
        }
    }

    private renderCircularCountdown(container: HTMLElement, item: CountdownItem) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '50');
        circle.setAttribute('cy', '50');
        circle.setAttribute('r', '45');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#ddd');
        circle.setAttribute('stroke-width', '5');
        
        const progressCircle = circle.cloneNode() as SVGCircleElement;
        const now = new Date();
        const timeLeft = item.endDate.getTime() - now.getTime();
        const totalTime = item.endDate.getTime() - new Date(item.id).getTime();
        const progress = 1 - (timeLeft / totalTime);
        
        progressCircle.setAttribute('stroke', 'var(--interactive-accent)');
        progressCircle.setAttribute('stroke-dasharray', `${Math.PI * 90}`);
        progressCircle.setAttribute('stroke-dashoffset', `${Math.PI * 90 * (1 - progress)}`);
        
        svg.appendChild(circle);
        svg.appendChild(progressCircle);
        container.appendChild(svg);
    }

    private renderAnalogCountdown(container: HTMLElement, item: CountdownItem) {
        const clock = container.createDiv({ cls: 'analog-clock' });
        // 添加时钟刻度
        for (let i = 0; i < 12; i++) {
            const tick = clock.createDiv({ cls: 'tick' });
            tick.style.transform = `rotate(${i * 30}deg)`;
        }
        
        // 添加时针和分针
        const hourHand = clock.createDiv({ cls: 'hand hour' });
        const minuteHand = clock.createDiv({ cls: 'hand minute' });
        
        const now = new Date();
        const timeLeft = item.endDate.getTime() - now.getTime();
        const hours = (timeLeft / (1000 * 60 * 60)) % 12;
        const minutes = (timeLeft / (1000 * 60)) % 60;
        
        hourHand.style.transform = `rotate(${hours * 30}deg)`;
        minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
    }

    private renderIOSCircularCountdown(container: HTMLElement, item: CountdownItem) {
        const now = new Date();
        const timeLeft = item.endDate.getTime() - now.getTime();
        const totalTime = item.endDate.getTime() - new Date(item.id).getTime();
        const progress = 1 - (timeLeft / totalTime);

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        // 创建SVG进度环
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('viewBox', '0 0 100 100');
        
        // 背景圆环
        const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        backgroundCircle.setAttribute('class', 'progress-background');
        backgroundCircle.setAttribute('cx', '50');
        backgroundCircle.setAttribute('cy', '50');
        backgroundCircle.setAttribute('r', '44');
        
        // 进度圆环
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('class', 'progress-bar');
        progressCircle.setAttribute('cx', '50');
        progressCircle.setAttribute('cy', '50');
        progressCircle.setAttribute('r', '44');
        
        // 设置进度
        const circumference = 2 * Math.PI * 44;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = `${circumference * (1 - progress)}`;
        
        svg.appendChild(backgroundCircle);
        svg.appendChild(progressCircle);
        container.appendChild(svg);
        
        // 创建时间显示
        const timeDisplay = container.createDiv({ cls: 'time-display' });
        
        // 显示天数
        if (days > 0) {
            const daysContainer = timeDisplay.createDiv();
            daysContainer.createEl('div', { cls: 'time-value', text: days.toString() });
            daysContainer.createEl('div', { cls: 'time-label', text: 'days' });
        }
        
        // 显示小时
        const hoursContainer = timeDisplay.createDiv();
        hoursContainer.createEl('div', { cls: 'time-value', text: hours.toString().padStart(2, '0') });
        hoursContainer.createEl('div', { cls: 'time-label', text: 'hours' });
        
        // 显示分钟
        const minutesContainer = timeDisplay.createDiv();
        minutesContainer.createEl('div', { cls: 'time-value', text: minutes.toString().padStart(2, '0') });
        minutesContainer.createEl('div', { cls: 'time-label', text: 'minutes' });
        
        // 显示进度百分比
        container.createDiv({ 
            cls: 'progress-text',
            text: `${Math.round(progress * 100)}% Complete`
        });
    }

    private filterItems(searchTerm: string) {
        const filteredItems = this.items.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.path.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const container = this.containerEl.children[1];
        const hierarchyContainer = container.querySelector('.countdown-hierarchy');
        if (hierarchyContainer) {
            hierarchyContainer.empty();
            const rootItems = filteredItems.filter(item => !item.parentId);
            this.renderHierarchy(hierarchyContainer as HTMLElement, rootItems, 0);
        }
    }

    setItems(items: CountdownItem[]) {
        this.items = items;
        this.render();
    }
}
