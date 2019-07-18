import { Transform } from "../Components/Transform";
import { Component } from "../Components/Component";

export abstract class GameObject {
    
    public id: string;

    protected transform: Transform;
    protected components: Component[] = [];
    protected componentMap: Map<string, Component> = new Map<string, Component>();

    private isEnabled: boolean;
    

    public constructor(id: string, x: number = 0, y: number = 0) {
        this.id = id;
        this.transform = new Transform(this, x, y);
        this.isEnabled = true;
    }

    public start(): void {
        this.components.forEach(c => c.start());
    }

    public update(): void {
        for (let component of this.components) {
            if (component.enabled) {
                component.update();
            }
        }
    }

    public set enabled(enabled: boolean) {
        if (enabled === this.isEnabled) {
            return;
        }

        this.isEnabled = enabled;

        for (let component of this.components) {
            if (component.enabled) {
                enabled ? component.onEnabled() : component.onDisable();
            }
        }
    }

    public get enabled(): boolean {
        return this.isEnabled;
    }

    public getTransform(): Transform {
        return this.transform;
    }

    public hasComponent<T extends Component>(component: new (...args: any[]) => T): boolean {
        return this.componentMap.has(component.name);
    }

    public getComponent<T extends Component>(component: new (...args: any[]) => T): T {
        let componentType = component.name;

        if (!this.componentMap.has(componentType)) {
            throw new Error(componentType + " not found on the GameObject with id of " + this.id + "!");
        }

        return <T>this.componentMap.get(componentType);
    }

    public addComponent<T extends Component>(newComponent: Component): T {
        if (this.componentMap.has(newComponent.constructor.name)) {
            throw new Error("There is already a component of type " + newComponent.constructor.name + " on this object!");
        }

        this.componentMap.set(newComponent.constructor.name, newComponent);
        newComponent.enabled = true;
        newComponent.start();

        return <T>newComponent;
    }

    public removeComponent(component: Component): void {
        if (!this.componentMap.has(component.constructor.name)) {
            throw new Error("This object does not have a " + component.constructor.name + " component!");
        }

        this.components.splice(this.components.indexOf(component), 1);
        this.componentMap.delete(component.constructor.name);
        component.onDestroy();
    }

    protected setComponents(components: Component[]): void {
        this.components = components;

        for (let component of components) {
            if (this.componentMap.has(component.constructor.name)) {
                throw new Error("There is already a component of type " + component.constructor.name + " on this object!");
            }

            this.componentMap.set(component.constructor.name, component);
        }
    }
}