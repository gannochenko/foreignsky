import React from 'react';
import Header from '../../../ui/component/header/index.jsx';
import LoadOverlay from '../../../ui/component/load.overlay/index.jsx';
import LoadIndicator from '../../../ui/component/load.indicator/index.jsx';
// import Util from '../../util.js';
import {DocHead} from 'meteor/kadira:dochead';
import {FlowRouter} from 'meteor/kadira:flow-router';

export default class Application extends React.Component {

    constructor(props)
    {
        super(props);
        this.state = {
            loaded: false
        };

        this._overlay = null;
        this._map = null;
        this._indicator = null;
        this._imageView = null;

        this.setPageTitle();
        this.setDescription();
        this.setKeywords();
    }

    extendState(extra)
    {
        if(_.isObject(extra))
        {
            Object.assign(this.state, extra);
        }
    }

    static getInstance()
    {
        if(this._instance)
        {
            return this._instance;
        }

        // return mock
        return {
            wait: function(){},
        };
    }

    getOverlay()
    {
        return this._overlay;
    }

    setOverlay(ref)
    {
        if(!this._overlay)
        {
            this._overlay = ref;
        }
    }

    getIndicator()
    {
        return this._indicator;
    }

    setIndicator(ref)
    {
        if(!this._indicator)
        {
            this._indicator = ref;
        }
    }

    getQuery() {
        return FlowRouter.current().queryParams;
    }

    wait(p)
    {
        if(this.getOverlay())
        {
            this.getOverlay().waitOne(p);
        }
        if(this.getIndicator())
        {
            this.getIndicator().waitOne(p);
        }

        return p;
    }

    makeTitle(title = '')
    {
        if (_.isStringNotEmpty(title)) {
            return title.replace(/#DASH#/g, '–');
        }

        return '';
    }

    setTitle(title = '')
    {
        this.setPageTitle(title);
    }

    setPageTitle(title)
    {
        let titlePostfix = 'Еще один блог еще одной семьи, переехавшей в Берлин.';
        title = this.makeTitle(title);
        if (title.length > 0)
        {
            title = `${title} – ${titlePostfix}`
        }
        DocHead.setTitle(title);
    }

    setDescription(text = '')
    {
        DocHead.addMeta({
            name: "description",
            content: _.isStringNotEmpty(text) ? text : 'Еще один блог еще одной семьи, переехавшей в Берлин.',
        });
    }

    setKeywords(keywords = [])
    {
        let kw = [
            'берлин','блог','город','поездка','достопримечательности',
            'места','памятники','статьи','экскурсии','германия',
        ];
        if (_.isArrayNotEmpty(keywords))
        {
            kw = keywords;
        }

        DocHead.addMeta({
            name: "keywords",
            content: kw.join(', '),
        });
    }

    componentWillMount()
    {
        this.constructor._instance = this;
    }

    componentDidMount()
    {
        if(this.getOverlay())
        {
            this.getOverlay().waitAll();
        }

        // shit-fix
        if (this.getIndicator())
        {
            const p = new Promise((resolve) => {resolve()});
            this.getIndicator().waitOne(p);
        }
    }

    showOverlay()
    {
        return true;
    }

    showIndicator()
    {
        return true;
    }

    transformPageParameters(params)
    {
        return params;
    }

    renderExtras()
    {
        return null;
    }

    render() {
        const {main, routeProps} = this.props;

        return (
            <div id="app">
                <div className="layout">
                    {
                        this.showOverlay()
                        &&
                        <LoadOverlay
                            ref={(instance) => {this.setOverlay(instance)}}
                        />
                    }

                    <div className="layout__central layout__header">
                        <Header />
                        {
                            this.showIndicator()
                            &&
                            <LoadIndicator
                                ref={(instance) => {this.setIndicator(instance)}}
                            />
                        }
                    </div>
                    {React.createElement(main, this.transformPageParameters({
                        route: routeProps,
                    }))}
                    {this.renderExtras()}
                </div>
            </div>
        );
    }
}