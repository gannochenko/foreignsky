import React from 'react';
import EntityForm from '../../../../component/general/entity-form/index.jsx';
import AttributeGroup from '../../../../component/general/form/component/attribute-group/index.jsx';
import Article from '../../../../../api/article/entity/entity.client.js';

import RichRenderer from '../../../../component/general/form/component/renderer/rich/index.jsx';

export default class ArticleForm extends EntityForm
{
    static getEntity()
    {
        return Article;
    }

    getItemTitle(item)
    {
        return item.getTitle();
    }

    transformMap(map)
    {
        // group title and date together
        map.insertAttributeAfter(new AttributeGroup({
            code: 'title-date',
            attributes: [
                {code: 'title', size: 'eleven'},
                {code: 'date', size: 'five'},
            ]
        }));

        map.insertAttributeAfter('tag', 'title-date'); // tags go after title-date group
        map.insertAttributeAfter('headerImage'); // header image on top
        map.insertAttributeAfter('location', 'embed'); // embed to the end

        map.getAttribute('public').setParameter('show-label', false);
        map.getAttribute('headerImage').setParameter('show-label', false);

        // render text as rich editor
        map.getAttribute('text').setParameter('renderer', RichRenderer);

        return map;
    }
}
