import { DialDefinition, DialRenderer } from './DialRegistry';
import { ClockFaceProps } from '../components/ClockFace';
import { calculateTimeLeft } from '../utils/timeUtils';

export class IOSCircularDialRenderer implements DialRenderer {
    render(container: HTMLElement, props: ClockFaceProps) {
        const { days, hours, minutes, totalProgress } = calculateTimeLeft(props.endDate);
        
        // 创建主容器
        const clockFace = container.createDiv({ cls: 'face-ios-circular' });
        
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
        progressCircle.style.strokeDashoffset = `${circumference * (1 - totalProgress)}`;
        
        svg.appendChild(backgroundCircle);
        svg.appendChild(progressCircle);
        clockFace.appendChild(svg);
        
        // 创建时间显示
        const timeDisplay = clockFace.createDiv({ cls: 'time-display' });
        
        if (props.showDays && days > 0) {
            const daysContainer = timeDisplay.createDiv();
            daysContainer.createEl('div', { cls: 'time-value', text: days.toString() });
            daysContainer.createEl('div', { cls: 'time-label', text: 'days' });
        }
        
        if (props.showHours) {
            const hoursContainer = timeDisplay.createDiv();
            hoursContainer.createEl('div', { 
                cls: 'time-value', 
                text: hours.toString().padStart(2, '0') 
            });
            hoursContainer.createEl('div', { cls: 'time-label', text: 'hours' });
        }
        
        if (props.showMinutes) {
            const minutesContainer = timeDisplay.createDiv();
            minutesContainer.createEl('div', { 
                cls: 'time-value', 
                text: minutes.toString().padStart(2, '0') 
            });
            minutesContainer.createEl('div', { cls: 'time-label', text: 'minutes' });
        }
        
        // 显示进度百分比
        clockFace.createDiv({ 
            cls: 'progress-text',
            text: `${Math.round(totalProgress * 100)}% Complete`
        });
    }
}

export const IOSCircularDial: DialDefinition = {
    id: 'ios-circular',
    name: 'iOS Style',
    description: 'A modern circular countdown dial with iOS-like design',
    renderer: new IOSCircularDialRenderer(),
    defaultOptions: {
        showDays: true,
        showHours: true,
        showMinutes: true,
        size: 'medium'
    },
    thumbnail: 'ios-circular.png' // TODO: Add thumbnail image
};
