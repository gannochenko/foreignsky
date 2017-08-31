/* eslint-disable class-methods-use-this */

import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Layout from '../../component/layout/layout.jsx';

import { Button } from 'semantic-ui-react';

export default class HomePage extends BasePage
{
    getDefaultTitle()
    {
        return 'Home';
    }

	render()
    {
        return (
            <Layout
                title={this.getDefaultTitle()}
                central={
                    <div className="">
                        <Button>
                            Click Here
                        </Button>
                    </div>
                }
            />
        );
    }
}
