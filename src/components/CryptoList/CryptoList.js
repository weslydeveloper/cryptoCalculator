import React, { Component } from 'react';
import $ from 'jquery';

import CryptoItem from '../CryptoItem/CryptoItem'
import './CryptoList.css'


class CryptoList extends Component {

    constructor(){
        super();

        this.cachedCoins = [];

        this.state = {
            coinData:[],
            userInput:[]
        }
    }

    deleteCoin(id) {
        this.props.onDelete(id);

        let userInput = this.state.userInput;
        let inputIndex = userInput.findIndex(item => item.id === id);
        userInput.splice(inputIndex, 1);

        this.setState({userInput:userInput});
    }

    GetUserInputs(userInput) {
        let inputs = this.state.userInput;
        let index = this.state.userInput.findIndex(input => input.id === userInput.id);
        if (index > -1){
            inputs.splice(index, 1);
        }
        inputs.push(userInput);
        this.setState({userInput:inputs});
    }

    getCoinData(){
        this.props.cryptoList.map( crypto => {
            if(!(this.cachedCoins.indexOf(crypto.symbol) > -1)){
                this.cachedCoins.push(crypto.symbol);

                $.ajax({
                    url: 'https://api.coinmarketcap.com/v2/ticker/'+ crypto.apiId +'/',
                    dataType: 'json',
                    cache: false,
                    success: function (data) {
                        let coinData = this.state.coinData;
                        coinData[crypto.symbol] = data.data;
                        this.setState({coinData: coinData});
                    }.bind(this),
                    error: function (xhr, status, err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    changeProfitValues(){
        let totalMoney = 0;
        let precentage = 0;
        let balances = [];
        this.state.userInput.map( input => {
            balances.push(input.price * input.cryptoAmount);
            totalMoney = totalMoney + parseFloat(input.totalMoney);
            precentage = precentage + parseFloat(input.precentage);
        });
        let oldMoney = eval(balances.join('+'));
        let profRef = this.refs.profitInPrecentage;
        precentage = (totalMoney / oldMoney * 100 - 100).toFixed(2);

        if (totalMoney.toFixed(2).length < 16){
            this.refs.moneyAfterGoal.innerHTML = "$ " + totalMoney.toFixed(2);
        } else {
            this.refs.moneyAfterGoal.innerHTML = "To big";
        }

        if (precentage.length < 16) {
            profRef.innerHTML = precentage + "%";
            if (precentage > 0) {
                profRef.style.color = "green";
            } else if (precentage < 0) {
                profRef.style.color = "red";
            } else {
                profRef.style.color = "black";
            }
        } else {
            profRef.style.color = "black";
            profRef.innerHTML = "To big";
        }
    }


    render() {
        this.getCoinData();
        let cryptoItems;
        let totalValue;
        if(this.props.cryptoList){
            cryptoItems = this.props.cryptoList.map( crypto => {
                return(
                    <CryptoItem
                        onDelete={this.deleteCoin.bind(this)}
                        onGetUserInputs={this.GetUserInputs.bind(this)}
                        key={crypto.id}
                        crypto={crypto}
                        coinData={this.state.coinData[crypto.symbol]}
                    />
                );
            });

            totalValue =
                <div className="CryptoTotal">
                    <div className="UserTotal">
                        <label>Total money after goals</label>
                        <div ref="moneyAfterGoal">$ 0.00</div>
                        <label>Profit in precentage</label>
                        <div ref="profitInPrecentage" >0%</div>
                    </div>
                </div>;

            if(this.state.userInput.length > 0){
                this.changeProfitValues();
            }
        }

        if(this.props.cryptoList.length > 0){
            return (
                <div className="CryptoList">
                    {cryptoItems}
                    {totalValue}
                </div>
            );
        } else {
            return (
                <div className="NoCoinAdded">
                    <h1>Add a coin</h1>
                </div>
            );
        }
    }
}

export default CryptoList;