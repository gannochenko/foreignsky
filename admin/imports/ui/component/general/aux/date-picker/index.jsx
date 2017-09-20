import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import { Button, Header, Modal, Form } from 'semantic-ui-react';
import moment from 'moment';

import './style.less';
import PropTypes from 'prop-types';

export default class DatePicker extends BaseComponent
{
    static propTypes = {
        opened: PropTypes.bool,
        current: PropTypes.date,
        title: PropTypes.string,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
    };

    static defaultProps = {
        opened: false,
        current: null,
        title: 'Date',
        onChange: null,
        onClose: null,
    };

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
        });

        this.onUpdateClick = this.onUpdateClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
    }

    onUpdateClick()
    {
        if (_.isFunction(this.props.onChange))
        {
            this.props.onChange('new value');
        }
    }

    onCloseClick()
    {
        if (_.isFunction(this.props.onClose))
        {
            this.props.onClose();
        }
    }

    getCurrent()
    {
        if (_.isDate(this.props.current))
        {
            return this.props.current;
        }

        return Date.now();
    }

    getTitle()
    {
        return this.props.title || 'Date';
    }

    generateGrid()
    {
        const date = this.getCurrent();

        let b = moment.utc(this.dateLocalToUTC(date));
        let f = moment.utc(this.dateLocalToUTC(date));

        const cMonth = f.month();
        const timeLine = [];

        // generate our calendar grid backward
        let i = 0;
        let pad = 1;
        let decreasePad = false;
        while (i < 50) {
            b = b.add(-1, 'day');

            if (cMonth !== b.month() && !decreasePad)
            {
                // went out of the current month borders, now need to pad
                // console.dir('bday = '+b.day());
                pad = b.day();
                decreasePad = true;
            }

            if (pad <= 0)
            {
                break;
            }

            timeLine.unshift({
                wd: b.day(),
                d: b.date(),
                m: b.month(),
                y: b.year(),
            });

            if (decreasePad) {
                pad -= 1;
            }
            i += 1; // emergency exit
        }

        i = 0;
        pad = 1;
        decreasePad = false;
        while (i < 50) {
            timeLine.push({
                wd: f.day(),
                d: f.date(),
                m: f.month(),
                y: f.year(),
                c: !i, // current day
            });

            f = f.add(1, 'day');
            if (cMonth !== f.month() && !decreasePad)
            {
                // went out of the current month borders, now need to pad
                // we pad to 6 full weeks to display: 6 weeks * 7 days = 42 days to display
                pad = 42 - timeLine.length;
                decreasePad = true;
            }

            if (pad <= 0)
            {
                break;
            }

            if (decreasePad) {
                pad -= 1;
            }
            i += 1; // emergency exit
        }

        // now group by weeks
        const byWeeks = [];
        let cWeek = [];
        timeLine.forEach((day) => {
            if (day.wd === 1 && _.isArrayNotEmpty(cWeek)) // week starts with monday, monday has number 1
            {
                byWeeks.push(cWeek);
                cWeek = [];
            }

            cWeek.push(day);
        });
        // push the last if not empty, just in case...
        if (_.isArrayNotEmpty(cWeek))
        {
            byWeeks.push(cWeek);
        }

        return {
            cMonth,
            grid: byWeeks
        };
    }

    /**
     * Returns the same date, but with the timezone set to UTC (as it would be if we were in GMT zone now)
     * @param date
     * @returns {Date}
     */
    dateLocalToUTC(date)
    {
        // console.dir(date.toString());
        // console.dir('h = '+date.getHours());
        // console.dir('m = '+date.getMinutes());
        // console.dir('s = '+date.getSeconds());

        return new Date(Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(), // hour
            date.getMinutes(), // minute
            date.getSeconds(), // second
            date.getMilliseconds() // millisecond
        ));
    }

    renderMYSelectors()
    {
        return (
            <Form
                inverted
                className="margin-b_x2"
            >
                <Form.Group>
                    <Form.Field
                        inverted
                        width={10}
                    >
                        <select name="" id="">
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                        </select>
                    </Form.Field>
                    <Form.Field
                        inverted
                        width={6}
                    >
                        <input type="text" value="1988" />
                    </Form.Field>
                </Form.Group>
            </Form>
        );
    }

    renderWeek(week, i, cMonth)
    {
        const row = [];

        week.forEach((day) => {

            row.push(
                <div
                    // onClick={this.onCloseClick.bind(this, false)}
                    className={
                        `date-picker__grid-day ${day.c ? 'date-picker__grid-day_current' : ''} ${day.m !== cMonth ? 'date-picker__grid-day_other-month' : ''}`
                    }
                    key={`${day.d}-${day.m}-${day.y}`}
                >
                    {day.d}
                </div>
            );
        });

        return (
            <div
                className="date-picker__grid-row-outer"
                key={i}
            >
                <div className="date-picker__grid-row">
                    {row}
                </div>
            </div>
        );
    }

    renderGrid()
    {
        const data = this.generateGrid();

        return (
            <div className="date-picker__grid">
                {
                    data.grid.map((week, i) => {
                        return this.renderWeek(week, i, data.cMonth);
                    })
                }
            </div>
        );
    }

    render()
    {
        if (!this.props.opened) {
            return null;
        }

        return (
            <Modal
                open={this.props.opened}
                onClose={this.onCloseClick}
                basic
                className="modal_size_mini-custom"
                closeOnDimmerClick={false}
            >
                <Header icon='date' content={`Pick-a-${this.getTitle()}`} />
                <Modal.Content>
                    {this.renderMYSelectors()}
                    {this.renderGrid()}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        basic
                        color='red'
                        inverted
                        onClick={this.onCloseClick}
                    >
                        Close
                    </Button>
                    <Button
                        color='green'
                        inverted
                        onClick={this.onUpdateClick.bind(this, true)}
                    >
                        Update
                    </Button>
                </Modal.Actions>
            </Modal>
        );
    }
}
