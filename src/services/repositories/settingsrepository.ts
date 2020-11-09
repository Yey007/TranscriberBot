import { injectable } from "inversify";

@injectable()
export abstract class SettingsRepository<T> {
    public abstract get(id: string): Promise<T>
    public abstract set(id: string, settings: T): Promise<void>
}