import{a as qe,b as je,d as Ue,e as Qe}from"./chunk-JZ5SWQDL.js";import{b as He,c as Ke}from"./chunk-D2D5N22O.js";import{a as Ne,b as Ae}from"./chunk-YRD62HML.js";import"./chunk-VIHP6IN7.js";import{a as de}from"./chunk-DYPPS7S7.js";import{a as ae,d as le,e as re,f as Be,g as Fe,h as Le,i as se,l as ze}from"./chunk-N6M642QA.js";import{a as $e,b as Re}from"./chunk-J4RNQCKP.js";import"./chunk-FBPU77HL.js";import{b as Ve}from"./chunk-74YFYBWJ.js";import"./chunk-6XOG4M3U.js";import"./chunk-Q3GHP4S4.js";import{T as ee,U as j,_ as be,ca as te,da as N,f as X,g as z,ga as ne,ia as ie,k as we,n as Ee,pa as v,qa as oe,ra as Oe,ua as De,va as Ie,wa as Pe}from"./chunk-GJ5UYCMK.js";import{$a as Ce,Bb as y,Cb as u,Db as b,Fb as xe,Jb as L,K,Ka as B,Kb as fe,L as Q,La as me,Lb as he,M as ge,Mb as ke,O as G,Oa as W,Ob as Se,Pa as Y,Pb as Me,Q as f,Qa as F,Qb as Te,V as D,W as I,Wa as V,Xb as q,Za as g,_a as m,a as U,aa as A,ac as C,b as H,bb as M,bc as J,cb as T,db as p,eb as d,fa as k,fb as r,gb as _,ja as P,mb as $,nb as R,pb as h,qb as c,tb as Z,vb as w,wa as l,wb as E,zb as ve}from"./chunk-YRE2ENPK.js";var Ge=`
    .p-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .p-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .p-togglebutton-checked .p-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .p-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .p-togglebutton.p-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .p-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .p-togglebutton-label,
    .p-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .p-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .p-togglebutton:disabled .p-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .p-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .p-togglebutton-sm .p-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .p-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .p-togglebutton-lg .p-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .p-togglebutton-fluid {
        width: 100%;
    }
`;var rt=["icon"],st=["content"],Je=t=>({$implicit:t});function dt(t,o){t&1&&$(0)}function ct(t,o){if(t&1&&_(0,"span",0),t&2){let e=c(3);y(e.cn(e.cx("icon"),e.checked?e.onIcon:e.offIcon,e.iconPos==="left"?e.cx("iconLeft"):e.cx("iconRight"))),p("pBind",e.ptm("icon"))}}function pt(t,o){if(t&1&&g(0,ct,1,3,"span",2),t&2){let e=c(2);m(e.onIcon||e.offIcon?0:-1)}}function ut(t,o){t&1&&$(0)}function gt(t,o){if(t&1&&F(0,ut,1,0,"ng-container",1),t&2){let e=c(2);p("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)("ngTemplateOutletContext",he(2,Je,e.checked))}}function mt(t,o){if(t&1&&(g(0,pt,1,1)(1,gt,1,4,"ng-container"),d(2,"span",0),u(3),r()),t&2){let e=c();m(e.iconTemplate?1:0),l(2),y(e.cx("label")),p("pBind",e.ptm("label")),l(),b(e.checked?e.hasOnLabel?e.onLabel:"\xA0":e.hasOffLabel?e.offLabel:"\xA0")}}var ft=`
    ${Ge}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,ht={root:({instance:t})=>["p-togglebutton p-component",{"p-togglebutton-checked":t.checked,"p-invalid":t.invalid(),"p-disabled":t.$disabled(),"p-togglebutton-sm p-inputfield-sm":t.size==="small","p-togglebutton-lg p-inputfield-lg":t.size==="large","p-togglebutton-fluid":t.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},We=(()=>{class t extends ne{name="togglebutton";style=ft;classes=ht;static \u0275fac=(()=>{let e;return function(i){return(e||(e=P(t)))(i||t)}})();static \u0275prov=Q({token:t,factory:t.\u0275fac})}return t})();var Ye=new G("TOGGLEBUTTON_INSTANCE"),bt={provide:ae,useExisting:K(()=>_e),multi:!0},_e=(()=>{class t extends de{componentName="ToggleButton";$pcToggleButton=f(Ye,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=f(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}onKeyDown(e){switch(e.code){case"Enter":this.toggle(e),e.preventDefault();break;case"Space":this.toggle(e),e.preventDefault();break}}toggle(e){!this.$disabled()&&!(this.allowEmpty===!1&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:e,checked:this.checked}),this.cd.markForCheck())}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=q(void 0,{transform:C});onChange=new A;iconTemplate;contentTemplate;templates;checked=!1;onInit(){(this.checked===null||this.checked===void 0)&&(this.checked=!1)}_componentStyle=f(We);onBlur(){this.onModelTouched()}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===!0}_iconTemplate;_contentTemplate;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"icon":this._iconTemplate=e.template;break;case"content":this._contentTemplate=e.template;break;default:this._contentTemplate=e.template;break}})}writeControlValue(e,n){this.checked=e,n(e),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.active,invalid:this.invalid(),[this.size]:this.size})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=P(t)))(i||t)}})();static \u0275cmp=B({type:t,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(n,i,a){if(n&1&&Z(a,rt,4)(a,st,4)(a,te,4),n&2){let s;w(s=E())&&(i.iconTemplate=s.first),w(s=E())&&(i.contentTemplate=s.first),w(s=E())&&(i.templates=s)}},hostVars:11,hostBindings:function(n,i){n&1&&h("keydown",function(s){return i.onKeyDown(s)})("click",function(s){return i.toggle(s)}),n&2&&(V("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel)("aria-pressed",i.checked?"true":"false")("role","button")("tabindex",i.tabindex!==void 0?i.tabindex:i.$disabled()?-1:0)("data-pc-name","togglebutton")("data-p-checked",i.active)("data-p-disabled",i.$disabled())("data-p",i.dataP),y(i.cn(i.cx("root"),i.styleClass)))},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",J],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",C],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[L([bt,We,{provide:Ye,useExisting:t},{provide:ie,useExisting:t}]),W([De,v]),Y],decls:3,vars:9,consts:[[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","pBind"]],template:function(n,i){n&1&&(d(0,"span",0),F(1,dt,1,0,"ng-container",1),g(2,mt,4,5),r()),n&2&&(y(i.cx("content")),p("pBind",i.ptm("content")),V("data-p",i.dataP),l(),p("ngTemplateOutlet",i.contentTemplate||i._contentTemplate)("ngTemplateOutletContext",he(7,Je,i.checked)),l(),m(i.contentTemplate?-1:2))},dependencies:[z,X,N,oe,v],encapsulation:2,changeDetection:0})}return t})();var Xe=`
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;var yt=["item"],Ct=(t,o)=>({$implicit:t,index:o});function vt(t,o){return this.getOptionLabel(o)}function xt(t,o){t&1&&$(0)}function kt(t,o){if(t&1&&F(0,xt,1,0,"ng-container",3),t&2){let e=c(2),n=e.$implicit,i=e.$index,a=c();p("ngTemplateOutlet",a.itemTemplate||a._itemTemplate)("ngTemplateOutletContext",ke(2,Ct,n,i))}}function St(t,o){t&1&&F(0,kt,1,5,"ng-template",null,0,Te)}function Mt(t,o){if(t&1){let e=R();d(0,"p-togglebutton",2),h("onChange",function(i){let a=D(e),s=a.$implicit,S=a.$index,O=c();return I(O.onOptionSelect(i,s,S))}),g(1,St,2,0),r()}if(t&2){let e=o.$implicit,n=c();p("autofocus",n.autofocus)("styleClass",n.styleClass)("ngModel",n.isSelected(e))("onLabel",n.getOptionLabel(e))("offLabel",n.getOptionLabel(e))("disabled",n.$disabled()||n.isOptionDisabled(e))("allowEmpty",n.getAllowEmpty())("size",n.size())("fluid",n.fluid())("pt",n.ptm("pcToggleButton"))("unstyled",n.unstyled()),l(),m(n.itemTemplate||n._itemTemplate?1:-1)}}var Tt=`
    ${Xe}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,wt={root:({instance:t})=>["p-selectbutton p-component",{"p-invalid":t.invalid(),"p-selectbutton-fluid":t.fluid()}]},et=(()=>{class t extends ne{name="selectbutton";style=Tt;classes=wt;static \u0275fac=(()=>{let e;return function(i){return(e||(e=P(t)))(i||t)}})();static \u0275prov=Q({token:t,factory:t.\u0275fac})}return t})();var tt=new G("SELECTBUTTON_INSTANCE"),Et={provide:ae,useExisting:K(()=>ce),multi:!0},ce=(()=>{class t extends de{componentName="SelectButton";options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=!1;set unselectable(e){this._unselectable=e,this.allowEmpty=!e}tabindex=0;multiple;allowEmpty=!0;styleClass;ariaLabelledBy;dataKey;autofocus;size=q();fluid=q(void 0,{transform:C});onOptionClick=new A;onChange=new A;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=f(et);$pcSelectButton=f(tt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=f(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(e){return this.optionLabel?ee(e,this.optionLabel):e.label!=null?e.label:e}getOptionValue(e){return this.optionValue?ee(e,this.optionValue):this.optionLabel||e.value===void 0?e:e.value}isOptionDisabled(e){return this.optionDisabled?ee(e,this.optionDisabled):e.disabled!==void 0?e.disabled:!1}onOptionSelect(e,n,i){if(this.$disabled()||this.isOptionDisabled(n))return;let a=this.isSelected(n);if(a&&this.unselectable)return;let s=this.getOptionValue(n),S;if(this.multiple)a?S=this.value.filter(O=>!j(O,s,this.equalityKey||void 0)):S=this.value?[...this.value,s]:[s];else{if(a&&!this.allowEmpty)return;S=a?null:s}this.focusedIndex=i,this.value=S,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:e,value:this.value}),this.onOptionClick.emit({originalEvent:e,option:n,index:i})}changeTabIndexes(e,n){let i,a;for(let s=0;s<=this.el.nativeElement.children.length-1;s++)this.el.nativeElement.children[s].getAttribute("tabindex")==="0"&&(i={elem:this.el.nativeElement.children[s],index:s});n==="prev"?i.index===0?a=this.el.nativeElement.children.length-1:a=i.index-1:i.index===this.el.nativeElement.children.length-1?a=0:a=i.index+1,this.focusedIndex=a,this.el.nativeElement.children[a].focus()}onFocus(e,n){this.focusedIndex=n}onBlur(){this.onModelTouched()}removeOption(e){this.value=this.value.filter(n=>!j(n,this.getOptionValue(e),this.dataKey))}isSelected(e){let n=!1,i=this.getOptionValue(e);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let a of this.value)if(j(a,i,this.dataKey)){n=!0;break}}}else n=j(this.getOptionValue(e),this.value,this.equalityKey||void 0);return n}templates;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="item"&&(this._itemTemplate=e.template)})}writeControlValue(e,n){this.value=e,n(this.value),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=P(t)))(i||t)}})();static \u0275cmp=B({type:t,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(n,i,a){if(n&1&&Z(a,yt,4)(a,te,4),n&2){let s;w(s=E())&&(i.itemTemplate=s.first),w(s=E())&&(i.templates=s)}},hostVars:5,hostBindings:function(n,i){n&2&&(V("role","group")("aria-labelledby",i.ariaLabelledBy)("data-p",i.dataP),y(i.cx("root")))},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",C],tabindex:[2,"tabindex","tabindex",J],multiple:[2,"multiple","multiple",C],allowEmpty:[2,"allowEmpty","allowEmpty",C],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",C],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[L([Et,et,{provide:tt,useExisting:t},{provide:ie,useExisting:t}]),W([v]),Y],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&M(0,Mt,2,12,"p-togglebutton",1,vt,!0),n&2&&T(i.options)},dependencies:[_e,se,le,re,z,X,N,oe],encapsulation:2,changeDetection:0})}return t})(),nt=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=me({type:t});static \u0275inj=ge({imports:[ce,N,N]})}return t})();var Dt=()=>[1,2,3,4,5,6],It=()=>["/planner"],Pt=(t,o)=>o.value,Bt=(t,o)=>o.category,Ft=(t,o)=>o.ingredient_id;function Lt(t,o){if(t&1&&(d(0,"span",3),u(1),r()),t&2){let e=c();l(),xe(" ",e.uncheckedCount," / ",e.ingredients().length," ")}}function zt(t,o){if(t&1&&(d(0,"option",16),u(1),r()),t&2){let e=o.$implicit;p("value",e.value),l(),b(e.label)}}function Nt(t,o){if(t&1){let e=R();d(0,"div",11)(1,"label"),u(2,"Dzie\u0144:"),r(),d(3,"select",15),h("ngModelChange",function(i){D(e);let a=c();return a.selectedDay.set(i),I(a.onDayChange())}),M(4,zt,2,2,"option",16,Pt),r()()}if(t&2){let e=c();l(3),p("ngModel",e.selectedDay()),l(),T(e.dayOptions())}}function At(t,o){t&1&&_(0,"p-skeleton",17)}function Vt(t,o){t&1&&(d(0,"div",12),M(1,At,1,0,"p-skeleton",17,Ce),r()),t&2&&(l(),T(fe(0,Dt)))}function $t(t,o){t&1&&(d(0,"div",13),_(1,"i",18),d(2,"h3"),u(3,"Lista zakup\xF3w jest pusta"),r(),d(4,"p"),u(5,"Dodaj dania do planera, aby automatycznie wygenerowa\u0107 list\u0119 zakup\xF3w."),r(),_(6,"p-button",19),r()),t&2&&(l(6),p("routerLink",fe(1,It)))}function Rt(t,o){if(t&1&&(d(0,"span",29),u(1),r()),t&2){let e=c().$implicit;l(),b(e.sources.join(", "))}}function qt(t,o){if(t&1&&(d(0,"span",32),u(1),Se(2,"expandUnit"),r()),t&2){let e=c(2).$implicit;l(),b(Me(2,1,e.unit,e.total_quantity))}}function jt(t,o){if(t&1&&(d(0,"div",30)(1,"span",31),u(2),r(),g(3,qt,3,4,"span",32),r()),t&2){let e=c().$implicit;l(2),b(e.total_quantity),l(),m(e.unit?3:-1)}}function Ut(t,o){if(t&1){let e=R();d(0,"div",25),h("click",function(){let i=D(e).$implicit,a=c(3);return I(a.toggleIngredient(i))}),d(1,"p-checkbox",26),h("onClick",function(i){return i.stopPropagation()})("ngModelChange",function(){let i=D(e).$implicit,a=c(3);return I(a.toggleIngredient(i))}),r(),d(2,"div",27)(3,"span",28),u(4),r(),g(5,Rt,2,1,"span",29),r(),g(6,jt,4,2,"div",30),r()}if(t&2){let e=o.$implicit;ve("bought",!e.checked),l(),p("ngModel",e.checked)("binary",!0),l(3),b(e.name),l(),m(e.sources.length>0?5:-1),l(),m(e.total_quantity?6:-1)}}function Ht(t,o){if(t&1&&(d(0,"div",20)(1,"div",21),_(2,"i"),d(3,"span"),u(4),r(),d(5,"span",22),u(6),r()(),d(7,"div",23),M(8,Ut,7,7,"div",24,Ft),r()()),t&2){let e=o.$implicit,n=c(2);l(2),y(n.categoryIcon(e.category)),l(2),b(e.category),l(2),b(e.items.length),l(2),T(e.items)}}function Kt(t,o){if(t&1&&(d(0,"div",14),M(1,Ht,10,4,"div",20,Bt),r()),t&2){let e=c();l(),T(e.groupedIngredients)}}var it=class t{plannerService=f(Qe);messageService=f(be);route=f(we);plan=k(null);allPlans=k([]);ingredients=k([]);loading=k(!0);filterMode=k("week");selectedDay=k("");filterOptions=[{label:"Wszystkie zakupy",value:"week"},{label:"Wybrany dzie\u0144",value:"day"}];dayOptions=k([]);get uncheckedCount(){return this.ingredients().filter(o=>o.checked).length}get groupedIngredients(){let o=new Map;for(let e of this.ingredients()){let n=e.category??"Inne";o.has(n)||o.set(n,[]),o.get(n).push(e)}return Array.from(o.entries()).map(([e,n])=>({category:e,items:n}))}get categoryIcon(){let o={mi\u0119so:"pi-box",warzywa:"pi-leaf",nabia\u0142:"pi-circle",owoce:"pi-sun",pieczywo:"pi-inbox",przyprawy:"pi-star",przetwory:"pi-server",inne:"pi-tag"};return e=>"pi "+(o[e.toLowerCase()]??"pi-tag")}async ngOnInit(){let o=this.route.snapshot.queryParamMap.get("planId");try{let e=await this.plannerService.getAllPlans();this.allPlans.set(e);let n;o?n=await this.plannerService.getPlan(o):n=await this.plannerService.getOrCreatePlan(this.plannerService.getWeekStart()),this.plan.set(n);let i=await Promise.all(e.map(x=>this.plannerService.getItems(x.id))),a=new Set;for(let x of i)for(let pe of x){let ye=pe.duration_days||1,ot=new Date(pe.planned_date+"T00:00:00");for(let ue=0;ue<ye;ue++)a.add(this.plannerService.toDateStr(this.plannerService.addDays(ot,ue)))}let s=this.plannerService.toDateStr(new Date),O=Array.from(a).sort().filter(x=>x>=s).map(x=>({label:new Date(x+"T00:00:00").toLocaleDateString("pl-PL",{weekday:"long",day:"numeric",month:"short"}),value:x}));this.dayOptions.set(O),this.selectedDay.set(O[0]?.value??""),await this.loadIngredients()}catch{this.messageService.add({severity:"error",summary:"B\u0142\u0105d",detail:"Nie uda\u0142o si\u0119 za\u0142adowa\u0107 listy zakup\xF3w"})}finally{this.loading.set(!1)}}async onFilterChange(){await this.loadIngredients()}async onDayChange(){await this.loadIngredients()}async loadIngredients(){this.loading.set(!0);try{if(this.filterMode()==="day"){let o=this.selectedDay();if(!o){this.ingredients.set([]);return}let e=this.planForDay(o);if(!e){this.ingredients.set([]);return}let n=await this.plannerService.getShoppingIngredients(e.id,o,o);this.ingredients.set(n)}else{let o=this.plan();if(!o){this.ingredients.set([]);return}let e=await this.plannerService.getShoppingIngredients(o.id);this.ingredients.set(e)}}finally{this.loading.set(!1)}}planForDay(o){return this.allPlans().find(e=>o>=e.week_start&&o<=this.addDays(e.week_start,6))??this.plan()}addDays(o,e){let n=new Date(o+"T00:00:00");n.setDate(n.getDate()+e);let i=n.getFullYear(),a=String(n.getMonth()+1).padStart(2,"0"),s=String(n.getDate()).padStart(2,"0");return`${i}-${a}-${s}`}async toggleIngredient(o){let e=this.filterMode()==="day"?this.planForDay(this.selectedDay()):this.plan();if(!e)return;let n=!o.checked;this.ingredients.update(i=>i.map(a=>a.ingredient_id===o.ingredient_id?H(U({},a),{checked:n}):a));try{await this.plannerService.updateSelection(e.id,o.ingredient_id,n)}catch{this.ingredients.update(i=>i.map(a=>a.ingredient_id===o.ingredient_id?H(U({},a),{checked:!n}):a)),this.messageService.add({severity:"error",summary:"B\u0142\u0105d",detail:"Nie uda\u0142o si\u0119 zapisa\u0107"})}}async checkAll(){await this.setAllChecked(!0)}async uncheckAll(){await this.setAllChecked(!1)}async setAllChecked(o){let e=this.plan();e&&(this.ingredients.update(n=>n.map(i=>H(U({},i),{checked:o}))),await Promise.all(this.ingredients().map(n=>this.plannerService.updateSelection(e.id,n.ingredient_id,o))))}clearBought(){this.ingredients.update(o=>o.filter(e=>e.checked))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=B({type:t,selectors:[["app-shopping"]],features:[L([be])],decls:18,vars:9,consts:[[1,"page-wrapper"],[1,"page-header-card"],[1,"page-header-title"],[1,"count-badge"],[1,"page-header-actions"],["label","Zaznacz wszystko","icon","pi pi-check-square","severity","secondary",3,"onClick","text"],["label","Odznacz wszystko","icon","pi pi-stop","severity","secondary",3,"onClick","text"],["label","Usu\u0144 kupione","icon","pi pi-trash","severity","danger","pTooltip","Usuwa z widoku produkty kt\xF3re masz ju\u017C kupione",3,"onClick","text"],["icon","pi pi-home","severity","secondary","routerLink","/welcome","pTooltip","Strona g\u0142\xF3wna",3,"text"],[1,"filters-bar"],["optionLabel","label","optionValue","value",3,"ngModelChange","options","ngModel"],[1,"day-select"],[1,"loading-list"],[1,"empty-state"],[1,"ingredients-container"],[1,"day-dropdown",3,"ngModelChange","ngModel"],[3,"value"],["height","3.5rem","styleClass","mb-2","borderRadius","10px"],[1,"pi","pi-shopping-cart"],["label","Przejd\u017A do planera","icon","pi pi-calendar",3,"routerLink"],[1,"category-group"],[1,"category-header"],[1,"category-count"],[1,"ingredient-cards"],[1,"ingredient-card",3,"bought"],[1,"ingredient-card",3,"click"],[3,"onClick","ngModelChange","ngModel","binary"],[1,"ing-info"],[1,"ing-name"],[1,"ing-sources"],[1,"ing-qty"],[1,"qty-value"],[1,"qty-unit"]],template:function(e,n){e&1&&(_(0,"p-toast"),d(1,"div",0)(2,"div",1)(3,"div",2)(4,"h1"),u(5,"Lista zakup\xF3w"),r(),g(6,Lt,2,2,"span",3),r(),d(7,"div",4)(8,"p-button",5),h("onClick",function(){return n.checkAll()}),r(),d(9,"p-button",6),h("onClick",function(){return n.uncheckAll()}),r(),d(10,"p-button",7),h("onClick",function(){return n.clearBought()}),r(),_(11,"p-button",8),r()(),d(12,"div",9)(13,"p-selectbutton",10),h("ngModelChange",function(a){return n.filterMode.set(a),n.onFilterChange()}),r(),g(14,Nt,6,1,"div",11),r(),g(15,Vt,3,1,"div",12)(16,$t,7,2,"div",13)(17,Kt,3,0,"div",14),r()),e&2&&(l(6),m(!n.loading()&&n.ingredients().length>0?6:-1),l(2),p("text",!0),l(),p("text",!0),l(),p("text",!0),l(),p("text",!0),l(2),p("options",n.filterOptions)("ngModel",n.filterMode()),l(),m(n.filterMode()==="day"?14:-1),l(),m(n.loading()?15:n.ingredients().length===0?16:17))},dependencies:[z,se,Fe,Le,Be,le,re,Ee,Pe,Ie,je,qe,nt,ce,ze,Ue,Ae,Ne,Ke,He,Re,$e,Oe,Ve],styles:[".header-actions[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem;flex-wrap:wrap}.filters-bar[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}.day-select[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;font-size:.9rem}.day-select[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{font-weight:500}.day-dropdown[_ngcontent-%COMP%]{padding:.4rem .75rem;border-radius:8px;border:1px solid var(--p-content-border-color);background:var(--p-content-background);color:var(--p-text-color);font-size:.9rem;cursor:pointer}.day-dropdown[_ngcontent-%COMP%]:focus{outline:2px solid var(--p-primary-color)}.loading-list[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.5rem}.empty-state[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:4rem 2rem;text-align:center;color:var(--p-text-muted-color)}.empty-state[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:3.5rem;color:var(--p-primary-200)}.empty-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;color:var(--p-text-color)}.empty-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:.9rem}.ingredients-container[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.category-group[_ngcontent-%COMP%]{border:1px solid var(--p-content-border-color);border-radius:12px;overflow:hidden;background:var(--p-content-background)}.category-header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.625rem 1rem;background:var(--p-content-hover-background);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--p-text-muted-color)}.category-header[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{font-size:.9rem}.category-count[_ngcontent-%COMP%]{margin-left:auto;background:var(--p-content-border-color);border-radius:20px;padding:.1rem .5rem;font-size:.75rem}.ingredient-cards[_ngcontent-%COMP%]{display:flex;flex-direction:column}.ingredient-card[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.875rem;padding:.75rem 1rem;border-top:1px solid var(--p-content-border-color);cursor:pointer;transition:background .12s}.ingredient-card[_ngcontent-%COMP%]:first-child{border-top:none}.ingredient-card[_ngcontent-%COMP%]:hover{background:var(--p-content-hover-background)}.ingredient-card.bought[_ngcontent-%COMP%]{opacity:.45}.ingredient-card.bought[_ngcontent-%COMP%]   .ing-name[_ngcontent-%COMP%]{text-decoration:line-through}.ing-info[_ngcontent-%COMP%]{flex:1;min-width:0;display:flex;flex-direction:column;gap:.1rem}.ing-name[_ngcontent-%COMP%]{font-size:.95rem;font-weight:500;transition:opacity .15s}.ing-sources[_ngcontent-%COMP%]{font-size:.75rem;color:var(--p-text-muted-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ing-qty[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:flex-end;gap:0;flex-shrink:0}.qty-value[_ngcontent-%COMP%]{font-size:1rem;font-weight:700;color:var(--p-primary-color)}.qty-unit[_ngcontent-%COMP%]{font-size:.7rem;color:var(--p-text-muted-color);text-transform:uppercase;letter-spacing:.04em}"]})};export{it as ShoppingComponent};
