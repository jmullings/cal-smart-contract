import React, {Component} from 'react'
import SmartContractTest from '../build/contracts/SmartContractTest.json'
import Quest from 'react-icons/lib/fa/question';
import Search from 'react-icons/lib/fa/search';
import SmartC from 'react-icons/lib/fa/file';
import Chart from 'react-icons/lib/fa/pie-chart';
import Submit from 'react-icons/lib/fa/long-arrow-right';
import getWeb3 from './utils/getWeb3'
import SkyLight from 'react-skylight';
import contract from 'truffle-contract';
import crossfilter from 'crossfilter'
import BaseComponent from './components/BaseComponent.js';
import TitleComponent from './components/TitleComponent.js';
import {combination} from 'js-combinatorics';
import {timeFormat} from 'd3-time-format'
import {ChartContainer, PieChart, RowChart} from 'dc-react'
import _ from 'lodash';
import {
    BasicForm,
    InputField

} from 'react-serial-forms'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const dateParse = timeFormat("%B %d, %Y");
let newData;
let Dimes = [];
let DimesCount = [];
let TableRows = [];

class CrossfilterContext {
    constructor(data) {
        this.crossfilter = crossfilter(data);
        this.groupAll = this.crossfilter.groupAll();
        let that = this;

        combination([...new Set(Object.keys(data[0]))], 1).forEach(function (d, i) {

            Dimes.push(that.crossfilter.dimension(function (g) {
                return g[d[0]];
            }));
            // DimesGroups.push(that.crossfilter.dimension(function (g) {
            //
            //     return g[d[0]];
            // }).group());
            ///CANT HOLD ANY MORE INFORMATION??? 32<Dimensions
            DimesCount.push(that.crossfilter.dimension(function (g) {

                return g[d[0]];
            }).group().reduceSum(r => r[d[0]]));
        });
    }
}

class PieComponent extends BaseComponent {
    constructor(props) {
        super(props);
        this.dimension = this.props.dimension;
        this.group = this.props.group;
        this.crossfilterContext = (callBack) => {
            if (!callBack) {
                return null;
            }
            ///Format Data for charts///
            newData.forEach(function (d, i) {
                // d["ShareHolder Count"] = +d.name;
                // d["Shares Total"] = +d.shares;
                d["Date Created"] = dateParse(new Date());
            });
            callBack(new CrossfilterContext(newData))
        };
    }

    render() {
        return (
            <ChartContainer className="container" crossfilterContext={this.crossfilterContext}>

                <TitleComponent dimension={this.dimension}/>
                {console.log("this.dimension", this.dimension)}
                <PieChart
                    id="PieChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={250}
                    height={150}
                    transitionDuration={1000}
                    radius={90}
                    innerRadius={40}/>
                <RowChart
                    id="RowChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={450} height={150}
                    transitionDuration={500}
                    elasticX={true}
                    xAxis={axis => axis.ticks(5)}
                    yAxis={axis => axis.ticks(10)}/>
            </ChartContainer>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            storageValue: 0,
            web3: null,
            firstNew: "",
            lastNew: "",
            emailNew: "",
            listedNew: 0,
            first_name: [],
            last_name: [],
            email_address: [],
            listed_shares: [],
            percent_shares: [],
            dataSet: null,
            dataGroup: null
        };
        this.SMTestInstance = null;
        this.crossfilterContext = this.props.crossfilterContext;

    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                });

                // console.log("this.state.web3", this.state.web3);
                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract() {
        let self = this;
        const SMTest = contract(SmartContractTest);
        SMTest.setProvider(this.state.web3.currentProvider);
        if (this.state.web3 === null)
            console.log("No web3 server found!!");


        this.state.web3.eth.getAccounts((error, accounts) => {
            SMTest.deployed().then((instance) => {
                self.SMTestInstance = instance;
            }).then(() => {
                return self.SMTestInstance.getPeople.call()
            }).then((result) => {
                var data = result;
                let shares = String(data[3]).split(',');
                let percent = String(data[4]).split(',');
                this.setState({
                    first_name: String(data[0]).split(','),
                    last_name: String(data[1]).split(','),
                    email_address: String(data[2]).split(','),
                    listed_shares: shares,
                    percent_shares: percent
                })
            })
        });
        Object.assign(this.state, this.serialization());
    }

    render() {

        let self = this;
        let serialization = JSON.stringify(this.serialization(), null, 2);
        let thisState = JSON.stringify(this.state, null, 2);
        let attrs = {
            onChange() {
                self.forceUpdate();
            }
        };


        let SkyDialog = {
            overflow: "scroll"
        };

        return (
            <div className="App">
                <nav className="navbar pure-menu pure-menu-horizontal">
                    <a href="#" style={{marginLeft:"33%"}} className="pure-menu-heading pure-menu-link"><img
                        src={'./img/calcorp.JPG'} style={{height: 30, marginLeft:"40%"}} alt="logo"/>
                        <hr/>
                        <h4>Calata Corporation - Smart Contract (Ethereum)</h4></a>
                </nav>
                <main className="container" style={{padding: "10%"}}>
                    <br /><br />
                    <div style={{float: "left", width: "50%"}}>
                        <h2 style={{display: "inline-block", margin: 0}}>Information -> </h2>
                        <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}}
                                key={0}
                                onClick={this.setGroup.bind(this)}><Quest />
                        </button>
                        <h3>Smart Contract Example</h3>
                        <BasicForm ref='myForm'
                                   onKeyUp={this.onChange}
                                   onSubmit={this.onSubmit}
                                   setDetails={this.setDetails}>
                            <p>
                                <label htmlFor='first_name'>First Name * </label>
                                <InputField
                                    {...attrs}
                                    id='firstNew'
                                    type='text'
                                    value='John'
                                    placeholder='John'
                                    name='firstNew'
                                    validation='required'/>
                            </p>
                            <p>
                                <label htmlFor='last_name'>Last Name * </label>
                                <InputField
                                    {...attrs}
                                    type='text'
                                    value='Smith'
                                    placeholder='Doe'
                                    id='lastNew'
                                    name='lastNew'
                                    validation='required'/>
                            </p>
                            <p>
                                <label htmlFor='last_name'>Email Address * </label>
                                <InputField
                                    {...attrs}
                                    value='email@email.com'
                                    placeholder='email@email.com'
                                    name='emailNew'
                                    validation='required,email'/>
                            </p>
                            <p>
                                <label htmlFor='age'>Listed Shares * </label>
                                <InputField
                                    {...attrs}
                                    type='text'
                                    value='1000'
                                    placeholder='000000'
                                    name='listedNew'
                                    validation='required'/>
                            </p>
                            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={0}
                                    onClick={this.onSubmit.bind(this)}><Submit /></button>
                            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={1}
                                    onClick={this.setDetails.bind(this)}><Search />
                            </button>
                            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={2}
                                    onClick={this.showChart.bind(this)}><Chart />
                            </button>
                            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={3}
                                    onClick={this.showContract.bind(this)}><SmartC />
                            </button>
                        </BasicForm>
                    </div>
                    <div className='serialization' style={{float: "right", width: "50%"}}>
                              <pre>
                                {serialization}
                              </pre>
                    </div>
                </main>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="dialogWithCallBacks"
                          title="Ether Smart Contract:"
                          transitionDuration={1500}>
                    <hr/>
                    <div className="chart-title">This is a full operational Smart Contract linked to the Ethereum
                        'TestNet' BlockChain - written in React for front-end illustration.<br/><br/>
                        As you move through the functions, you will be able to review the breathe of its use and
                        application in the real world.<br/>
                        #Please do not send real Ethereum to this application!!!#
                    </div>
                    <br/><br/>
                    <img src={'./img/calcorp.JPG'} style={{height: 35, marginLeft: "75%"}} alt="logo"/>
                </SkyLight>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="detailsWithCallBacks"
                          title="Contract Details:"
                          transitionDuration={1500}
                          dialogStyles={SkyDialog}>
                    <hr/>
                    <div className="chart-title">
                        <table>
                            <thead>
                            <tr>
                                <th style={{padding: 3}}>First Name</th>
                                <th style={{padding: 3}}>Last Name</th>
                                <th style={{padding: 3}}>Email Address</th>
                                <th style={{padding: 3}}>Listed Shares</th>
                                <th style={{padding: 3}}>Percent (%)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {TableRows}
                            </tbody>
                        </table>
                    </div>
                    <br/><br/>
                    <img src={'./img/calcorp.JPG'} style={{height: 35, marginLeft: "75%"}} alt="logo"/>
                </SkyLight>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="detailsWithBlockChain"
                          title="BlockChain Details:"
                          transitionDuration={1500}
                          dialogStyles={SkyDialog}>
                    <hr/>
                    <div className="chart-title">
                         <pre style={{fontSize: 9}}>
                                 {thisState}
                         </pre>

                    </div>
                    <br/><br/>
                    <img src={'./img/calcorp.JPG'} style={{height: 35, marginLeft: "75%"}} alt="logo"/>
                </SkyLight>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="detailsWithChart"
                          title="BlockChain Details:"
                          transitionDuration={1500}
                          dialogStyles={SkyDialog}>
                    <hr/>
                    <div className="chart-title">
                        {
                            (this.state.dataSet)
                                ? this.state.dataSet
                                : null
                        }
                    </div>
                    <img src={'./img/calcorp.JPG'} style={{height: 35, marginLeft: "75%"}} alt="logo"/>
                </SkyLight>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="detailsWithContract"
                          title="Smart Contract:"
                          transitionDuration={1500}
                          dialogStyles={SkyDialog}>
                    <hr/>
                    <div className="chart-title">
                       <pre style={{color:"red"}}>{
                           `
    pragma solidity ^0.4.8;

    contract SmartContractTest {

    address owner;
    address apply;
    uint public value;
    uint public numSH;

    ShareHolders[] public shareholders;
    function SmartContractTest(uint _numSHolders) public{
        owner = msg.sender;
        numSH=_numSHolders;

    }

    struct ShareHolders {
    uint weight; // weight is accumulated by delegation
    bool claimed;  // if true, that person already claimed account
    address delegate; // person delegated to
    bytes32 firstName; //Share holders name
    bytes32 lastName; //Share holders name
    bytes32 email; //Share holders email
    uint shares; // number of accumulated Shares
    }

    function addPerson(bytes32 _firstName, bytes32 _lastName, bytes32 _email, uint _shares) payable public returns (bool success) {
        ShareHolders memory newPerson;
        newPerson.firstName = _firstName;
        newPerson.lastName = _lastName;
        newPerson.email = _email;
        newPerson.shares = _shares;
        shareholders.push(newPerson);
        numSH += _shares;
        return true;
    }

    function getPeople() public constant returns (bytes32[], bytes32[], bytes32[], uint[]) {

        uint length = shareholders.length;

        bytes32[] memory firstNames = new bytes32[](length);
        bytes32[] memory lastNames = new bytes32[](length);
        bytes32[] memory email = new bytes32[](length);
        uint[] memory shares = new uint[](length);
        uint[] memory percent = new uint[](length);

        for (uint i = 0; i < length; i++) {
            ShareHolders memory currentPerson;
            currentPerson = shareholders[i];
            firstNames[i] = currentPerson.firstName;
            lastNames[i] = currentPerson.lastName;
            email[i] = currentPerson.email;
            shares[i] = currentPerson.shares;
            percent[i] = currentPerson.shares*(numSH/100);

        }
        return (firstNames, lastNames, email,shares);
    }

    function set(uint x) public {
        numSH = x * 10;
    }

    function get() public constant returns (uint) {
        return numSH;
    }
    }`
                       }

                       </pre>
                    </div>
                    <br/><br/>
                    <img src={'./img/calcorp.JPG'} style={{height: 35, marginLeft: "75%"}} alt="logo"/>
                </SkyLight>
            </div>
        );
    }

    setGroup() {
        this.refs.dialogWithCallBacks.show();
        this.forceUpdate();
    }

    setDetails(event) {
        event.preventDefault();
        var self = this;
        Object.assign(this.state, this.serialization());
        this.refs.myForm.validate(function (errs) {
            if (errs.length === 4) {
                alert('Please enter a search value!');
                return;
            }
            // self.forceUpdate();
            self.instantiateContract()
            self.refs.detailsWithCallBacks.show();
        });
        _.each(this.state.first_name, (value, index) => {
            TableRows.push(
                <tr key={index}>
                    <td style={{padding: 3}}>{this.state.web3.toAscii(this.state.first_name[index])}</td>
                    <td style={{padding: 3}}>{this.state.web3.toAscii(this.state.last_name[index])}</td>
                    <td style={{padding: 3}}>{this.state.web3.toAscii(this.state.email_address[index])}</td>
                    <td style={{padding: 3}}>{this.state.listed_shares[index]}</td>
                    <td style={{padding: 3}}>{(this.state.listed_shares[index] * (100 / this.state.percent_shares[index])).toFixed(4)}</td>
                </tr>
            );
        });

    }

    showChart(event) {
        event.preventDefault();

        newData = [];
        _.each(this.state.first_name, (value, index) => {
            let name = this.state.web3.toAscii(this.state.first_name[index]).replace(/^\0+/, '').replace(/\0+$/, '');
            if (name)
                newData.push({
                    key: index,
                    name: name,
                    shares: this.state.listed_shares[index],
                    percent: this.state.listed_shares[index] * (100 / this.state.percent_shares[index])
                })
        });
        this.setState({
            dataSet: <PieComponent dimension={1} group={1}
                                   key={new Date().getTime()}
                                   number={new Date().getTime()}/>
        })

        this.refs.detailsWithChart.show();
    }

    showContract(event) {
        event.preventDefault();
        this.refs.detailsWithContract.show();
    }

    onSubmit(event) {

        event.preventDefault();
        var self = this;
        console.log('Submitted. Checking async errors.');
        Object.assign(this.state, this.serialization());
        this.refs.myForm.validate(function (errs) {
            if (errs) {
                alert('There are ' + errs.length + ' errors.');
                return;
            }
            self.SMTestInstance.addPerson(self.state.firstNew, self.state.lastNew, self.state.emailNew, self.state.listedNew, {
                from: self.state.web3.eth.accounts[0],
                gas: 4500000
            }).then((res)=> {
                Object.assign(self.state, res);
                self.instantiateContract();
            })
        });
        this.instantiateContract();
        this.refs.detailsWithBlockChain.show();

    }


    serialization() {
        if (this.refs.myForm) {
            return this.refs.myForm.serialize();
        }
        return {};
    }

}

export default App
