import { FindOneOptions, ObjectID, Repository } from 'typeorm';

export abstract class DefaultedRepository<T> extends Repository<T> {
    protected abstract getDefaults(): T;

    async findOneOrDefaults(id?: string | number | Date | ObjectID, options?: FindOneOptions<T>): Promise<T> {
        const entity = await super.findOne(id, options);
        if (entity === undefined) {
            return this.getDefaults();
        }
        return entity;
    }
}
