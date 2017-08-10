import Collection from '../config/collection.js';
import Map from '../config/map.js';

/**
 * @abstract
 * @mixin
 */
const M = (superclass) =>  class TestSub extends superclass
{
    static getCollectionInstance()
    {
        return Collection;
    }

    static getMapInstance()
    {
        return Map;
    }

    static getFullSelect()
    {
        // todo: hard-coded for now, but need to be auto-generated based on schema,
        // todo: auto-select field and links!
        return {
            string: 1,
            date: 1,
            bool: 1,
        };
    }
};

export default M;
