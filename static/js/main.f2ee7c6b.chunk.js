(this.webpackJsonphealth_app=this.webpackJsonphealth_app||[]).push([[0],{10:function(e,t,n){},11:function(e,t,n){},13:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),c=n(3),s=n.n(c),l=(n(10),n(4)),j=n(5),i=(n(11),n(0));var h=function(){var e=r.a.useState([]),t=Object(l.a)(e,2),n=t[0],a=t[1];r.a.useEffect((function(){fetch("https://mysplmqrfc.execute-api.eu-west-2.amazonaws.com/serverless_lambda_stage/hello").then((function(e){return e.json()})).then((function(e){a(function(e){for(var t=[],n=0;n<e.length;n++){var a=e[n],r="yellow",c="yellow",s="yellow",l=a.diff>0?"red":"green";if(0!==n){var i=e[n-1];r=a.totalWeight>i.totalWeight?"red":"green",a.totalWeight>i.totalWeight&&a.fat<=i.fat&&(r="yellow"),c=a.lean<i.lean?"red":"green",s=a.fat>i.fat?"red":"green"}t.push(Object(j.a)({weightColor:r,leanColor:c,fatColor:s,diffColor:l},a))}return t}(e).reverse())}),(function(e){console.log(e)}))}),[]);var c=n.length>0?Math.round(100*(n[0].fat-n[n.length-1].fat))/100:0,s=n.length>0?Math.round(100*(n[0].fat-19))/100:0,h=Math.ceil(((new Date).getTime()-new Date("01/03/2022").getTime())/864e5),o=Math.ceil((new Date("04/26/2022").getTime()-(new Date).getTime())/864e5);return Object(i.jsxs)("main",{children:[n.length>0&&Object(i.jsxs)("h3",{children:["Current: ",n[0].fat,"kg from ",n[n.length-1].fat,"kg (",Object(i.jsxs)("span",{className:"green",children:[c,"kg"]}),")",Object(i.jsx)("br",{}),"Target: 19kg (",Object(i.jsxs)("span",{className:"red",children:[s,"kg"]}),")",Object(i.jsx)("br",{}),"Days gone: ",h,", remaining: ",o]}),Object(i.jsxs)("table",{children:[Object(i.jsx)("thead",{children:Object(i.jsxs)("tr",{children:[Object(i.jsx)("th",{children:"Date"}),Object(i.jsxs)("th",{children:["Weight",Object(i.jsx)("br",{}),"(Fat + Lean)"]}),Object(i.jsxs)("th",{children:["Calories",Object(i.jsx)("br",{}),"(Exercise - Ate)"]})]})}),Object(i.jsx)("tbody",{children:n.map((function(e){return Object(i.jsxs)("tr",{children:[Object(i.jsx)("td",{children:e.date}),Object(i.jsxs)("td",{children:[Object(i.jsx)("span",{className:e.weightColor,children:e.totalWeight}),Object(i.jsx)("br",{}),Object(i.jsx)("span",{className:"fat ".concat(e.fatColor),children:e.fat})," +"," ",Object(i.jsx)("span",{className:e.leanColor,children:e.lean})]}),Object(i.jsxs)("td",{children:[Object(i.jsx)("span",{className:e.diffColor,children:e.diff}),Object(i.jsx)("br",{}),e.exercise," - ",e.ate]})]},e.date)}))})]}),Object(i.jsxs)("p",{children:["Ben More: 19kg",Object(i.jsx)("br",{}),"West Highland Way: 21kg",Object(i.jsx)("br",{}),"Ben An: 24kg",Object(i.jsx)("br",{}),"South Glen Sheil Ridge: 27kg"]})]})};s.a.render(Object(i.jsx)(r.a.StrictMode,{children:Object(i.jsx)(h,{})}),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.f2ee7c6b.chunk.js.map