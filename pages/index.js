import React, { Component } from "react";
import Web3 from "web3";
import DevToken from "../components/abis/DevToken.json";
import LinkToken from "../components/abis/LinkToken.json";
import Dai from "../components/abis/Dai.json";
import AvaSwap from "../components/abis/AvaSwap.json";
import Navbar from "../components/Navbar";
import Main from "../components/Main";
import "../styles/Home.module.css";

class Home extends Component {
  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData(this.state.tokens[0]);
    console.log(await this.getLatestPrice());
  }

  async loadBlockchainData(selectedToken) {
    const web3 = window.web3;

    // Load Network ID
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    // get account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // Set AvaSwap balance
    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    // Load Token
    if (selectedToken.address && networkId === 43113) {
      const token = new web3.eth.Contract(
        selectedToken.name === "LINK"
          ? LinkToken.abi
          : selectedToken.name === "DAI"
          ? Dai.abi
          : DevToken.abi,
        selectedToken.address
      );
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert("Fuji Test Network not detected");
    }

    // Load AvaSwap
    if (selectedToken.avaSwapAddress) {
      const avaSwap = new web3.eth.Contract(
        AvaSwap.abi,
        selectedToken.avaSwapAddress
      );
      this.setState({ avaSwap });
    } else {
      window.alert("AvaSwap Network not detected");
    }

    // Loading is done, to set loading == false
    this.setState({ loading: false });
  }

  async loadWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  fetchMinedTransactionReceipt = (transactionHash) => {
    return new Promise((resolve, reject) => {
      const { web3 } = window;

      var timer = setInterval(() => {
        web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
          if (!err && receipt) {
            clearInterval(timer);
            resolve(receipt);
          }
        });
      }, 2000);
    });
  };

  // Get latest price ETH/DAI
  getLatestPrice = async () => {
    this.setState({ loading: true });
    this.state.avaSwap.methods
      .getLatestPrice()
      .send({ from: this.state.account })
      .on("transactionHash", async (transactionHash) => {
        const receipt = await this.fetchMinedTransactionReceipt(
          transactionHash
        );
        if (receipt) {
          this.setState({ loading: false });
          this.loadBlockchainData(this.state.selectedToken);
        }
      });
  };

  // Buy tokens @desc take input some amount of wei
  buyTokens = async (etherAmount) => {
    this.setState({ loading: true });
    this.state.avaSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", async (transactionHash) => {
        const receipt = await this.fetchMinedTransactionReceipt(
          transactionHash
        );
        if (receipt) {
          this.setState({ loading: false });
          this.loadBlockchainData(this.state.selectedToken);
        }
      });
  };

  sellTokens = async (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.avaSwap.address, tokenAmount)
      .send({ from: this.state.account })
      .on("transactionHash", async (hash) => {
        const approveReceipt = await this.fetchMinedTransactionReceipt(hash);
        if (approveReceipt)
          this.state.avaSwap.methods
            .sellToken(tokenAmount)
            .send({ from: this.state.account })
            .on("transactionHash", async (transactionHash) => {
              const receipt = await this.fetchMinedTransactionReceipt(
                transactionHash
              );
              if (receipt) {
                this.setState({ loading: false });
                this.loadBlockchainData(this.state.selectedToken);
              }
            });
      });
  };

  handleTokenChange = async (token) => {
    const { tokens } = this.state;
    const selectedToken =
      token === tokens[0].name
        ? tokens[0]
        : token === tokens[1].name
        ? tokens[1]
        : tokens[2];
    this.setState({ selectedToken: selectedToken });
    this.loadBlockchainData(selectedToken);
  };

  // react state
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      avaSwap: {},
      selectedToken: {
        name: "LINK",
        address: "0x8804952b4740e2A1E2A1FEfB2329dCF1c6D90cEF",
        avaSwapAddress: "0x12425EC5502E238E7B2147BbDF5Ed0F810a08B69",
      },
      tokenAddress: "0x43b23072b895a342e464C4116D4fb8d3aaF53c78",
      tokenBalance: "0",
      ethBalance: "0",
      loading: true,
      tokens: [
        {
          name: "LINK",
          address: "0x8804952b4740e2A1E2A1FEfB2329dCF1c6D90cEF",
          avaSwapAddress: "0x12425EC5502E238E7B2147BbDF5Ed0F810a08B69",
        },
        {
          name: "DAI",
          address: "0x7bb3AAEd990277F02C496a6FEB5eA9a422EaBe9c",
          avaSwapAddress: "0x533ff7D73AE9c0c00fF57cD0695639B06a976Adf",
        },
        {
          name: "DEV",
          address: "0x569669C82952Fa17e481aCae3DFc66e61a672A23",
          avaSwapAddress: "0x77F6a51e04C8E6E9932ceceE67d81774DB7656dd",
        },
      ],
    };
  }

  render() {
    let content;
    if (this.state.loading)
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    else
      content = (
        <Main
          selectedToken={this.state.selectedToken}
          ethBalance={this.state.ethBalance}
          tokenBalance={this.state.tokenBalance}
          buyTokens={this.buyTokens}
          sellTokens={this.sellTokens}
          handleTokenChange={this.handleTokenChange}
        />
      );
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row ava-swap">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
