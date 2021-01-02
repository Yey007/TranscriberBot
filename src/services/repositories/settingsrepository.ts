import { injectable } from 'inversify';
import { DiscordId } from './repotypes';

@injectable()
export abstract class SettingsRepository<T> {
    public abstract get(id: DiscordId): Promise<T>;
    public abstract set(id: DiscordId, settings: T): Promise<void>;
}
