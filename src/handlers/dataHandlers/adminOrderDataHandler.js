
export const makeOrderLinesData = (selectedOrder, products) => {
    let orderLines = []
    
    console.log(selectedOrder);
    if (selectedOrder.orderLines) {
        
    selectedOrder.orderLines.forEach((orderLine) => {
        
        products.forEach((product) => {
            
            if (product.id === orderLine.productRef.id) {
                orderLines.push({
                    ...product,
                    amount: orderLine.amount
                })
            }
        })
    })
    
}
    return orderLines;
}