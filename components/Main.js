import React, { Component } from "react";
import BuyForm from "./BuyForm";
import SellForm from "./SellForm";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentForm: "buy",
    };
  }

  // method to handle token change when tokens are switched like Link, Dai and DevToken
  handleTokenChange = (token) => {
    this.props.handleTokenChange(token);
  };
  // Display the components in render method and pass the required params
  render() {
    let content;
    if (this.state.currentForm === "buy")
      content = (
        <BuyForm
          selectedToken={this.props.selectedToken}
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          buyTokens={this.props.buyTokens}
          handleTokenChange={this.handleTokenChange}
        />
      );
    else
      content = (
        <SellForm
          selectedToken={this.props.selectedToken}
          ethBalance={this.props.ethBalance}
          tokenBalance={this.props.tokenBalance}
          sellTokens={this.props.sellTokens}
          handleTokenChange={this.handleTokenChange}
        />
      );
    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
          <button
            className={
              this.state.currentForm === "buy"
                ? "btn btn-primary"
                : "btn btn-light"
            }
            onClick={(event) => {
              this.setState({ currentForm: "buy" });
            }}
          >
            Buy
          </button>
          <span>&lt; &nbsp; &gt;</span>
          <button
            className={
              this.state.currentForm === "sell"
                ? "btn btn-primary"
                : "btn btn-light"
            }
            onClick={(event) => {
              this.setState({ currentForm: "sell" });
            }}
          >
            Sell
          </button>
        </div>
        <div className="card mb-4">
          <div className="card-body">{content}</div>
        </div>
      </div>
    );
  }
}

export default Main;
