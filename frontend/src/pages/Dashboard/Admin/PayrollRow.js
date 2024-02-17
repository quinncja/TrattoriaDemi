import { forwardRef } from "react";
import PayrollInput from "components/PayrollInput"; 

const PayrollRow = forwardRef((props, ref) => {
    const { row, index, handleItemChange, handleRowChange} = props;
    const {employee, ...values} = row;

    const changeItem = (field, value) => {
        const net = calcNet({
            ...values,
            [field]: value,
        })
        handleItemChange(index, field, value, net);
    };

    const changeRow = (newRowData) => {
        handleRowChange(index, newRowData);
    };

    const rounder = (num) => {
        return(Math.round(num * 100) / 100)
    }

    function calcGross(values, hours) {
        const firstgross = rounder(employee.rate[0].rate * hours);
        return {
            ...values,
            hours: hours,
            firstgross: firstgross,
            gross: firstgross + (values.secondgross ? values.secondgross : 0),
        };
    }

    function calcSecondGross(hours) {
        const secondgross = rounder(employee.rate[1].rate * hours);
        return {
            ...values,
            secondHours: hours,
            secondgross: secondgross,
            gross: rounder((values.firstgross || 0) + secondgross),
        };
    }

    function calcTips(tips) {

        const tipsgross = rounder((values.gross || 0) + Number(tips))
        return{
            ...values,
            tips: tips,
            tipsgross: tipsgross,
        }
    }

    function calcTax(values) {
        let gross;
        if(values.tipsgross) gross = (values.tipsgross || values.gross) 
        else gross = values.gross

        const ficaAmnt = rounder(0.0765 * gross);
        const stateAmnt = rounder(employee.state * gross * 0.1);
        const federalAmnt = employee.federal ? rounder(stateAmnt / 2) : 0;
        const ilChoice = employee.ilChoice ? rounder(gross * 0.05) : 0;
    
        return {
            ...values,
            ficaAmnt: ficaAmnt,
            stateAmnt: stateAmnt,
            federalAmnt: federalAmnt,
            ilChoice: ilChoice
        };
    }
    
    function calcLoan(values) {
        const loanAmnt = employee.loan.amount < employee.loan.payment ? employee.loan.amount : employee.loan.payment;
        return {
            ...values,
            loanAmnt: loanAmnt
        };
    }

    function calcNet(values) {
        const netWage = values.gross - values.ficaAmnt - values.stateAmnt - values.federalAmnt - (values.loanAmnt || 0) - (values.ilChoice || 0);
        return rounder(netWage);
    }

    function roundOffFed(values) {
        const newNet = Math.round(values.netWage);
        const difference = newNet - values.netWage;
        const newFed = values.federalAmnt + difference;
        return {
            ...values,
            netWage: newNet,
            federalAmnt: rounder(newFed)
        };
    }
    
    function fillValues(value, second = false, tips = false) {
        let newValues = {...values}
        if(second) newValues = calcSecondGross(value);
        else if(tips) newValues = calcTips(value);
        else newValues = calcGross(newValues, value);
        newValues = calcTax(newValues);
        if(employee.loan) newValues = calcLoan(newValues);
    
        newValues.netWage = calcNet(newValues);
        if(employee.federal) newValues = roundOffFed(newValues); 
    
        changeRow(newValues);
    }

    return (
        <div className="payroll-row">
            <div>{employee.name}</div>
            <div className="payroll-input-row">
                <div className="input-row"> 
                <PayrollInput obj={{
                    text: `Hours @ $${employee.rate[0].rate}/hr`,
                    id: "total-hours",
                    type: "hours",
                    step: "0.01",
                    handleChange: (e) => fillValues(e.target.value),
                    value: values.hours,
                }} />

                {employee.rate.length > 1 && <PayrollInput obj={{
                    text: `Hours @ $${employee.rate[1].rate}/hr`,
                    id: "second-total-hours",
                    type: "hours",
                    step: "0.01",
                    handleChange: (e) => fillValues(e.target.value, true),
                    value: values.secondHours,
                }} /> }
                {employee.tips && <PayrollInput obj={{
                    text: `Tips`,
                    id: "number",
                    step: "0.01",
                    handleChange: (e) => fillValues(e.target.value, false, true),
                    value: values.tips,
                }} /> }
                </div> 

                <div className="input-row input-row-center"> 
                <PayrollInput obj={{
                    text: "Gross Wages",
                    id: "gross-wages",
                    handleChange: (e) => changeItem('gross', e.target.value),
                    value: values.gross,
                }} />

                <PayrollInput obj={{
                    text: "FICA",
                    id: "fica",
                    handleChange: (e) => changeItem('ficaAmnt', e.target.value),
                    value: values.ficaAmnt,
                }} />

                {employee.state !== 0 && <PayrollInput obj={{
                    text: "State Tax",
                    id: "state-tax",
                    handleChange: (e) => changeItem('stateAmnt', e.target.value),
                    value: values.stateAmnt,
                }} /> }

                {employee.federal && 
                <PayrollInput obj={{
                    text: "Federal Tax",
                    id: "federal-tax",
                    handleChange: (e) => changeItem('federalAmnt', e.target.value),
                    value: values.federalAmnt,
                }} /> }

                {employee.ilChoice && 
                <PayrollInput obj={{
                    text: "IL Secure Choice",
                    id: "il-choice",
                    handleChange: (e) => changeItem('ilChoice', e.target.value),
                    value: values.ilChoice,
                }} /> }

                {employee.loan && 
                <PayrollInput obj={{
                    text: "Loan Payment",
                    id: "loan-payment",
                    handleChange: (e) => changeItem('loanAmnt', e.target.value),
                    value: values.loanAmnt,
                }} /> }
                </div>
                <div className="input-row"> 
                <PayrollInput obj={{
                    text: "Net Wages",
                    id: "net-wages",
                    handleChange: (e) => changeItem('netWage', e.target.value),
                    value: values.netWage
                }} />
                </div>
            </div>
        </div>
    );
});

export default PayrollRow;
