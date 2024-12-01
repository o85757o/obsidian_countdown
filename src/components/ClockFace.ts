export interface ClockFaceProps {
    endDate: Date;
    style: string;  
    size?: 'small' | 'medium' | 'large';
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    title?: string;
    parent?: string;
}

export class ClockFace {
    private container: HTMLElement;
    private props: ClockFaceProps;
    private intervalId: number;
    private animationFrameId: number;

    constructor(container: HTMLElement, props: ClockFaceProps) {
        this.container = container;
        this.props = {
            ...{
                style: 'flip-clock',  
                showDays: true,
                showHours: true,
                showMinutes: true,
                showSeconds: true,
                size: 'medium'
            },
            ...props
        };
        this.render();
        this.startAnimation();
    }

    private render() {
        this.container.empty();
        this.container.addClass('countdown-clock-face');
        this.container.addClass(`face-${this.props.style}`);
        this.container.addClass(`size-${this.props.size}`);

        // 添加标题 (对所有样式都添加)
        if (this.props.title) {
            this.container.createDiv({ 
                cls: 'clock-title',
                text: this.props.title
            });
        }

        switch (this.props.style) {
            case 'ios-circular':
                this.renderIOSCircular();
                break;
            case 'circular':
                this.renderCircular();
                break;
            case 'digital':
                this.renderDigital();
                break;
            case 'analog':
                this.renderAnalog();
                break;
            case 'flip-clock':
                this.renderFlipClock();
                break;
        }
    }

    private renderIOSCircular() {
        const { days, hours, minutes, seconds, totalProgress } = this.calculateTimeLeft();
        
        // 创建主容器
        const clockFace = this.container.createDiv({ cls: 'face-ios-circular' });
        
        // 创建SVG进度环
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const radius = 54; // 圆环半径
        const circumference = 2 * Math.PI * radius;
        
        svg.setAttribute('class', 'progress-ring');
        svg.setAttribute('width', '120');
        svg.setAttribute('height', '120');
        svg.setAttribute('viewBox', '0 0 120 120');
        
        // 背景圆环
        const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        backgroundCircle.setAttribute('class', 'background');
        backgroundCircle.setAttribute('cx', '60');
        backgroundCircle.setAttribute('cy', '60');
        backgroundCircle.setAttribute('r', radius.toString());
        
        // 进度圆环
        const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        progressCircle.setAttribute('class', 'progress');
        progressCircle.setAttribute('cx', '60');
        progressCircle.setAttribute('cy', '60');
        progressCircle.setAttribute('r', radius.toString());
        progressCircle.setAttribute('stroke-dasharray', circumference.toString());
        progressCircle.setAttribute('stroke-dashoffset', 
            (circumference * (1 - totalProgress)).toString()
        );
        
        svg.appendChild(backgroundCircle);
        svg.appendChild(progressCircle);
        clockFace.appendChild(svg);
        
        // 创建时间显示
        const timeDisplay = clockFace.createDiv({ cls: 'time-display' });
        
        // 显示天数
        if (this.props.showDays) {
            const daysContainer = timeDisplay.createDiv();
            daysContainer.createDiv({ 
                cls: 'time-value',
                text: days.toString().padStart(2, '0')
            });
            daysContainer.createDiv({ 
                cls: 'time-label',
                text: days === 1 ? 'day' : 'days'
            });
        }
        
        // 显示小时
        if (this.props.showHours) {
            const hoursContainer = timeDisplay.createDiv();
            hoursContainer.createDiv({ 
                cls: 'time-value',
                text: hours.toString().padStart(2, '0')
            });
            hoursContainer.createDiv({ 
                cls: 'time-label',
                text: hours === 1 ? 'hour' : 'hours'
            });
        }
        
        // 显示分钟
        if (this.props.showMinutes) {
            const minutesContainer = timeDisplay.createDiv();
            minutesContainer.createDiv({ 
                cls: 'time-value',
                text: minutes.toString().padStart(2, '0')
            });
            minutesContainer.createDiv({ 
                cls: 'time-label',
                text: minutes === 1 ? 'minute' : 'minutes'
            });
        }
        
        // 显示秒数
        if (this.props.showSeconds) {
            const secondsContainer = timeDisplay.createDiv();
            secondsContainer.createDiv({ 
                cls: 'time-value',
                text: seconds.toString().padStart(2, '0')
            });
            secondsContainer.createDiv({ 
                cls: 'time-label',
                text: seconds === 1 ? 'second' : 'seconds'
            });
        }
        
        // 显示百分比
        const progressPercent = Math.round(totalProgress * 100);
        const progressText = clockFace.createDiv({ cls: 'progress-text' });
        progressText.textContent = `${progressPercent}%`;
    }

    private renderCircular() {
        const { days, hours, minutes, seconds, totalProgress } = this.calculateTimeLeft();
        const clockFace = this.container.createDiv({ cls: 'face-circular' });
        
        // 创建圆形进度条
        const progressRing = clockFace.createDiv({ cls: 'progress-ring' });
        progressRing.style.setProperty('--progress', `${totalProgress * 100}%`);
        
        // 显示时间
        const timeDisplay = progressRing.createDiv({ cls: 'time-display' });
        let timeText = '';
        
        if (this.props.showDays && days > 0) timeText += `${days}d `;
        if (this.props.showHours) timeText += `${hours.toString().padStart(2, '0')}:`;
        if (this.props.showMinutes) timeText += `${minutes.toString().padStart(2, '0')}`;
        if (this.props.showSeconds) timeText += `:${seconds.toString().padStart(2, '0')}`;
        
        timeDisplay.textContent = timeText.trim();
    }

    private renderDigital() {
        const { days, hours, minutes, seconds } = this.calculateTimeLeft();
        const digitalDisplay = this.container.createDiv({ cls: 'face-digital' });
        
        let timeText = '';
        if (this.props.showDays && days > 0) timeText += `${days}d `;
        if (this.props.showHours) timeText += `${hours.toString().padStart(2, '0')}:`;
        if (this.props.showMinutes) timeText += `${minutes.toString().padStart(2, '0')}`;
        if (this.props.showSeconds) timeText += `:${seconds.toString().padStart(2, '0')}`;
        
        digitalDisplay.textContent = timeText.trim();
    }

    private renderAnalog() {
        const { hours, minutes, seconds } = this.calculateTimeLeft();
        const analogDisplay = this.container.createDiv({ cls: 'face-analog' });
        
        // 创建表盘刻度
        for (let i = 0; i < 12; i++) {
            const marker = analogDisplay.createDiv({ cls: 'marker' });
            marker.style.transform = `rotate(${i * 30}deg)`;
        }
        
        // 创建指针
        const hourHand = analogDisplay.createDiv({ cls: 'hand hour' });
        const minuteHand = analogDisplay.createDiv({ cls: 'hand minute' });
        const secondHand = analogDisplay.createDiv({ cls: 'hand second' });
        
        // 计算指针角度
        const hourAngle = (hours % 12 + minutes / 60) * 30;
        const minuteAngle = (minutes + seconds / 60) * 6;
        const secondAngle = seconds * 6;
        
        hourHand.style.transform = `rotate(${hourAngle}deg)`;
        minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
        secondHand.style.transform = `rotate(${secondAngle}deg)`;
    }

    private renderFlipClock() {
        const { hours, minutes } = this.calculateTimeLeft();
        const flipContainer = this.container.createDiv({ cls: 'face-flip-clock' });
        
        // 添加日期显示
        const dateDisplay = flipContainer.createDiv({ cls: 'flip-date' });
        const date = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateDisplay.setText(`${days[date.getDay()]} ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`);

        // 创建时间显示容器
        const timeDisplay = flipContainer.createDiv({ cls: 'flip-time' });

        // 小时
        const hoursStr = hours.toString().padStart(2, '0');
        const hoursContainer = timeDisplay.createDiv({ cls: 'flip-number-container' });
        const hoursTens = hoursContainer.createDiv({ cls: 'flip-number' });
        hoursTens.setText(hoursStr[0]);
        const hoursOnes = hoursContainer.createDiv({ cls: 'flip-number' });
        hoursOnes.setText(hoursStr[1]);

        // 分钟
        const minutesStr = minutes.toString().padStart(2, '0');
        const minutesContainer = timeDisplay.createDiv({ cls: 'flip-number-container' });
        const minutesTens = minutesContainer.createDiv({ cls: 'flip-number' });
        minutesTens.setText(minutesStr[0]);
        const minutesOnes = minutesContainer.createDiv({ cls: 'flip-number' });
        minutesOnes.setText(minutesStr[1]);
    }

    private startAnimation() {
        const animate = () => {
            this.render();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        this.animationFrameId = requestAnimationFrame(animate);
    }

    private stopAnimation() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    destroy() {
        this.stopAnimation();
    }

    private calculateTimeLeft() {
        const now = new Date();
        const timeLeft = this.props.endDate.getTime() - now.getTime();
        
        if (timeLeft <= 0) {
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                totalProgress: 1
            };
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // 计算总进度
        const totalDuration = this.props.endDate.getTime() - now.getTime();
        const totalProgress = Math.max(0, Math.min(1, timeLeft / totalDuration));

        return {
            days,
            hours,
            minutes,
            seconds,
            totalProgress
        };
    }
}
