export default class Publication
{
    getEntity()
    {
        throw new Error('Not implemented: getEntity()');
    }

    static getFilter() {
        return {};
    }

    static getFields() {
        return {_id: 1};
    }

    static make(sp)
    {
        const entity = this.getEntity();

        Meteor.publish(entity.getUniqueCode(), () => {
            const cursor = entity.getCollection().find(this.getFilter(), {
                fields: this.getFields(),
            });
            this.ready();
            return cursor;
        });
    }

    static denyAll()
    {
        this.getEntity().getCollection().deny({
            update() { return true; }
        });
    }

    static declare(sp = null)
    {
        this.denyAll();
        this.make(sp);
    }
}
