(this.webpackJsonphealth_app=this.webpackJsonphealth_app||[]).push([[0],{10:function(e,t,s){},11:function(e,t,s){},13:function(e,t,s){"use strict";s.r(t);var a=s(1),r=s.n(a),n=s(3),c=s.n(n),o=(s(10),s(4)),i=(s(11),s(5)),l=new Date("04/26/2022");function h(e){var t=new Date(e),s=(new Date).getTime()-t.getTime(),a=Math.round(s/864e5);return Math.abs(a)}var j=function(e){fetch("https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/weight").then((function(e){return e.json()})).then((function(t){e(function(e){for(var t=[],s=0;s<e.length;s++){var a=e[s],r="yellow",n="yellow",c=a.diff>0?"red":"green";if(0!==s){var o=e[s-1];r=a.totalWeight>o.totalWeight?"red":"green",a.totalWeight>o.totalWeight&&a.fat<=o.fat&&(r="yellow"),n=a.fat>o.fat?"red":"green"}t.push(Object(i.a)({weightColor:r,fatColor:n,diffColor:c},a))}return t}(t).reverse())}),(function(e){console.log(e)}))},d=s(0);var b=function(){var e=r.a.useState([]),t=Object(o.a)(e,2),s=t[0],a=t[1];r.a.useEffect((function(){j(a)}),[]);var n=function(e){if(0===e.length)return{amountLost:0,startWeight:0,currentWeight:0,amountLeftToLose:0,daysToRobRoyWay:0,fatLossProgress:0,periodProgress:0,desiredWeight:0};var t=e[0],s=e[e.length-1],a=h(l),r=s.fat-4,n=t.fat-s.fat,c=t.fat-r,o=Math.abs(n)/4,i=h(new Date(s.date))/28;return{daysToRobRoyWay:a,startWeight:s.fat,currentWeight:t.fat,desiredWeight:Math.round(10*r)/10,amountLost:Math.round(10*n)/10,amountLeftToLose:Math.round(10*c)/10,fatLossProgress:Math.round(100*o),periodProgress:Math.round(100*i)}}(s),c=n.startWeight,i=n.currentWeight,b=n.amountLost,g=n.amountLeftToLose,f=n.daysToRobRoyWay,x=n.fatLossProgress,u=n.periodProgress,O=n.desiredWeight;return Object(d.jsxs)("main",{children:[s.length>0&&Object(d.jsxs)(d.Fragment,{children:[Object(d.jsxs)("h3",{children:[c,"kg | ",Object(d.jsxs)("span",{className:"green",children:[b,"kg"]})," |"," ",Object(d.jsxs)("span",{className:"fat",children:[i,"kg"]})," |"," ",Object(d.jsxs)("span",{className:"red",children:[g,"kg"]})," | ",O,"kg"]}),Object(d.jsx)("p",{children:Object(d.jsxs)("em",{children:[f," days remaining to 19kg goal"]})})]}),Object(d.jsx)("div",{className:"progress-container tooltip",children:Object(d.jsxs)("div",{className:"progress-bar",children:[Object(d.jsx)("span",{className:"progress-bar-fill ",style:{width:"".concat(x,"%")}}),Object(d.jsxs)("span",{className:"tooltiptext",children:[x,"% fat lost"]})]})}),Object(d.jsx)("div",{className:"progress-container tooltip",children:Object(d.jsxs)("div",{className:"progress-bar",children:[Object(d.jsx)("span",{className:"progress-bar-fill-days",style:{width:"".concat(u,"%")}}),Object(d.jsxs)("span",{className:"tooltiptext",children:[u,"% into time period"]})]})}),s.length>0&&Object(d.jsxs)("table",{children:[Object(d.jsx)("thead",{children:Object(d.jsxs)("tr",{children:[Object(d.jsx)("th",{children:"Date"}),Object(d.jsxs)("th",{children:["Weight",Object(d.jsx)("br",{}),"(Fat + Lean)"]}),Object(d.jsxs)("th",{children:["Calories",Object(d.jsx)("br",{}),"(Exercise - Ate)"]})]})}),Object(d.jsx)("tbody",{children:s.map((function(e){return Object(d.jsxs)("tr",{children:[Object(d.jsx)("td",{children:e.date}),Object(d.jsxs)("td",{children:[Object(d.jsx)("span",{className:e.weightColor,children:e.totalWeight}),Object(d.jsx)("br",{}),Object(d.jsx)("span",{className:"fat ".concat(e.fatColor),children:e.fat})," ","+ ",Object(d.jsx)("span",{children:e.lean})]}),Object(d.jsxs)("td",{children:[Object(d.jsx)("span",{className:e.diffColor,children:e.diff}),Object(d.jsx)("br",{}),e.exercise," - ",e.ate]})]},e.date)}))})]}),Object(d.jsxs)("p",{children:["Ben More: 19kg",Object(d.jsx)("br",{}),"West Highland Way / Beinn Eighe: 21kg",Object(d.jsx)("br",{}),"Ben An: 24kg",Object(d.jsx)("br",{}),"South Glen Sheil Ridge / Ben Lui: 27kg"]})]})};c.a.render(Object(d.jsx)(r.a.StrictMode,{children:Object(d.jsx)(b,{})}),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.e9475e7b.chunk.js.map