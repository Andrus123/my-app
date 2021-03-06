import React, { Component } from "react";
import avaxLogo from "./avax-logo.png";
import tokenLogo from "./token-logo.png";
import daiLogo from "./dai-logo.png";
import chainlinkLogo from "./chainlink-link-logo.png";

class SellForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
      selected: props.selectedToken.name,
    };
  }
  // method to handle token change when tokens are switched like Link, Dai and DevToken
  handleChange = (event) => {
    this.setState({ selected: event.target.value });
    this.props.handleTokenChange(event.target.value);
  };
  // Display the form components in render method and pass the required states and props
  render() {
    let { selected } = this.state;
    return (
      <form
        className="mb-5"
        onSubmit={(event) => {
          event.preventDefault();
          let tokenAmount;
          tokenAmount = this.input.value.toString();
          tokenAmount = window.web3.utils.toWei(tokenAmount, "Ether");
          this.props.sellTokens(tokenAmount);
        }}
      >
        <div>
          <label className="float-left">
            <b>Input</b>
          </label>
          <span className="float-right text-muted">
            Balance:{" "}
            {window.web3.utils.fromWei(this.props.tokenBalance, "Ether")}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const tokenAmount = this.input.value.toString();
              this.setState({
                output: tokenAmount / 100,
              });
            }}
            ref={(input) => {
              this.input = input;
            }}
            placeholder="0"
            className="form-control form-control-lg"
            required
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img
                src={
                  selected === "LINK"
                    ? chainlinkLogo
                    : selected === "DAI"
                    ? daiLogo
                    : tokenLogo
                }
                height="32"
                alt=""
              />
              &nbsp;
              <select onChange={this.handleChange}>
                <option selected={selected === "LINK"} defaultValue="LINK">
                  LINK
                </option>
                <option selected={selected === "DEV"} defaultValue="DEV">
                  DEV
                </option>
                <option selected={selected === "DAI"} defaultValue="DAI">
                  DAI
                </option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <label className="float-left">
            <b>Output</b>
          </label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            value={this.state.output}
            type="text"
            placeholder="0"
            className="form-control form-control-lg"
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              &nbsp;&nbsp;&nbsp;
              <img src={avaxLogo} height="32" alt="" />
              &nbsp;&nbsp;&nbsp; AVAX &nbsp;&nbsp;&nbsp;
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">
            <b>Exchange Rate</b>
          </span>
          <span className="float-right text-muted">
            100 {selected} = 1 AVAX
          </span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          SWAP!
        </button>
      </form>
    );
  }
}

export default SellForm;
