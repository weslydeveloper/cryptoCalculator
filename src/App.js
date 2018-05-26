import React, { Component } from 'react';
import $ from 'jquery';

import SelectSearch  from './components/SelectSearch/SelectSearch';
import CryptoList  from './components/CryptoList/CryptoList';
import './App.css';

class App extends Component {

    constructor(){
        super();

        this.state = {
            cryptoList: [],
            coins:[],
        }
    }


    getCoins(){
        $.ajax({
            url: 'https://api.coinmarketcap.com/v2/listings/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({coins: data}, function () {
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }

    componentWillMount(){
        this.getCoins();
    }

    handleAddCoin(coin){

        let cryptoList = this.state.cryptoList;
        cryptoList.push(coin);
        this.setState({cryptoList:cryptoList});
    }

    handleDeleteCoin(id){
        let cryptoList = this.state.cryptoList;
        let cryptoIndex = cryptoList.findIndex(item => item.id === id);
        cryptoList.splice(cryptoIndex, 1);

        this.setState({cryptoList:cryptoList});
    }

    render() {
        return (
            <div className="App">
                <SelectSearch coins={this.state.coins} addCoin={this.handleAddCoin.bind(this)} />
                <CryptoList
                    cryptoList={this.state.cryptoList}
                    onDelete={this.handleDeleteCoin.bind(this)}
                />
            </div>
        );
    }
}

export default App;
