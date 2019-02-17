import React, {Component} from 'react';
import {connect} from "react-redux";
import {compose} from "redux";
import { firestoreConnect } from 'react-redux-firebase';

import {Link, Redirect} from "react-router-dom"

import "../../Pages.css";
import "./AdminOrders.css";
import {allProductsNotPackedWarning} from "./../../../../handlers/exceptions.js";
import {packListPDF, orderNotePDF} from "./../../../../handlers/pdfHandlers.js"
import {getColumnsFromArray} from "./../../../../handlers/columnsHandlers.js"
import {setSelectedOrderAction} from './../../../../redux/actions/orderActions';
import { makeOrderLinesData } from '../../../../handlers/dataHandlers/adminOrderDataHandler';
import ClickTable from '../../../ReactTables/ClickTable'
import CheckBoxTable from '../../../ReactTables/CheckBoxTable'
class AdminOrders extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            selected: null,
            packed: {},
            allPacked: 0
        }
        
       
        this.finishOrder = this.finishOrder.bind(this);
    }
    
    showOrderLines = (rowInfo) => {     
    }
            
            finishOrder = (e) => { 
                e.preventDefault()
            }
            
            deleteOrder = (e) => {    
                e.preventDefault()        
            }
            
            goToEdit = (event) =>{
                event.preventDefault();
                if(this.state.selectedItem !== null){
                    this.props.setSelectedOrder(this.state.orders[this.state.selected]);
                    this.props.history.push("/Admin/Orders/Edit/"+this.state.selectedId)
                } else {
                    window.alert("Please select an order to edit.")
                }
            }
            
            
            
            render() {
                
                if(!this.props.auth.uid){
                    return <Redirect to="/"/>
                }

                const orderColumns = getColumnsFromArray(["Owner Name", "Date", "Order Id"]);
                let checkBoxTableColumns = getColumnsFromArray(["Product Id", "Product Name", "Amount"]);
                
                if (this.props.orders && this.props.products) {
                    
                return (
                    <div className="PageStyle AdminOrderFontMinimize customText_b">
                    <div className="frameBordering">
                    <div className="AdminOrderLeft">
                    <div className="leftReactTableAdminOrder OrderList ">
               <ClickTable columns={orderColumns} data={this.props.orders}/>
                </div>
                <div className=" md-2 my-2">
                <button type= "button" className="AdinOrderButtonSizer btn green_BTN mx-2" onClick={()=>this.props.history.push("/Admin/Orders/New")}>Create order</button>                           
                <button className="AdinOrderButtonSizer btn yellow_BTN mx-2" onClick={this.goToEdit}>Edit order </button>
                <button type= "button" className="AdinOrderButtonSizer btn red_BTN mx-2"  onClick={()=>this.deleteOrder()}>Delete order</button>
                </div>
                </div>
                
                
                <div className="AdminOrderRight">
                <div className="Table rightReactTableAdminOrder">
                <CheckBoxTable columns={checkBoxTableColumns} orderLines={this.state.orderLines} products={this.props.products}/>
                <div className="  px-1">
                </div>
                </div> 
                <button type= "button" className="AdinOrderButtonSizer btn std_BTN mx-2" onClick={()=>packListPDF(this.state.selectedItem)} >Export order</button> 
                <button type= "button" className="AdinOrderButtonSizer btn blue_BTN mx-2" onClick={this.finishOrder}>Finish order</button> 
                </div>    
                </div>    
                </div>
                )
            } else {
                return ( <h1>Vent venligst..</h1>)
            } 
        }
        }
        
        const mapStateToProps = state => {
            console.log(state);
            
            return {
                orders: state.firestore.ordered.orders,
                products: state.firestore.ordered.products,
                auth: state.firebase.auth,
                selectedOrder: state.orderReducer.selectedOrder
            } 
        }
        const mapDispatchToProps = (dispatch) => {
            return {
                setSelectedOrder: (payload) => dispatch(setSelectedOrderAction(payload))
            }
        }
        
        
        export default compose(
            connect(mapStateToProps, mapDispatchToProps), 
            firestoreConnect(
                [
                    {collection: 'orders'},
                    {collection: 'products'}
                ]))(AdminOrders)