import {LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart} from "react-native-chart-kit";
import React from 'react';
import { View, Text } from 'react-native';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import {data} from './data';
import moment from 'moment';


/* helper function for sorting algorithm */
function getMonthFromString(mon){

    var d = Date.parse(mon + "1, 2012");
    if(!isNaN(d)){
       return new Date(d).getMonth() + 1;
    }
    return -1;
  }

/* the x axis labels */  
var x_axis = data.map(x =>{
    let {created} = x; //extracting the data in epoch format from the source json
    var date = moment(created*1000).format("DD-MMMM-YYYY hh:mm:ss")
     var month = date.toString().split('-')[1]
    return month;   
 })
/* to get full coverage of all the months including those with no value */
 var x_axis = ["January", "April", "May", "June", "February", "March", ...new Set(x_axis)]; //added all the months of the year plus the distinct months from the year
 const xaxis = [...new Set(x_axis)]; //Now took all the distinct values in the list

 /* sorted everything based on how they come in the year */
 xaxis.sort(function(a, b) {
  var monthA =getMonthFromString(a); // ignore upper and lowercase
  var monthB = getMonthFromString(b); // ignore upper and lowercase
  if (monthA < monthB) {
    return -1;
  }
  if (monthA > monthB) {
    return 1;
  }
  // names must be equal
  return 0;
});

/* worked on the y axis */
 var y_axis = [];
     for(const element of xaxis){//iterate through each value in x axis
         let add=0;             // to be used as return value
         for(const fact of data){   // iterating through each list in the source data      
         var date = moment(fact.created*1000).format("DD-MMMM-YYYY hh:mm:ss")
         var month = date.toString().split('-')[1] //extract month in full name form
         if (element.localeCompare(month) === 0) { // i.e. stringCompare()
             if(fact.fee_details.length > 0){
                 if('amount' in fact.fee_details[0]){
                     add = add + fact.fee_details[0].amount/100; //if a month is found, extract it's total value by adding current vale to the original value
             }
         }
         }   
     }
     y_axis.push(add);
 }





export default function componentName() {
  return (
      <View>
        <Text>Bezier Line Chart</Text>
    <LineChart
    data={{
      labels: xaxis,
      datasets: [
        {
        label: 'Stress Amplitude',
        data: y_axis,
        }
      ]
    }}
    width={screenWidth} // from react-native
    height={Dimensions.get("window").height}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      borderWidth:  10,
      borderStyle: 'solid',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16,
        borderWidth : 10,
      },
      strokeWidth: 10,
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
    </View>
  );
}
