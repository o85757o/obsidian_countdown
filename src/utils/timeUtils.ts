export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalProgress: number;
    isExpired: boolean;
}

export function calculateTimeLeft(endDate: Date): TimeLeft {
    const now = new Date();
    const timeLeft = endDate.getTime() - now.getTime();
    const totalTime = endDate.getTime() - new Date(endDate.getFullYear(), 0, 1).getTime();
    
    const isExpired = timeLeft <= 0;
    
    const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((timeLeft % (1000 * 60)) / 1000));
    
    const totalProgress = Math.min(1, Math.max(0, 1 - (timeLeft / totalTime)));
    
    return {
        days,
        hours,
        minutes,
        seconds,
        totalProgress,
        isExpired
    };
}

export function formatDuration(duration: number): string {
    const days = Math.floor(duration / (1000 * 60 * 60 * 24));
    const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.join(' ') || '0m';
}

export function parseCountdownDate(input: string): Date | null {
    const date = new Date(input);
    return isNaN(date.getTime()) ? null : date;
}
