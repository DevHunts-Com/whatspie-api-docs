"use strict";(self.webpackChunkwhatspie_doc=self.webpackChunkwhatspie_doc||[]).push([[1942],{52991:(e,t,i)=>{i.d(t,{Z:()=>g});var r=i(67294),n=i(86010),c=i(53438),s=i(39960),a=i(13919),l=i(95999);const o="cardContainer_fWXF",d="cardTitle_rnsV",m="cardDescription_PWke";function u(e){let{href:t,children:i}=e;return r.createElement(s.default,{href:t,className:(0,n.default)("card padding--lg",o)},i)}function p(e){let{href:t,icon:i,title:c,description:s}=e;return r.createElement(u,{href:t},r.createElement("h2",{className:(0,n.default)("text--truncate",d),title:c},i," ",c),s&&r.createElement("p",{className:(0,n.default)("text--truncate",m),title:s},s))}function f(e){let{item:t}=e;const i=(0,c.Wl)(t);return i?r.createElement(p,{href:i,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:t.description??(0,l.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function h(e){let{item:t}=e;const i=(0,a.Z)(t.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",n=(0,c.xz)(t.docId??void 0);return r.createElement(p,{href:t.href,icon:i,title:t.label,description:t.description??n?.description})}function v(e){let{item:t}=e;switch(t.type){case"link":return r.createElement(h,{item:t});case"category":return r.createElement(f,{item:t});default:throw new Error(`unknown item type ${JSON.stringify(t)}`)}}function w(e){let{className:t}=e;const i=(0,c.jA)();return r.createElement(g,{items:i.items,className:t})}function g(e){const{items:t,className:i}=e;if(!t)return r.createElement(w,e);const s=(0,c.MN)(t);return r.createElement("section",{className:(0,n.default)("row",i)},s.map(((e,t)=>r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(v,{item:e})))))}},7604:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>m});var r=i(87462),n=(i(67294),i(3905)),c=i(52991),s=i(53438);const a={id:"devices",title:"Devices",description:"Devices",custom_edit_url:null},l=void 0,o={unversionedId:"whatspie/devices",id:"whatspie/devices",title:"Devices",description:"Devices",source:"@site/docs/whatspie/devices.tag.mdx",sourceDirName:"whatspie",slug:"/whatspie/devices",permalink:"/docs/whatspie/devices",draft:!1,editUrl:null,tags:[],version:"current",frontMatter:{id:"devices",title:"Devices",description:"Devices",custom_edit_url:null},sidebar:"WhatspieApiSideBar",previous:{title:"Send Template Message",permalink:"/docs/whatspie/sending-template-message"},next:{title:"Create Device (only for reseller)",permalink:"/docs/whatspie/create-device-onlyforreseller"}},d={},m=[],u={toc:m};function p(e){let{components:t,...i}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,i,{components:t,mdxType:"MDXLayout"}),(0,n.kt)(c.Z,{items:(0,s.jA)().items,mdxType:"DocCardList"}))}p.isMDXComponent=!0}}]);