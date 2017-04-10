/* eslint-disable class-methods-use-this */

import React from 'react';
import {createQueryContainer} from 'meteor/cultofcoders:grapher-react';
import Article from '/imports/api/entity/article.js';
import { TAPi18n } from 'meteor/tap:i18n';

import './style.less';

export default class ArticleViewerDetailComponent extends React.Component {

	constructor(params)
	{
		super(params);
		this.state = {
			id: null,
			opened: false
		};
	}

	componentWillMount()
	{
		//console.dir('componentWillMount!');
		//console.dir(this.props.id);
		this.handleIdUpdate(this.props.id);
	}

	componentWillReceiveProps(next)
	{
		//console.dir('componentWillReceiveProps!');
		//console.dir(next.id);
		this.handleIdUpdate(next.id);
	}

	handleIdUpdate(id)
	{
		if(id !== this.state.id)
		{
			this.setState({id: id});
			console.dir('ID = '+this.state.id);
		}
	}

	open()
	{
		if(!this.opened)
		{

			this.opened = true;
		}
	}

	render(props = {})
	{
		let {data, loading} = this.props;
		data = data || [];

		return (
			<div className="article-detail">
				<div className="article-detail__close-page">X</div>
				<div className="article-detail__inner-scroll">

					<div className="article-detail__header-image">
						<h1 className="article-detail__header-h1">Про наклейку на лобовое стекло машины, непонятный штраф, почему медведи и еще кусок названия до кучи</h1>
					</div>

					<div className="article-detail__body-top-line">
						<div className="group-tag">
							<div className="tag tag__yellow">#Быт</div>
							<div className="tag tag__blue">#Автомобили</div>
							<div className="tag tag__seagreen">#Медведи</div>
							<div className="tag tag__yellow">#Разнаяхрень</div>
						</div>
						<div className="article-detail__body-date">
							23.01.2017
						</div>
					</div>

					<div className="article-detail__body">



						<p>
							Короче... Походу я только что получил свой первый штраф в Германии. На лобовое стекло под дворники мне положили такую бумажонку.
						</p>

						*тут фотка бумажонки*

						<p>
							Показал я эту бумажку своим друзьям с работы, и оказывается, что на одной ее стороне написано, что это просто "friendly warning", а на другой, что это "fine". Куда платить - не понятно. Сколько платить - не понятно. За что платить - не понятно. Мне сказали, что мне в Россию должно прийти письмо с описанием и реквизитами, и пока я судорожно думаю, что с этим делать, я решил разобраться, за что может быть штраф.
						</p>

						<p>
							А штраф, скорее всего, за отсутствие очередной дурацкой наклейки на лобовом стекле, которая называется *тут как называется наклейка*. Если вкратце, то эта наклейка говорит о том, что на своем авто ты можешь заехать в жилую зону. Нет наклейки - не можешь. Заехал - штраф 40 евро.
						</p>

						<p>
							Чтобы не получить еще один такой штраф, я решил скорейшим образом приобрести такую наклейку. В интернетах вычитал, что ее продают в офисах некой организации под названием dekra.
						</p>

						<p>
							Утром я сел в авто и покатил до ближайшей заправки, потому как бак у меня был уже почти пустой после долгой дороги из России.  Заплатив 20 евро за пол-бака бензина, я уже хотел было ехать дальше, но тут заметил автосервис неподалеку. Сфоткав на телефон аналогичную наклейку на соседней машине, я отправился в этот автосервис и стал спрашивать у продавца, могу ли я купить такую наклейку (и тыкаю такой пальцем в телефон). И, о чудо, могу! Заплатив 6 евро, показав свой русский талон регистрации и объяснив, где тут лошадиные силы, год выпуска и вин-номер, я уже бежал назад счастливый-довольный с наклеечкой.
						</p>

						<p>
							Вот она какая: *тут фотка наклейки*. С детства люблю клеить наклейки!
						</p>

						<p>
							Мораль: не забывай клеить дурацкие зеленые наклейки, иначе придется "купить" 8 таких "наклеек" в виде штрафа.
						</p>

					</div>

				</div>
			</div>
		);
	}
}
//
// export default createQueryContainer(Article.createQuery({
// 	fields: ['title'],
// 	sort: [
// 		{date: -1}
// 	]
// }, 'ArticleViewerDetailComponent'), ArticleViewerDetailComponent, {
// 	reactive: false,
// 	single: false,
// });