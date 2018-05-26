import React, { Component } from 'react';
import uuid from 'uuid';
import Select from 'react-virtualized-select';
import './SelectSearch.css'
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'

class SelectSearch extends Component {

    constructor(){
        super();

        this.state = {
            newCoin:{},
            coins: []
        }
    }

    getCoins(nextProps){
        let options = [];
        nextProps.coins.data.map( coin => {
            options.push({value: coin.symbol, label: coin.name, apiId: coin.id})
        });
        this.setState({coins: options});
    }


    componentWillReceiveProps(nextProps){
        this.getCoins(nextProps);
    }


    handleAddCoin(coin){
        this.setState({newCoin:{
            id: uuid.v4(),
            title: coin.label,
            symbol: coin.value,
            apiId: coin.apiId
        }}, function () {
            this.props.addCoin(this.state.newCoin);
        });
    }

    render() {
        if (this.state.coins.length > 0){
            return (
                <div className="SelectSearch">
                    <Select
                        placeholder="Search and add cryptocurrency"
                        name="name"
                        value="value"
                        options={this.state.coins}
                        onChange={coin => this.handleAddCoin(coin)}
                    />
                </div>
            );
        } else {
            return (
                <div className="SelectSearch">
                    <Select
                        placeholder="Loading coins...."
                        name="name"
                        value="value"
                        options={[{value: "Loading coins...", label: "Loading coins..."}]}
                    />
                </div>
            );
        }
    }
}

export default SelectSearch;