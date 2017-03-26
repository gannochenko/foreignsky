import { Mongo } from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

class ArticleCollection extends Mongo.Collection
{
	constructor()
	{
		super('article');
		this.attachSchema(this.schema);
	}

	get schema()
	{
		return new SimpleSchema({
			_id: {
				type: String,
				regEx: SimpleSchema.RegEx.Id,
				optional: false,
			},
			title: {
				type: String,
				optional: false,
			},
			date: {
				type: Date,
				optional: false,
			},
			html: {
				type: String,
				optional: false,
			},
			location: {
				type: [Number],
				optional: true,
			},

			// todo: + Link to Type via grapher
		});
	}
}

export const Article = new ArticleCollection();