import React, { Component } from "react";
import ItemManagerContract from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded:false, itemNme:"prod1", DEV:0, REV:0,domain:"",manager:"", description:"", managerName:"",managerReputation:""};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      //const deployedNetwork = ItemManagerContract.networks[networkId];
      
      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContract.abi,
        ItemManagerContract.networks[this.networkId] && ItemManagerContract.networks[this.networkId].address,
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToPaymentEvent();
      //this.listenToCreateManagerEvent();
      this.setState({ loaded:true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  listenToPaymentEvent = (event) => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data" , async function(evt){
      //console.log(evt);
      if(evt.returnValues._step === 1) {
        let itemObj = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
        alert("Item "+ itemObj._identifier + "was paid, deliver it now!");
      }
      //console.log(itemObj);
    });
  }

  // listenToCreateManagerEvent = (event) => {
  //   let self = this;
  //   this.itemManager.events.createdElement().on("data" , async function(evt){
  //     alert("Manager was created!");
  //   });
  // }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name= target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit =  async() => {
    //const {cost, itemName} = this.state;
    const {itemName,DEV, REV,domain,manager, description} = this.state;
     
    let result = await this.itemManager.methods.createItem(itemName, DEV, REV,domain,manager, description).send({from: this.accounts[0]});
    console.log(result);

    const cost= parseInt(DEV)+parseInt(REV);
    alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._itemAddress);
    
  };

  handleSubmitManager =  async() => {
    //const {cost, itemName} = this.state;
    const {managerName,managerReputation} = this.state;
     
    let result = await this.itemManager.methods.createManager(managerName,managerReputation).send({from: this.accounts[0]});
    console.log(result);

    //alert("Send "+cost+" Wei to "+result.events.SupplyChainStep.returnValues._itemAddress);
    
  };

  handleSubmitFinantator =  async() => {
    const {finantatorName,finantatorReputation} = this.state;
     
    let result = await this.itemManager.methods.createFinantator(finantatorName,finantatorReputation).send({from: this.accounts[0]});
    console.log(result);
  }

  handleSubmitFreelancer =  async() => {
    const {freelancerName,freelancerReputation,freelancerCategory} = this.state;
     
    let result = await this.itemManager.methods.createFreelancer(freelancerName,freelancerReputation,freelancerCategory).send({from: this.accounts[0]});
    console.log(result);
  }

  handleSubmitEvaluator =  async() => {
    const {evaluatorName,evaluatorReputation,evaluatorCategory} = this.state;
     
    let result = await this.itemManager.methods.createEvaluator(evaluatorName,evaluatorReputation,evaluatorCategory).send({from: this.accounts[0]});
    console.log(result);
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h2>Add Product</h2>
       
        Item identifier:<input type="text" name="itemName" value={this.state.itemName} 
        onChange={this.handleInputChange}/>
        <br/>
        DEV:<input type="text" name="DEV" value={this.state.DEV} 
        onChange={this.handleInputChange}/>
        <br/>
        REV:<input type="text" name="REV" value={this.state.REV} 
        onChange={this.handleInputChange}/>
        <br/>
        domain:<input type="text" name="domain" value={this.state.domain} 
        onChange={this.handleInputChange}/>
        <br/>
        manager:<input type="text" name="manager" value={this.state.manager} 
        onChange={this.handleInputChange}/>
        <br/>
        description:<input type="text" name="description" value={this.state.description} 
        onChange={this.handleInputChange}/>
        <br/>
        <button type="button" onClick={this.handleSubmit}>Create new Item</button>
        <br/><br/>

        <h2>Add Manager</h2>
        Manager's name:<input type="text" name="managerName" value={this.state.managerName} 
        onChange={this.handleInputChange}/>
        <br/>
        Manager's reputation(1-10, 10 - the best):<input type="text" name="managerReputation" value={this.state.managerReputation} 
        onChange={this.handleInputChange}/>
        <br/>
        <button type="button" onClick={this.handleSubmitManager}>Create manager</button>
        <br/><br/>

        <h2>Add Finantator</h2>
        Finantator's name:<input type="text" name="finantatorName" value={this.state.finantatorName} 
        onChange={this.handleInputChange}/>
        <br/>
        Finantator's reputation(1-10, 10 - the best):<input type="text" name="finantatorReputation" value={this.state.finantatorReputation} 
        onChange={this.handleInputChange}/>
        <br/>
        <button type="button" onClick={this.handleSubmitFinantator}>Create Finantator</button>
        <br/><br/>

        <h2>Add Freelancer</h2>
        Freelancer's name:<input type="text" name="freelancerName" value={this.state.freelancerName} 
        onChange={this.handleInputChange}/>
        <br/>
        Freelancer's reputation(1-10, 10 - the best):<input type="text" name="freelancerReputation" value={this.state.freelancerReputation} 
        onChange={this.handleInputChange}/>
        <br/>
        Freelancer's category:<input type="text" name="freelancerCategory" value={this.state.freelancerCategory} 
        onChange={this.handleInputChange}/>
        <br/>
        <button type="button" onClick={this.handleSubmitFreelancer}>Create Freelancer</button>
        <br/><br/>

        <h2>Add Evaluator</h2>
        Evaluator's name:<input type="text" name="evaluatorName" value={this.state.evaluatorName} 
        onChange={this.handleInputChange}/>
        <br/>
        Evaluator's reputation(1-10, 10 - the best):<input type="text" name="evaluatorReputation" value={this.state.evaluatorReputation} 
        onChange={this.handleInputChange}/>
        <br/>
        Evaluator's category:<input type="text" name="evaluatorCategory" value={this.state.evaluatorCategory} 
        onChange={this.handleInputChange}/>
        <br/>
        <button type="button" onClick={this.handleSubmitEvaluator}>Create Evaluator</button>
        <br/><br/>
      
      </div>

    );
  }
}

export default App;
