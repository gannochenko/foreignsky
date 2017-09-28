import React from 'react';
import Util from '../../../../../lib/util.js';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
import Enum from '../../../../../lib/base/enum/index.js';

import PropTypes from 'prop-types';

import './style.less';

export default class SelectBox extends BaseComponent
{
    static propTypes = {
        value: PropTypes.array,
        items: PropTypes.oneOfType([
            PropTypes.array, // todo: describe as shape
            PropTypes.instanceOf(Enum),
        ]),
        name: PropTypes.string,
        onChange: PropTypes.func,
        multiple: PropTypes.bool,
    };

    static defaultProps = {
        value: [],
        items: [],
        name: '',
        onChange: null,
        multiple: true,
    };

    _dropdown = null;
    _bounds = null;
    _search = null;
    _scope = null;

    _enum = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            opened: false,
            up: false,
            displayedItems: [], // currently shown items in the dropdown
        });

        this.onDropDownScroll = this.onDropDownScroll.bind(this);
        this.onItemRemoveClick = this.onItemRemoveClick.bind(this);
        this.onContainerClick = this.onContainerClick.bind(this);
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        this.onSearchKeyUp = _.debounce(this.onSearchKeyUp.bind(this), 300);
        this.onWindowMetricChange = _.throttle(this.onWindowMetricChange.bind(this), 300);
    }

    componentDidMount()
    {
        $(window.document).on('click', this.onDocumentClick);
    }

    componentWillUnmount()
    {
        $(window.document).off('click', this.onDocumentClick);
        this.unBindMetricChange();
    }

    bindMetricChange() {
        $(window).on('scroll', this.onWindowMetricChange);
        $(window).on('resize', this.onWindowMetricChange);
    }

    unBindMetricChange() {
        $(window).off('scroll', this.onWindowMetricChange);
        $(window).off('resize', this.onWindowMetricChange);
    }

    onDropDownScroll(e)
    {
        // blocking scroll up
        if (e.deltaY < 0 && this._dropdown.scrollTop <= 0)
        {
            e.preventDefault();
        }

        // blocking scroll down
        if(e.deltaY > 0)
        {
            if (this._dropdown.scrollTop + this.getHeight(this._dropdown) >= this.getHeight(this._bounds))
            {
                e.preventDefault();
            }
        }
    }

    onWindowMetricChange() {
        this.updateDirection();
    }

    onDocumentClick(e)
    {
        let node = e.target;
        while(node)
        {
            if (node === this._scope)
            {
                return;
            }

            node = node.parentElement;
        }

        this.closeDropDown();
    }

    onContainerClick()
    {
        this.openDropDown(() => {
            this.focusSearch();
        });
    }

    getOnChange()
    {
        if (_.isFunction(this.props.onChange))
        {
            return this.props.onChange;
        }

        return e => e;
    }

    onChange(value)
    {
        this.getOnChange()(value);
    }

    onSearchKeyDown(e)
    {
        if (e.key === 'Backspace' && this._search.value === '')
        {
            if (this.isMultiple())
            {
                // remove last item
                const newVal = _.clone(this.getValue());
                newVal.pop();
                this.onChange(newVal);
            }
            else
            {
                this.onChange('');
            }
        }
    }

    onSearchKeyUp(e)
    {
        const search = this._search.value;
        this.setState({
            displayedItems: this.getItems(search),
        });
    }

    updateDirection() {
        const pos = this._dropdown.getBoundingClientRect();

        if (window.innerHeight > pos.height) {
            if (!this.isUp() && (pos.top + pos.height >= window.innerHeight)) {
                this.setUp();
            }

            if (this.isUp() && pos.top <= 0) {
                this.setDown();
            }
        }
    }

    isUp() {
        return this.state.up;
    }

    setUp() {
        this.setState({
            up: true,
        });
    }

    setDown() {
        this.setState({
            up: false,
        });
    }

    getHeight(el)
    {
        return el.getBoundingClientRect().height;
    }

    getEnum()
    {
        if (!this._enum)
        {
            if (this.props.items instanceof Enum)
            {
                this._enum = this.props.items;
            }
            else if (_.isArray(this.props.items))
            {
                return new Enum(this.props.items);
            }
        }

        return this._enum;
    }

    getValue()
    {
        return this.props.value;
    }

    getName()
    {
        return this.props.name || '';
    }

    isMultiple()
    {
        return this.props.multiple;
    }

    getUnifiedValue()
    {
        const actualValue = this.getValue();

        if (this.isMultiple() && _.isArrayNotEmpty(actualValue))
        {
            return actualValue.filter(x => !!x);
        }
        if (!this.isMultiple() && actualValue)
        {
            return [actualValue];
        }

        return [];
    }

    getItems(search = '')
    {
        return this.getEnum().selectize(search);
    }

    isOpened()
    {
        return this.state.opened;
    }

    openDropDown(cb, search = '')
    {
        if (!this.state.opened)
        {
            this.setState({
                opened: true,
                up: false,
                displayedItems: this.getItems(search),
            }, () => {
                this.bindMetricChange();
                this.updateDirection();
                if (_.isFunction(cb)) {
                    cb();
                }
            });
        }
        else
        {
            if (_.isFunction(cb)) {
                cb();
            }
        }
    }

    closeDropDown()
    {
        if (this.state.opened)
        {
            this.setState({
                opened: false,
            });
            this.unBindMetricChange();
        }
    }

    focusSearch()
    {
        if (this._search)
        {
            this._search.focus();
        }
    }

    isItemSelected(item)
    {
        // todo: improve this, indexOf is slow
        return this.getValue().indexOf(item) >= 0;
    }

    onItemRemoveClick(item, e)
    {
        if (this.isMultiple())
        {
            this.onChange(_.difference(this.getValue(), [item]));
        }
        else
        {
            this.onChange('');
        }
        // to prevent the conflict with .onContainerClick()
        e.stopPropagation();
    }

    onItemSelect(item)
    {
        this.onChange(item);
        this.closeDropDown();
    }

    onItemToggleChange(item)
    {
        if (this.isItemSelected(item))
        {
            this.onChange(_.difference(this.getValue(), [item]));
        }
        else
        {
            this.onChange(_.union(this.getValue(), [item]));
        }

        this.focusSearch();
    }

    renderDropDownItem(item)
    {
        if (!this.isMultiple())
        {
            return (
                <div
                    className="selectbox__dropdown-item"
                    key={item.value+item.label}
                    onClick={this.onItemSelect.bind(this, item.value)}
                >
                    <div className="selectbox__dropdown-item-text">
                        {item.label}
                    </div>
                </div>
            );
        }

        return (
            <label className="selectbox__dropdown-item" key={item.value+item.label}>
                <input
                    type="checkbox"
                    className="selectbox__dropdown-item-checkbox"
                    checked={this.isItemSelected(item.value)}
                    onChange={this.onItemToggleChange.bind(this, item.value)}
                />
                <div className="selectbox__dropdown-item-text padding-l_x2">
                    {item.label}
                </div>
            </label>
        );
    }

    render()
    {
        const value = this.getUnifiedValue();
        
        return (
            <div
                className="selectbox"
                ref={ ref => {this._scope = ref; }}
            >
                <div className="selectbox__container">
                    <div
                        className="selectbox__container-inner"
                        onClick={this.onContainerClick}
                    >
                        {
                            value.map((item) => {
                                return (
                                    <div className="selectbox__item-selected selectbox__item-selected_removable" key={item}>
                                        {this.getEnum().getValue(item)}
                                        <input
                                            value={item}
                                            name={this.getName()}
                                            type="hidden"
                                        />
                                        <div
                                            className="selectbox__item-selected-remove"
                                            onClick={Util.passCtx(this.onItemRemoveClick, [item])}
                                        >
                                            <div className="selectbox__item-selected-remove-icon" />
                                        </div>
                                    </div>
                                );
                            })
                        }
                        {
                            this.isOpened()
                            &&
                            <input
                                type="text"
                                className="selectbox__input"
                                ref={ ref => {this._search = ref; }}
                                onKeyDown={this.onSearchKeyDown}
                                onKeyUp={this.onSearchKeyUp}
                            />
                        }
                    </div>
                    {
                        this.isOpened() && this.state.displayedItems.length > 0
                        &&
                        <div
                            className={`selectbox__dropdown ${this.isUp() ? 'selectbox__dropdown_up' : ''}`}
                            ref={ ref => {this._dropdown = ref; }}
                            onWheel={this.onDropDownScroll}
                        >
                            <div
                                className="selectbox__dropdown-scope"
                                ref={ ref => {this._bounds = ref; }}
                            >
                                {
                                    this.state.displayedItems.map((item) => {
                                        return (this.renderDropDownItem(item));
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
