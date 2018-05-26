import React, { Component } from 'react';
import './CryptoItem.css'

class CryptoItem extends Component {

    deleteCoin(id){
        this.props.onDelete(id);
    }

    changeProfitValues(moneyAmount, cryptoAmount, price, symbol, id) {

        moneyAmount = parseFloat(moneyAmount.replace(",", "."));
        cryptoAmount = parseFloat(cryptoAmount.replace(",", "."));
        if (!moneyAmount) {
            moneyAmount = 0
        }
        if (!cryptoAmount) {
            cryptoAmount = 0
        }

        let totalMoney = parseFloat(cryptoAmount * moneyAmount).toFixed(2);
        if (totalMoney.length < 16) {
            this.refs.moneyAfterGoal.innerHTML = "$ " + totalMoney;
        } else {
            this.refs.moneyAfterGoal.innerHTML = "To big";
        }

        let precentage = (moneyAmount / price * 100 - 100).toFixed(2);
        let profRef = this.refs.profitInPrecentage;
        if (moneyAmount !== 0) {
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
            this.pushUserInputs(totalMoney, precentage, id, symbol, price, cryptoAmount);
        }
        if (moneyAmount === 0) {
            profRef.style.color = "black";
            profRef.innerHTML = "0%";
        }

    }


    getUserInputs(){

        let moneyAmount = this.moneyAmount.value;
        let cryptoAmount = this.cryptoAmount.value;
        let price = this.props.coinData.quotes.USD.price;
        let symbol = this.props.crypto.symbol;
        let id = this.props.crypto.id;

        this.changeProfitValues(moneyAmount,cryptoAmount,price, symbol, id);

    }

    pushUserInputs(totalMoney, precentage, id, symbol, price, cryptoAmount){

        let userInput = {
            id:id,
            totalMoney:totalMoney,
            precentage:precentage,
            price:price,
            symbol:symbol,
            cryptoAmount:cryptoAmount
        };

        this.props.onGetUserInputs(userInput);
    }

    render() {
        if(!this.props.coinData){
            return (
                <div className="CryptoItem">
                    <div className="CryptoSymbol">
                        <div className="Cross" >x</div>
                        <h1>...</h1>
                    </div>
                    <div className="CryptoValue">
                        Calculated for
                        <div className="CalculatedValue">
                            1 ... = $ ...
                        </div>
                    </div>
                    <div className="UserInput">
                        <label htmlFor="amount">Amount of coins</label>
                        <input type="text" id="amount" placeholder="1.0000"/>
                        <label htmlFor="goal">Goal per coin($)</label>
                        <input type="text" id="goal" placeholder="1.0000"/>
                        <label>money after goal</label>
                        <div ref="moneyAfterGoal">$ 0,00</div>
                        <label>profit in precentage</label>
                        <div ref="profitInPrecentage" >0%</div>
                    </div>
                </div>

            );
        }
        return (
            <div className="CryptoItem">
                <div className="CryptoSymbol">
                    <div className="Cross" onClick={this.deleteCoin.bind(this, this.props.crypto.id)}>x</div>
                    <h1>{this.props.crypto.symbol}</h1>
                </div>
                <div className="CryptoValue">
                    Calculated for
                    <div className="CalculatedValue">
                        1 {this.props.crypto.symbol} = $ {this.props.coinData.quotes.USD.price}
                    </div>
                </div>
                <div className="UserInput">
                    <label htmlFor="amount">Amount of coins</label>
                    <input type="text" id="amount" placeholder="1.0000"  ref={(input) => {this.cryptoAmount = input}} onChange={this.getUserInputs.bind(this)}/>
                    <label htmlFor="goal">Goal price per coin($)</label>
                    <input type="text" id="goal" placeholder="1.0000" ref={(input) => {this.moneyAmount = input}} onChange={this.getUserInputs.bind(this)}/>
                    <label>Money after goal</label>
                    <div ref="moneyAfterGoal">$ 0,00</div>
                    <label>Profit in precentage</label>
                    <div ref="profitInPrecentage" >0%</div>
                </div>
            </div>

        );
    }
}

export default CryptoItem;