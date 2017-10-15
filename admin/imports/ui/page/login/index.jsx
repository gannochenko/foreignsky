import React from 'react';
import BasePage from '../../../lib/base/page/page.jsx';

import Form from '../../component/general/form/form.jsx';

import {FlowRouter} from 'meteor/kadira:flow-router';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

import './style.less';

export default class LoginPage extends BasePage {
    constructor() {
        super();
        this.state = {
            errorMessage: null
        };
    }

    onSubmitForm(data) {
        return new Promise((resolve, reject) => {
            this.data = data;
            const login = this.data.login;
            const password = this.data.password;
            // const hashedPassword = Utils.SHA256(password);

            Meteor.loginWithPassword(login, password, (error) => {
                if (!error)
                {
                    FlowRouter.go('/');
                    resolve();
                }
                else
                {
                    if (error.error === 403)
                    {
                        this.setServerError('Login incorrect');
                    }
                    else
                    {
                        this.setServerError('Server error');
                    }
                    reject('');
                }
            });
        });
    }

    onValidateForm()
    {
        this.setServerError();
    }

    setServerError(message)
    {
        this.setState({
            errorMessage: _.isStringNotEmpty(message) ? message : null,
        });
    }

    render() {
        return (
            <div className="layout content_v_center_h_center h_100p">
                <div className="layout__inner_centered">
                    <div className="margin-b_x padding-b_x f-size_x2p25">
                        Welcome back, commander!
                    </div>
                    <Form
                        map={[
                            {
                                code: 'login',
                                type: String,
                                label: 'E-mail',
                                regEx: SimpleSchema.RegEx.Email,
                            },
                            {
                                code: 'password',
                                type: String,
                                label: 'Password',
                                optional: true,
                                parameter: {
                                    secure: true,
                                },
                            },
                        ]}
                        submitButtonLabel="Login"
                        onSubmit={this.onSubmitForm.bind(this)}
                        onValidate={this.onValidateForm.bind(this)}
                        error={this.state.errorMessage}
                    >
                    </Form>
                </div>
            </div>
        );
    }
}
