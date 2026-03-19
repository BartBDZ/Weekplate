import{a as _e}from"./chunk-D2D5N22O.js";import{a as we}from"./chunk-DYPPS7S7.js";import{a as Ce,c as Ie}from"./chunk-N6M642QA.js";import{a as ke,b as xe}from"./chunk-Q3GHP4S4.js";import{U as ge,V as me,b as he,ca as fe,d as ue,da as _,f as be,g as R,ga as H,ia as L,ja as ve,pa as l,qa as C,ta as ye}from"./chunk-GJ5UYCMK.js";import{Ab as $,Bb as s,Jb as O,K as te,Ka as x,L as k,La as F,M as z,Nb as se,O as V,Oa as N,Pa as v,Q as d,Qa as S,Tb as le,Wa as u,X as M,Xb as Y,a as K,aa as E,ac as T,b as X,bc as pe,db as c,eb as D,fa as ne,fb as B,gb as q,ja as g,jb as ie,kb as U,lb as W,pb as oe,qb as y,rb as re,sb as ae,tb as ce,ub as de,vb as A,wa as m,wb as j}from"./chunk-YRE2ENPK.js";var Fe=["data-p-icon","minus"],Me=(()=>{class e extends ye{static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=x({type:e,selectors:[["","data-p-icon","minus"]],features:[v],attrs:Fe,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(i,n){i&1&&(M(),ie(0,"path",0))},encapsulation:2})}return e})();var Se=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var qe=["icon"],Ae=["input"],je=(e,o,t)=>({checked:e,class:o,dataP:t});function $e(e,o){if(e&1&&q(0,"span",8),e&2){let t=y(3);s(t.cx("icon")),c("ngClass",t.checkboxIcon)("pBind",t.ptm("icon")),u("data-p",t.dataP)}}function Oe(e,o){if(e&1&&(M(),q(0,"svg",9)),e&2){let t=y(3);s(t.cx("icon")),c("pBind",t.ptm("icon")),u("data-p",t.dataP)}}function Re(e,o){if(e&1&&(U(0),S(1,$e,1,5,"span",6)(2,Oe,1,4,"svg",7),W()),e&2){let t=y(2);m(),c("ngIf",t.checkboxIcon),m(),c("ngIf",!t.checkboxIcon)}}function He(e,o){if(e&1&&(M(),q(0,"svg",10)),e&2){let t=y(2);s(t.cx("icon")),c("pBind",t.ptm("icon")),u("data-p",t.dataP)}}function Le(e,o){if(e&1&&(U(0),S(1,Re,3,2,"ng-container",3)(2,He,1,4,"svg",5),W()),e&2){let t=y();m(),c("ngIf",t.checked),m(),c("ngIf",t._indeterminate())}}function Qe(e,o){}function Ge(e,o){e&1&&S(0,Qe,0,0,"ng-template")}var Ke=`
    ${Se}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Xe={root:({instance:e})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":e.checked,"p-disabled":e.$disabled(),"p-invalid":e.invalid(),"p-variant-filled":e.$variant()==="filled","p-checkbox-sm p-inputfield-sm":e.size()==="small","p-checkbox-lg p-inputfield-lg":e.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},De=(()=>{class e extends H{name="checkbox";style=Ke;classes=Xe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var Be=new V("CHECKBOX_INSTANCE"),Ue={provide:Ce,useExisting:te(()=>Te),multi:!0},Te=(()=>{class e extends we{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=Y();size=Y();onChange=new E;onFocus=new E;onBlur=new E;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:me(this.value,this.modelValue())}_indeterminate=ne(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=d(De);bindDirectiveInstance=d(l,{self:!0});$pcCheckbox=d(Be,{optional:!0,skipSelf:!0})??void 0;$variant=le(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"icon":this._checkboxIconTemplate=t.template;break;case"checkboxicon":this._checkboxIconTemplate=t.template;break}})}onChanges(t){t.indeterminate&&this._indeterminate.set(t.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(t){let i,n=this.injector.get(Ie,null,{optional:!0,self:!0}),r=n&&!this.formControl?n.value:this.modelValue();this.binary?(i=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(i),this.onModelChange(i)):(this.checked||this._indeterminate()?i=r.filter(a=>!ge(a,this.value)):i=r?[...r,this.value]:[this.value],this.onModelChange(i),this.writeModelValue(i),this.formControl&&this.formControl.setValue(i)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:i,originalEvent:t})}handleChange(t){this.readonly||this.updateModel(t)}onInputFocus(t){this.focused=!0,this.onFocus.emit(t)}onInputBlur(t){this.focused=!1,this.onBlur.emit(t),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(t,i){i(t),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=x({type:e,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(i,n,r){if(i&1&&ce(r,qe,4)(r,fe,4),i&2){let a;A(a=j())&&(n.checkboxIconTemplate=a.first),A(a=j())&&(n.templates=a)}},viewQuery:function(i,n){if(i&1&&de(Ae,5),i&2){let r;A(r=j())&&(n.inputViewChild=r.first)}},hostVars:6,hostBindings:function(i,n){i&2&&(u("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled())("data-p",n.dataP),s(n.cn(n.cx("root"),n.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",T],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",pe],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",T],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",T],autofocus:[2,"autofocus","autofocus",T],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[O([Ue,De,{provide:Be,useExisting:e},{provide:L,useExisting:e}]),N([l]),v],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(i,n){i&1&&(D(0,"input",1,0),oe("focus",function(a){return n.onInputFocus(a)})("blur",function(a){return n.onInputBlur(a)})("change",function(a){return n.handleChange(a)}),B(),D(2,"div",2),S(3,Le,3,2,"ng-container",3)(4,Ge,1,0,null,4),B()),i&2&&($(n.inputStyle),s(n.cn(n.cx("input"),n.inputClass)),c("checked",n.checked)("pBind",n.ptm("input")),u("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),m(2),s(n.cx("box")),c("pBind",n.ptm("box")),u("data-p",n.dataP),m(),c("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),m(),c("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",se(22,je,n.checked,n.cx("icon"),n.dataP)))},dependencies:[R,he,ue,be,_,_e,Me,C,l],encapsulation:2,changeDetection:0})}return e})(),Mt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=F({type:e});static \u0275inj=z({imports:[Te,_,_]})}return e})();var Pe=`
    .p-divider-horizontal {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        margin: dt('divider.horizontal.margin');
        padding: dt('divider.horizontal.padding');
    }

    .p-divider-horizontal:before {
        position: absolute;
        display: block;
        inset-block-start: 50%;
        inset-inline-start: 0;
        width: 100%;
        content: '';
        border-block-start: 1px solid dt('divider.border.color');
    }

    .p-divider-horizontal .p-divider-content {
        padding: dt('divider.horizontal.content.padding');
    }

    .p-divider-vertical {
        min-height: 100%;
        display: flex;
        position: relative;
        justify-content: center;
        margin: dt('divider.vertical.margin');
        padding: dt('divider.vertical.padding');
    }

    .p-divider-vertical:before {
        position: absolute;
        display: block;
        inset-block-start: 0;
        inset-inline-start: 50%;
        height: 100%;
        content: '';
        border-inline-start: 1px solid dt('divider.border.color');
    }

    .p-divider.p-divider-vertical .p-divider-content {
        padding: dt('divider.vertical.content.padding');
    }

    .p-divider-content {
        z-index: 1;
        background: dt('divider.content.background');
        color: dt('divider.content.color');
    }

    .p-divider-solid.p-divider-horizontal:before {
        border-block-start-style: solid;
    }

    .p-divider-solid.p-divider-vertical:before {
        border-inline-start-style: solid;
    }

    .p-divider-dashed.p-divider-horizontal:before {
        border-block-start-style: dashed;
    }

    .p-divider-dashed.p-divider-vertical:before {
        border-inline-start-style: dashed;
    }

    .p-divider-dotted.p-divider-horizontal:before {
        border-block-start-style: dotted;
    }

    .p-divider-dotted.p-divider-vertical:before {
        border-inline-start-style: dotted;
    }

    .p-divider-left:dir(rtl),
    .p-divider-right:dir(rtl) {
        flex-direction: row-reverse;
    }
`;var We=["*"],Ye={root:({instance:e})=>({justifyContent:e.layout==="horizontal"?e.align==="center"||e.align==null?"center":e.align==="left"?"flex-start":e.align==="right"?"flex-end":null:null,alignItems:e.layout==="vertical"?e.align==="center"||e.align==null?"center":e.align==="top"?"flex-start":e.align==="bottom"?"flex-end":null:null})},Ze={root:({instance:e})=>["p-divider p-component","p-divider-"+e.layout,"p-divider-"+e.type,{"p-divider-left":e.layout==="horizontal"&&(!e.align||e.align==="left")},{"p-divider-center":e.layout==="horizontal"&&e.align==="center"},{"p-divider-right":e.layout==="horizontal"&&e.align==="right"},{"p-divider-top":e.layout==="vertical"&&e.align==="top"},{"p-divider-center":e.layout==="vertical"&&(!e.align||e.align==="center")},{"p-divider-bottom":e.layout==="vertical"&&e.align==="bottom"}],content:"p-divider-content"},ze=(()=>{class e extends H{name="divider";style=Pe;classes=Ze;inlineStyles=Ye;static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var Ve=new V("DIVIDER_INSTANCE"),Je=(()=>{class e extends ve{componentName="Divider";$pcDivider=d(Ve,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=d(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;layout="horizontal";type="solid";align;_componentStyle=d(ze);get dataP(){return this.cn({[this.align]:this.align,[this.layout]:this.layout,[this.type]:this.type})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=x({type:e,selectors:[["p-divider"]],hostAttrs:["role","separator"],hostVars:6,hostBindings:function(i,n){i&2&&(u("aria-orientation",n.layout)("data-p",n.dataP),$(n.sx("root")),s(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",layout:"layout",type:"type",align:"align"},features:[O([ze,{provide:Ve,useExisting:e},{provide:L,useExisting:e}]),N([l]),v],ngContentSelectors:We,decls:2,vars:3,consts:[[3,"pBind"]],template:function(i,n){i&1&&(re(),D(0,"div",0),ae(1),B()),i&2&&(s(n.cx("content")),c("pBind",n.ptm("content")))},dependencies:[R,_,C,l],encapsulation:2,changeDetection:0})}return e})(),Ht=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=F({type:e});static \u0275inj=z({imports:[Je,C,C]})}return e})();var Ee=class e{db=d(ke).client;auth=d(xe);async getOrCreatePlan(o){let t=this.auth.user()?.id;if(!t)throw new Error("Niezalogowany");let i=this.toDateStr(o);await this.db.from("profiles").upsert({id:t},{onConflict:"id",ignoreDuplicates:!0});let{data:n}=await this.db.from("meal_plans").select("*").eq("profile_id",t).eq("week_start",i).maybeSingle();if(n)return n;let{data:r,error:a}=await this.db.from("meal_plans").insert({profile_id:t,week_start:i}).select().single();if(a)throw a;return r}async getAllPlans(){let o=this.auth.user()?.id;if(!o)return[];let{data:t,error:i}=await this.db.from("meal_plans").select("*").eq("profile_id",o).order("week_start",{ascending:!0});if(i)throw i;return t??[]}async getPlan(o){let{data:t,error:i}=await this.db.from("meal_plans").select("*").eq("id",o).single();if(i)throw i;return t}async getItems(o){let{data:t,error:i}=await this.db.from("meal_plan_items").select(`
        id, plan_id, recipe_id, planned_date, duration_days,
        recipes(id, name, image_url)
      `).eq("plan_id",o);if(i)throw i;return(t??[]).map(n=>X(K({},n),{recipe:n.recipes}))}async addItem(o,t,i,n){let{data:r,error:a}=await this.db.from("meal_plan_items").insert({plan_id:o,recipe_id:t,planned_date:i,duration_days:n}).select("id, plan_id, recipe_id, planned_date, duration_days, recipes(id, name, image_url)").single();if(a)throw a;return X(K({},r),{recipe:r.recipes})}async moveItem(o,t){let{error:i}=await this.db.from("meal_plan_items").update({planned_date:t}).eq("id",o);if(i)throw i}async resizeItem(o,t){let{error:i}=await this.db.from("meal_plan_items").update({duration_days:t}).eq("id",o);if(i)throw i}async removeItem(o,t,i){let{error:n}=await this.db.from("meal_plan_items").delete().eq("id",o);if(n)throw n;t&&i&&await this.cleanupSelectionsAfterRemoval(t,i)}async cleanupSelectionsAfterRemoval(o,t){let{data:i}=await this.db.from("recipe_ingredients").select("ingredient_id").eq("recipe_id",t);if(!i||i.length===0)return;let n=i.map(f=>f.ingredient_id),{data:r}=await this.db.from("meal_plan_items").select("recipes(recipe_ingredients(ingredient_id))").eq("plan_id",o),a=new Set;for(let f of r??[])for(let Q of f.recipes?.recipe_ingredients??[])a.add(Q.ingredient_id);let P=n.filter(f=>!a.has(f));P.length>0&&await this.db.from("shopping_selections").delete().eq("plan_id",o).in("ingredient_id",P)}async getShoppingIngredients(o,t,i){let n=this.db.from("meal_plan_items").select(`
        planned_date, duration_days, recipe_id,
        recipes(
          name,
          recipe_ingredients(
            quantity, unit_override,
            ingredients(id, name, unit, category)
          )
        )
      `).eq("plan_id",o);i&&(n=n.lte("planned_date",i));let{data:r,error:a}=await n;if(a)throw a;let P=t?(r??[]).filter(p=>{let h=p.duration_days||1,I=this.addDays(new Date(p.planned_date+"T00:00:00"),h-1);return this.toDateStr(I)>=t}):r??[],{data:f}=await this.db.from("shopping_selections").select("*").eq("plan_id",o),Q=new Map((f??[]).map(p=>[p.ingredient_id,p])),G=new Map;for(let p of P){let h=p.recipes;if(h)for(let I of h.recipe_ingredients??[]){let b=I.ingredients;if(!b)continue;let w=G.get(b.id),J=I.quantity??0,ee=Q.get(b.id);w?(w.total_quantity=(w.total_quantity??0)+J,w.sources.includes(h.name)||w.sources.push(h.name)):G.set(b.id,{ingredient_id:b.id,name:b.name,category:b.category,total_quantity:J||null,unit:I.unit_override??b.unit,checked:ee?.checked??!0,note:ee?.note??null,sources:[h.name]})}}return Array.from(G.values()).sort((p,h)=>(p.category??"z").localeCompare(h.category??"z"))}async updateSelection(o,t,i,n){let{error:r}=await this.db.from("shopping_selections").upsert({plan_id:o,ingredient_id:t,checked:i,note:n??null},{onConflict:"plan_id,ingredient_id"});if(r)throw r}getWeekStart(o=new Date){let t=new Date(o),i=t.getDay(),n=i===0?-6:1-i;return t.setDate(t.getDate()+n),t.setHours(0,0,0,0),t}toDateStr(o){let t=o.getFullYear(),i=String(o.getMonth()+1).padStart(2,"0"),n=String(o.getDate()).padStart(2,"0");return`${t}-${i}-${n}`}addDays(o,t){let i=new Date(o);return i.setDate(i.getDate()+t),i}static \u0275fac=function(t){return new(t||e)};static \u0275prov=k({token:e,factory:e.\u0275fac,providedIn:"root"})};export{Te as a,Mt as b,Je as c,Ht as d,Ee as e};
