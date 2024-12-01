import { ClockFaceProps } from '../components/ClockFace';

export interface DialRenderer {
    render(container: HTMLElement, props: ClockFaceProps): void;
    destroy?(): void;
}

export interface DialDefinition {
    id: string;
    name: string;
    description: string;
    renderer: DialRenderer;
    defaultOptions?: Partial<ClockFaceProps>;
    thumbnail?: string;
}

export class DialRegistry {
    private static instance: DialRegistry;
    private dials: Map<string, DialDefinition> = new Map();

    private constructor() {}

    static getInstance(): DialRegistry {
        if (!DialRegistry.instance) {
            DialRegistry.instance = new DialRegistry();
        }
        return DialRegistry.instance;
    }

    registerDial(dial: DialDefinition) {
        this.dials.set(dial.id, dial);
    }

    getDial(id: string): DialDefinition | undefined {
        return this.dials.get(id);
    }

    getAllDials(): DialDefinition[] {
        return Array.from(this.dials.values());
    }

    getDefaultDial(): DialDefinition | undefined {
        return this.getAllDials()[0];
    }
}
