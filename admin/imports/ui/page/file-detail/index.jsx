/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';
import Form from './component/form/form.jsx';

export default class TestEntityDetailPage extends BasePage
{
    render()
    {
        // todo: better parse ID from the current path according to detailPath, but
        // todo: not rely on FlowRouter behaviour
        return (
            <Layout
                title={Form.getEntity().getTitle()}
                central={
                    <div>
                        <Form
                            id={this.props.route.id}
                            backPath={this.props.route.listPath || ''}
                        />
                        <br />
                        <br />
                    </div>
                }
            />
        );
    }
}
