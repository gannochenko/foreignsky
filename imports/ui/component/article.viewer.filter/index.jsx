/* eslint-disable class-methods-use-this */

import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Type as ArticleType} from '/imports/api/collection/article/type.js';

import './style.less';

class ArticleViewerFilter extends React.Component {

	constructor(params)
	{
		super(params);

		this.handleTypeClick = this.handleTypeClick.bind(this);
	}

	handleTypeClick(e)
	{
		const typeId = e.target.dataset['id'];
		if(typeId)
		{
			console.dir(typeId);
		}
	}

	render(props = {})
	{
		const {loading, items} = this.props;

		return (
			<div className="article-panel__filter">
				<div className="article-panel__filter-search">
				    <input className="input article-panel__filter-input" type="text" placeholder="Искать статью" />
				</div>
				<div className="article-panel__filter-button-set">
					{items.map(item => {
						return <div
							key={item._id}
							data-id={item._id}
							className="button button-tag article-panel__filter-button"
				            onClick={this.handleTypeClick}
						>
							# {item.tagTitle}
						</div>;
					})}
				</div>
			</div>
		);
	}
}

export default createContainer((props = {}) => {

	props = Object.create(props);

	const handle = Meteor.subscribe('article.type.list');

	props.loading = !handle.ready();
	props.items = ArticleType.find().fetch();

	return props;
}, ArticleViewerFilter);