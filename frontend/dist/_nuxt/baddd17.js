(window.webpackJsonp=window.webpackJsonp||[]).push([[10,2,3,4,5,6,7],{799:function(t,e,r){"use strict";r.r(e);var n={props:["battleHp","hp"],data:function(){return{}},methods:{styleWidth:function(){return{width:Math.round(this.battleHp/this.hp*100)+"%"}}}},o=r(110),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"hp-bar"},[r("div",{staticClass:"pt-1"},[r("div",{staticClass:"mb-4"},[r("div",{staticClass:"overflow-hidden h-2 rounded bg-pink-100"},[r("div",{staticClass:"overflow-hidden h-2 rounded bg-pink-500",style:t.styleWidth()})])])])])}),[],!1,null,null,null);e.default=component.exports},800:function(t,e,r){var content=r(805);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(93).default)("6a8f742a",content,!0,{sourceMap:!1})},801:function(t,e,r){"use strict";r.r(e);var n={props:["statusParam"]},o=r(110),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"status"},[r("div",{staticClass:"flex justify-between"},[r("div",{staticClass:"w-1/2 flex pr-4"},[r("div",{staticClass:"w-1/2"},[t._v("Hp")]),t._v(" "),r("div",{staticClass:"w-1/2 text-right"},[t._v(t._s(t.statusParam.hp))])]),t._v(" "),r("div",{staticClass:"w-1/2 flex pl-4"},[r("div",{staticClass:"w-1/2"},[t._v("It")]),t._v(" "),r("div",{staticClass:"w-1/2 text-right"},[t._v(t._s(t.statusParam.it))])])]),t._v(" "),r("div",{staticClass:"flex justify-between"},[r("div",{staticClass:"w-1/2 flex pr-4"},[r("div",{staticClass:"w-1/2"},[t._v("At")]),t._v(" "),r("div",{staticClass:"w-1/2 text-right"},[t._v(t._s(t.statusParam[1]))])]),t._v(" "),r("div",{staticClass:"w-1/2 flex pl-4"},[r("div",{staticClass:"w-1/2"},[t._v("Sp")]),t._v(" "),r("div",{staticClass:"w-1/2 text-right"},[t._v(t._s(t.statusParam.sp))])])]),t._v(" "),r("div",{staticClass:"flex justify-between"},[r("div",{staticClass:"w-1/2 flex pr-4"},[r("div",{staticClass:"w-1/2"},[t._v("Df")]),t._v(" "),r("div",{staticClass:"w-1/2 text-right"},[t._v(t._s(t.statusParam.df))])]),t._v(" "),r("div",{staticClass:"w-1/2 flex pl-4"})])])}),[],!1,null,null,null);e.default=component.exports},802:function(t,e,r){"use strict";r.r(e);var n={props:["tokenId","ownerAddr"]},o=r(110),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"character"},[r("div",{staticClass:"flex"},[r("div",{staticClass:"pl-4 pt-4"},[r("div",{},[t._v("#"+t._s(t.tokenId))]),t._v(" "),r("div",{},[t._v("Owner:")]),t._v(" "),r("div",{},[t._v(t._s(t.$ethereumService.shortenAddr(t.ownerAddr)))])])])])}),[],!1,null,null,null);e.default=component.exports},803:function(t,e,r){"use strict";r.r(e);var n={props:["text"]},o=r(110),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"button"},[r("button",{staticClass:"text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold",on:{click:function(e){return t.$emit("clickBtn")}}},[t._v("\n    "+t._s(t.text)+"\n  ")])])}),[],!1,null,null,null);e.default=component.exports},804:function(t,e,r){"use strict";r(800)},805:function(t,e,r){var n=r(92)(!1);n.push([t.i,".modal[data-v-65926ab8]{position:fixed;z-index:9999;top:0;left:0;width:100%;height:100%}.modal__mask[data-v-65926ab8]{background:rgba(0,0,0,.3);z-index:9998;-webkit-backdrop-filter:blur(8px)}.modal__mask[data-v-65926ab8],.modal__wrapper[data-v-65926ab8]{position:absolute;top:0;left:0;width:100%;height:100%}.modal__wrapper[data-v-65926ab8]{z-index:9999;display:flex;align-items:center;justify-content:center}.modal__container[data-v-65926ab8]{background:#000;border-radius:.2rem;display:flex;flex-direction:column;max-height:100%;max-width:350px;width:100%;padding:2rem}",""]),t.exports=n},807:function(t,e,r){"use strict";r.r(e);r(45),r(38),r(47),r(21),r(55),r(39),r(56);var n=r(9),o=r(17),l=(r(66),r(94));function c(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var d,v,f={props:["frontierId"],data:function(){return{tokenIds:[1,2,3],selectedTokenId:0,isApproved:!1}},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(l.b)(["walletAddress"])),mounted:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.$ethereumService.isApprovedForAll();case 2:t.isApproved=e.sent;case 3:case"end":return e.stop()}}),e)})))()},methods:{approve:(v=Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!this.isApproved){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,this.$ethereumService.setApprovalForAll();case 4:case"end":return t.stop()}}),t,this)}))),function(){return v.apply(this,arguments)}),stake:(d=Object(n.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.isApproved){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,this.$ethereumService.ownerOf(this.selectedTokenId);case 4:if(t.sent.toLowerCase()==this.walletAddress){t.next=8;break}return console.log("not owner"),t.abrupt("return",this.$store.dispatch("showSnackbar",{show:!0,text:"this token is not your own or staked"}));case 8:return console.log("stake"),t.next=11,this.$ethereumService.stake(this.selectedTokenId,this.frontierId);case 11:this.$emit("closeModal");case 12:case"end":return t.stop()}}),t,this)}))),function(){return d.apply(this,arguments)})}},h=f,_=(r(804),r(110)),component=Object(_.a)(h,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"modal"},[r("div",{staticClass:"modal__mask"}),t._v(" "),r("div",{staticClass:"modal__wrapper"},[r("div",{staticClass:"modal__container"},[r("div",{staticClass:"text-right"},[r("button",{staticClass:"p-2",on:{click:function(e){return t.$emit("closeModal")}}},[t._v("×")])]),t._v(" "),r("div",{},[t._v("FrontierID")]),t._v(" "),r("div",{},[t._v(t._s(t.frontierId))]),t._v(" "),r("div",{staticClass:"mt-6"},[t._v("TokenID")]),t._v(" "),r("div",{staticClass:"w-full"},[r("input",{directives:[{name:"model",rawName:"v-model.number",value:t.selectedTokenId,expression:"selectedTokenId",modifiers:{number:!0}}],staticClass:"w-full bg-gray-800 p-2 border-none rounded text-white",attrs:{type:"number",placeholder:"tokenID"},domProps:{value:t.selectedTokenId},on:{input:function(e){e.target.composing||(t.selectedTokenId=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),t._v(" "),r("div",{staticClass:"mt-6 text-center"},[r("button",{staticClass:"text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold",class:{"border-gray-500":t.isApproved,"text-gray-500":t.isApproved},on:{click:function(e){return t.approve()}}},[t._v("\n          Approve\n          ")])]),t._v(" "),r("div",{staticClass:"mt-6 text-center"},[r("button",{staticClass:"text-frontier border-solid border-2 rounded-xl border-frontier px-6 py-1 font-bold",class:{"border-gray-500":!t.isApproved,"text-gray-500":!t.isApproved},on:{click:function(e){return t.stake()}}},[t._v("\n        Stake\n        ")])])])])])}),[],!1,null,"65926ab8",null);e.default=component.exports},808:function(t,e,r){"use strict";r.r(e);var n={components:{HpBar:r(799).default},props:["isBattleNow","battleHp","mapHp","deadBlock","isA"],data:function(){return{}},computed:{isReverse:function(){return{"flex-row-reverse":!this.isA}}},methods:{styleWidth:function(t,e){return{width:Math.round(t/e*100)+"%"}}}},o=r(110),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"hp"},[r("div",{staticClass:"flex justify-between",class:t.isReverse},[r("div",{staticClass:"pt-2"},[t._v(t._s(t.battleHp)+" / "+t._s(t.mapHp))]),t._v(" "),r("div",{staticClass:"text-2xl font-bold"},[t.isBattleNow?t._e():[0==t.battleHp?r("span",{staticClass:"text-gray-500"},[t._v("Lose")]):r("span",{staticClass:"text-frontier"},[t._v("Win")])]],2)]),t._v(" "),r("HpBar",{attrs:{battleHp:t.battleHp,hp:t.mapHp}}),t._v(" "),r("div",{staticClass:"flex justify-between mt-2",class:t.isReverse},[r("div",{staticClass:"pt-2"},[t._v("DeadBlock")]),t._v(" "),r("div",{staticClass:"text-2xl"},[0==t.battleHp?r("span",[t._v(t._s(t.deadBlock))]):r("span",[t._v("-")])])])],1)}),[],!1,null,null,null);e.default=component.exports},815:function(t,e,r){"use strict";r.r(e);r(45),r(38),r(47),r(21),r(55),r(39),r(56);var n=r(9),o=r(17),l=(r(66),r(94)),c=(r(263),r(807)),d=r(801),v=r(802),f=r(808),h=r(803);function _(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var m,k,w={components:{StakeModal:c.default,Status:d.default,Character:v.default,Hp:f.default,FroBtn:h.default},data:function(){return{frontierId:0,isModal:!1,bothBattleHp:{},isBattleNow:!1,frontier:{},stakerA:{staker:"0x"},statusA:{},stakerB:{staker:"0x"},statusB:{}}},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?_(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):_(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(l.b)(["walletAddress"])),mounted:(k=Object(n.a)(regeneratorRuntime.mark((function t(){var e,r,n,o,l,c;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log("mounted",this.$route.params.id),this.frontierId=this.$route.params.id,this.walletAddress){t.next=5;break}return console.log("please login"),t.abrupt("return");case 5:return t.next=7,this.$ethereumService.getFrontier(this.frontierId);case 7:return e=t.sent,console.log("frontier",e),this.frontier=e,t.next=12,this.$ethereumService.getBothBattleHp(this.frontierId);case 12:if(r=t.sent,console.log("bothBattleHp",r),this.bothBattleHp=r,this.isBattleNow=this.bothBattleHp.hpA>0&&this.bothBattleHp.hpB>0,!(this.frontier.tokenIdA>0)){t.next=27;break}return t.next=19,this.$ethereumService.getStake(this.frontier.tokenIdA);case 19:return n=t.sent,console.log("stakerA",n),this.stakerA=n,t.next=24,this.$ethereumService.getStatus(this.frontier.tokenIdA);case 24:o=t.sent,console.log("statusA",o),this.statusA=o;case 27:if(!(this.frontier.tokenIdB>0)){t.next=38;break}return t.next=30,this.$ethereumService.getStake(this.frontier.tokenIdB);case 30:return l=t.sent,console.log("stakerB",l),this.stakerB=l,t.next=35,this.$ethereumService.getStatus(this.frontier.tokenIdB);case 35:c=t.sent,console.log("statusB",c),this.statusB=c;case 38:case"end":return t.stop()}}),t,this)}))),function(){return k.apply(this,arguments)}),created:function(){},methods:{showStakeModal:function(){this.isModal=!0},canUnStake:function(t){return!this.isBattleNow&&t.toLowerCase()==this.walletAddress.toLowerCase()},unStake:(m=Object(n.a)(regeneratorRuntime.mark((function t(e){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.$ethereumService.unStake(e);case 2:case"end":return t.stop()}}),t,this)}))),function(t){return m.apply(this,arguments)}),closeModal:function(){this.isModal=!1}}},x=w,C=r(110),component=Object(C.a)(x,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"container mx-auto"},[r("div",{staticClass:"flex justify-between mt-6"},[r("div",{staticClass:"w-32 font-bold"},[r("span",{staticClass:"text-xl"},[t._v("F")]),t._v("rontier No.\n      "),r("span",{staticClass:"text-xl"},[t._v(t._s(t.$route.params.id))])]),t._v(" "),t.isBattleNow?t._e():r("div",{staticClass:"w-32 text-right"},[r("FroBtn",{attrs:{text:"Stake"},on:{clickBtn:function(e){return t.showStakeModal()}}})],1)]),t._v(" "),r("div",{staticClass:"flex justify-between mt-6"},[t.frontier.tokenIdA>0?[r("div",{staticClass:"w-5/12 bg-black/[.5] p-8"},[r("Character",{attrs:{tokenId:t.frontier.tokenIdA,ownerAddr:t.stakerA.staker}}),t._v(" "),r("div",{staticClass:"mt-6"},[r("hp",{attrs:{isBattleNow:t.isBattleNow,battleHp:t.bothBattleHp.hpA,mapHp:t.statusA.hp,deadBlock:t.bothBattleHp.deadBlock,isA:!0}})],1),t._v(" "),r("div",{staticClass:"mt-10"},[r("status",{attrs:{statusParam:t.statusA}})],1),t._v(" "),r("div",{staticClass:"mt-12 text-center"},[t.canUnStake(t.stakerA.staker)?r("FroBtn",{attrs:{text:"UnStake"},on:{clickBtn:function(e){return t.unStake(t.frontier.tokenIdA)}}}):t._e()],1)],1)]:t._e(),t._v(" "),t.frontier.tokenIdB>0?[r("div",{staticClass:"w-5/12 bg-black/[.5] p-8"},[r("Character",{attrs:{tokenId:t.frontier.tokenIdB,ownerAddr:t.stakerB.staker}}),t._v(" "),r("div",{staticClass:"mt-6"},[r("hp",{attrs:{isBattleNow:t.isBattleNow,battleHp:t.bothBattleHp.hpB,mapHp:t.statusB.hp,deadBlock:t.bothBattleHp.deadBlock,isA:!1}})],1),t._v(" "),r("div",{staticClass:"mt-10"},[r("status",{attrs:{statusParam:t.statusB}})],1),t._v(" "),r("div",{staticClass:"mt-12 text-center"},[t.canUnStake(t.stakerB.staker)?r("FroBtn",{attrs:{text:"UnStake"},on:{clickBtn:function(e){return t.unStake(t.frontier.tokenIdB)}}}):t._e()],1)],1)]:t._e()],2),t._v(" "),t.isModal?r("StakeModal",{attrs:{frontierId:t.frontierId},on:{closeModal:t.closeModal}}):t._e()],1)}),[],!1,null,"dd34c212",null);e.default=component.exports}}]);