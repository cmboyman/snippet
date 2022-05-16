
//-------- Tools used to communicate between layers and rows --//
// --- tools used to push data into the form
/*
 * @params
 * value: value selected or input by user
 * targetName: object row is going to act upon (?)
 * layer: order in which this should be run
 * 
 * @return null
*/
function pushValuesUpToMain(value, targetName, layer) {
   let setValues = {}
   // ! feel free to change this for it to match the AB structure
   setValues[`rowLayer.${layer}.taskParam`] = value;
   setValues[`rowLayer.${layer}.field`] = targetName;
   // TODO push the object ID here as well
   if (value) $$("main").setValues(setValues, true); // true here to not overwrite everything
}
/*
 * @params
 * value: value selected or input by user
 * targetName: object row is going to act upon (?)
 * layer: order in which this should be run
 * 
 * @return null
*/
function pushValuesTo(value, targetName, layer, myParentForm){
   let setValues = {}
   // ! feel free to change this for it to match the AB structure
   setValues[`rowLayer.${layer}.taskParam`] = value;
   setValues[`rowLayer.${layer}.field`] = targetName;
   if (value) $$(`${myParentForm}`)?.setValues(setValues, true); // true here to not overwrite everything
}
// end tools

var baseToolbar = function (layer, parentVal) {
   return {
      // batch "1" is visible initially
      view: "toolbar",
      type: "clean",
      id: `tbar${layer}`,
      visibleBatch: "Choose next Operation",
      cols: [
         {
            batch: "Choose next Operation",
         },
         {
            view: "richselect",
            batch: "Pluck",
            label: "Field:",
            //value: 1,
            // generate this list based off of parentVal
            options: selectSource.options,
            on: {
               // TODO don't wipe next row if it is updated Find
               // TODO don't wipe next row if it is updated Update

               onChange: function (value) {
                  // passes in what the user selected
                  // add a new field
                  // rebuildRow({
                  //    source: `rowLayer.${layer + 1}`,
                  //    pluckedVal: value,
                  //    layer: layer + 1,
                  // });
                  pushValuesUpToMain(value, 'rowLayer', layer);
               },
            },
         },
         {
            view: "text",
            label: "Name",
            name: "name",
            placeholder: "Type here..",
            width: 440,
            batch: "Save",
            label: "Variable:",
            on: {
               onChange: function (value) {
                  pushValuesUpToMain(value, 'rowLayer', layer)
               },
            },
         },
         {
            view: "button",
            id: `popupUpdate${layer}`,
            label: "Update Popout",
            click: function () {
               // rebuildRow({
               //    source: `rowLayer.${layer + 1}`,
               //    // pluckedVal: value, // pass in selected data
               //    layer: layer + 1,
               // });
               webix.confirm({
                  title:"Continue?",
                  ok:"Yes", cancel:"No",
                  text:"changing this rule will reset any following rules."
                })
                  .then(function(){                   
                     updatePopout({ parentVal: parentVal, layer: layer }).show();
               })
                    .fail(function(){
                  
               });  

               
            },
            batch: "Update Record",
         },
         {
            view: "button",
            id: `popupFilter${layer}`,
            label: "Filter",
            click: function () {
               // TODO
               // rebuild IF NOt Exist
               // check if exist, else rebild?
              // debugger
               
               // rebuildRow({
               //    source: `rowLayer.${layer + 1}`,
               //    // pluckedVal: value, // pass in selected data
               //    layer: layer + 1,
               // });

               filterPopout({ parentVal: parentVal, layer: layer }).show();
                
               // // fill
               // let mainValues = $$("main").getValues()
               // if( mainValues.rowLayer[layer].taskParam){
               //    // debugger
               //    $$(update_form).setValues(mainValues.rowLayer[data.layer].taskParam)
               // }
            },
            batch: "Find",
         },
         {
            label: "First",
            batch: "First",
            on: {
               show: function (value) {
                  // ! this needs to take the current data and limits it to the first record
                  //! This hopefully increases performance???
                  // TODO get current data and select first
                  // add a new row
                  rebuildRow({
                     source: `rowLayer.${layer + 1}`,
                     // pluckedVal: value, // pass in selected data
                     layer: layer + 1,
                  });
                  // save that first was selected on the main form
                  pushValuesUpToMain("first", 'rowLayer', layer)
               },
            },
         },
      ],
   };
};
var baseOperationRow = function (layer, parentVal) {
   return {
      rows: [
         {
            padding: 10,
            id: `rowLayer.${layer}`,
            type: "clean",         
            cols: [                  
               {
                  name: `rowLayer.${layer}.key`,
                  view: "select",
                  id: `opVal${layer}`,
                  vertical: true,
                  width: 250,
                  value: "Choose next Operation",
                  options: [
                     "Choose next Operation",
                     "Find",
                     "First",
                     "Pluck",
                     "Update Record",
                     "Save",
                  ],
                  on: {
                     onChange: function (value) {
                        // passes in what the user selected
                        //var mode = $$(`opVal${layer}`)?.getValue();
                        if (value) $$(`tbar${layer}`)?.showBatch(value)

                        rebuildRow({
                           source: `rowLayer.${layer + 1}`,
                           // pluckedVal: value, // pass in selected data
                           layer: layer + 1,
                        });
                     },
                  },
               },
               {
                  type: "clean",
                  borderless:true,
                  cols: [
                     baseToolbar(layer, parentVal),
                     {

                     },
                  ],
               },
            ],
         },
         {
            id: `rowLayer.${layer + 1}`,
            hidden: true,
            cols: [],
         },
      ],
   };
};

//--------------------------update--------------------------------------//
// start field update popout
// new value
var fieldUpdateOptions = function (field, layer) {
   return {
      // batch "1" is visible initially
      view: "toolbar",
      type: "clean",
      borderless:true,
      name: `updateOption${layer}`,
      id: `updateOption${layer}`,
      visibleBatch: "Custom",
      cols: [
         {
            view: "text",
            name: `Custom${layer}`,
            placeholder: "Type here..",
            batch: "Custom",
            on: {
               onChange: function (value) {
                  // passes up to popup window what the user selected
                  pushValuesTo(value, field, layer, "update_form");
               },
            },
         },
         {
            view: "text",
            // label: "Script",
            name: `Script${layer}`,
            placeholder: "Code here..",
            batch: "Script",
            // label: "Custom value:"
            on: {
               onChange: function (value) {
                  // passes up to popup window what the user selected
                  pushValuesTo(value, field, layer, "update_form");
               },
            },
         },
         {
            view: "richselect",
            name: `richselect${layer}`,
            batch: "From Process",
            // TODO use process data here
            options: [
               { id: 1, value: "One" },
               { id: 2, value: "Two" },
               { id: 3, value: "Three" },
            ],
            on: {
               onChange: function (value) {
                  // passes up to popup window what the user selected
                  pushValuesTo(value, field, layer, "update_form");
               },
            },
         },
      ],
   };
};
// type of update todo
var fieldUpdateSelector = function (field, layer) {
   field = typeof (field) === ("String") ? field : field.value
   return (
      {
         view: "select",
         id: `updateType${field}`,
         name: `updateType${field}${layer}`,
         vertical: true,
         width: 100,
         value: "Custom",
         options: ["Custom", "Script", "From Process"],
         on: {
            onChange: function (value) {
               // Update options to match what the user selected
               if (value) $$(`updateOption${layer}`)?.showBatch(value);
            },
         },
      }
   );
};
// popup and row builder

// Find select option column 2

var findUpdateSelector = function (field, layer) {
   //webix.message(layer)
   field = typeof (field) === ("String") ? field : field.value
   return (
      {
         view: "toolbar",
         type: "clean",
         borderless:true,
         id: `findupdateType${layer}`,
         name: `findupdateType${layer}`,
         visibleBatch: "Title",
         cols: [
            {
          
               view: "select",
               name: `Title${layer}`,
               batch: "Title",
               options: [
                  { id: 1, value: "equals" },
                  { id: 2, value: "does not equal" },
               ], 
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },                  
            
            },
            {
               view: "select",
               name: `Title${layer}`,
               batch: "Title",
               options: [
                  { id: 0, value: ""},
                  { id: 1, value: "Mr." },
                  { id: 2, value: "Mrs." },
                  { id: 3, value: "Miss" },
                  { id: 4, value: "Dr." },
                  { id: 5, value: "Rev." },               
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               },   
            },
            {
               view: "select",
               name: `Firstname${layer}`,
               batch: "First Name",
               options: [
                  { id: 1, value: "contains" },
                  { id: 2, value: "*doesn't contain" },
                  { id: 3, value: "is" },
                  { id: 4, value: "is not" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },   
            },
            {
               view: "text",     
               name: `Firstname${layer}`,        
               placeholder: "Type here..",          
               batch: "First Name",
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               }, 
            },
   
            {
               view: "select",
               name: `Surename${layer}`,
               batch: "Surename",
               options: [
                  { id: 1, value: "contains" },
                  { id: 2, value: "*doesn't contain" },
                  { id: 3, value: "is" },
                  { id: 4, value: "is not" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },   
            },
            {
               view: "text",     
               name: `Surename${layer}`,        
               placeholder: "Type here..",          
               batch: "Surename",
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               }, 
            },
            {
               view: "select",
               name: `Gender${layer}`,
               batch: "Gender",
               options: [
                  { id: 1, value: "equals" },
                  { id: 2, value: "does not equal" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },   
   
            },
   
            {
               view: "select",
               name: `Gender${layer}`,
               batch: "Gender",
               options: [
                  { id: 0, value: "" },
                  { id: 1, value: "Male" },
                  { id: 2, value: "Female" },   
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               }, 
            },
            {
               view: "select",
               name: `BirthDate${layer}`,
               batch: "Birth Date",
               options: [
                  { id: 1, value: "is before" },
                  { id: 2, value: "is after" },
                  { id: 3, value: "is on or before" },
                  { id: 4, value: "is on or after" },
                  { id: 5, value: "*is before current date" },
                  { id: 6, value: "*is after current date" },
                  { id: 7, value: "*is on or before current" },
                  { id: 8, value: "*is on or after current" },
                  { id: 9, value: "*last...days" },
                  { id: 10, value: "*next...days" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },   
     
            },
            {
               view:"datepicker",
               name: `BirthDate${layer}`,
               batch: "Birth Date",
               inputWidth:120,   
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               },          
             },
            {
               
               view: "richselect",
               name: `Family${layer}`,
               batch: "Family",
               options: [
                  { id: 1, value: "*In Query" },
                  { id: 2, value: "*Not In Query" },
                  { id: 3, value: "*Same As User" },
                  { id: 4, value: "*Not Same As User" },
                  { id: 5, value: "*In Data Collection" },
                  { id: 6, value: "*Not In Data Collection" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     if (value) $$(`updateOption${layer}`)?.showBatch(value);
                  },
               },   
            },
            {
               view:"checkbox", 
               name: `Active${layer}`,
               batch:"Active", 
               value:1,
               uncheckValue:"Not Active", 
               checkValue:"Active",              
              on:{
               onChange:function(value){               
                 var getValchk = this.getValue();
                  pushValuesTo(getValchk, field, layer, "update_form");                                  
               }
             }
            },
            {
             
               view: "richselect",
               name: `Family${layer}`,
               batch: "Family",
               options: [
                  { id: 1, value: "Smith" },
                  { id: 2, value: "Johnson" },
                  { id: 3, value: "Perry" },
                  { id: 4, value: "Jones" },
                  { id: 5, value: "Baxter" },
                  { id: 6, value: "Hunt" },
               ],
               on: {
                  onChange: function (value) {
                     // Update options to match what the user selected
                     pushValuesTo(value, field, layer, "update_form");
                  },
               }, 
               
            }
       
   
         ],
      }
   );
};

var updatePopout = function (data) {
   data.options = data.options || selectSource.options;
   var popoutCountRow = 1;
   // what value to update
   var optionRow = function (layer) {
      return {
         // default row
         id: "source",
         view: "select", // label: "set",
         name: `source.${layer}`,
         options: selectSource.options,
      };
   };
   return webix.ui({
      view: "window",
      modal: true,
      position: "top",
      width: 600,
      height: 800,
      close: true,
      css: "mywin",
      head: `Update ${data.parentVal}`,
      body: {
         view: "form",
         id: "update_form",
         name: "update_form",
         elements: [
            {
               cols: [
                  optionRow(popoutCountRow),
                  fieldUpdateSelector(data.options[0], popoutCountRow),
                  fieldUpdateOptions("field", popoutCountRow),
                  // add new fields to update
                  {
                     view: "icon",
                     icon: "wxi-plus",
                     click: function () {
                        popoutCountRow++;
                        
                        $$("update_form").addView(
                           {
                              // name: `row${popoutCountRow}`,
                              cols: [
                                 optionRow(popoutCountRow), //
                                 fieldUpdateSelector(data.options[0], popoutCountRow),
                                 fieldUpdateOptions("field", popoutCountRow),
                                 {
                                    view: "icon",
                                    icon: "wxi-trash",
                                    click: function () {
                                       popoutCountRow--;

                                     //  webix.message(popoutCountRow);
                                       let toRemove = this.getParentView();
                                       this.getParentView()
                                          .getParentView()
                                          .removeView(toRemove);
                                    },
                                 },
                              ],
                           },
                           1
                        );
                     },
                  },
               ],
            },
            {
               margin: 5,
               cols: [
                  {},
                  {
                     view: "button",
                     value: "Save",
                     css: "webix_primary",
                     click: function () {
                        // webix.message(popoutCountRow);

                              $$(`popupUpdate${data.layer}`).config.badge = popoutCountRow;
                              $$(`popupUpdate${data.layer}`).refresh();
                          
                              console.log("🚀 ~ file: querytask.js ~ line 334 ~ updatePopout ~ .getValues()", $$("update_form").getValues())
  
                              let formValues = $$("update_form").getValues();
  
                              //value, targetName, layer
                                pushValuesUpToMain(formValues, data.parentVal, data.layer)
                              //value, targetName, layer, myParentForm
                              // ! Can't store data in button for some reason
                              // pushValuesTo(formValues, data.parentVal, data.layer, `popupUpdate${data.layer}`)
                              // pushValuesTo(formValues, data.parentVal, data.layer, `rowLayer.${data.layer}.operationType.select`)
                              // pushValuesTo(formValues, data.parentVal, data.layer, `opVal${data.layer}`)
             
                              this.getParentView().getParentView().getParentView().hide();
     
                     },
                  },
                  {
                     view: "button",
                     value: "Cancel",
                     click: function () {
                        this.getParentView().getParentView().getParentView().hide();
                     },
                  },
                  {},
               ],
            },
         ],
      },
   });
}; 
// end field update popout
//--------------------filter--------------------------------------------//
//------------------------------------Open Window for Update Record Filter----------------------------//

// start filter
// how to filter it
var filterSelector = function (field, id) {
   return {
      cols: [
         {
            view: "select",
            id: `updateType${field}${id}`,
            vertical: true,
            width: 200,
            label: "",
            value: "Custom",
            options: [
               { id: 1, value: "contains"},
               { id: 2, value: "doesn't contain"},
               { id: 3, value: "is"},
               { id: 4, value: "is not"},
               { id: 5, value: "*is empty"},
               { id: 6, value: "*is not empty"},
               { id: 7, value: "*By Query Field"},
               { id: 8, value: "*Not By Query Field"},
            ],
            on: {
               onChange: function (value) {
               //   webix.message(value);
                  // Update options to match what the user selected
               //   if (value) $$(`updateOption${id}`)?.showBatch(value);
                 // pushValuesTo(value, field, id, "update_form");
               },
            },
         },
         {
            view: "text",
            id: "AddNewFilter",
            name: "AddNewFilter",
            width: 200,
            value: "",
         },
         {
            type: "clean",
            cols: [
               // show the options
               fieldUpdateOptions(field, id),
            ],
         },
      ],
   };
};
var filterPopout = function (data) {
   data.options = data.options || selectfindfilters.options;
   var thisFilterId = `filter${data.parentVal}${data.layer}`;

   // get if exists
   var findpopoutCountRow = 0;
   let mainValues = $$("main").getValues()
    
   var filterOptionRow = function () {
      return {
         view: "select",   
         name: "set",
         options: data.options,
         on: {
            c: function (newValue, oldValue) {
               // Update fieldUpdateSelector to match what the user selected
               if (newValue) $$(`updateType${oldValue}`)?.removeView(value);
               this.getParentView().addView(selectfindfilters(value, findpopoutCountRow));
               pushValuesTo(value, field, layer, "update_form");
               
            },
         },
      };
   };

   var findOptionRow = function (layer) {
      //webix.message(layer)
      return {
         // default row
         id: "source",
         view: "select", // label: "set",
         name: `source.${layer}`,
         options: selectfindfilters.options,
         on: {
            onChange: function (value) {
               //todo change the rest of the row to match the type       
              // pushValuesTo(newv, field, layer, "update_form");
    
              if (value) $$(`findupdateType${layer}`)?.showBatch(value);         
        
             },
         },
      };
   };
   /// here, create first half of elements
   // [{},{},{}]
   var elementsTempate = [ {
      cols: [
         findOptionRow(findpopoutCountRow),
         findUpdateSelector(data.options[0], findpopoutCountRow),
         // add new fields to update
         {
            view: "icon",
            icon: "wxi-plus",
            click: function () {
               findpopoutCountRow++;
               addRow()
            },
         },
      ],
   },]
   // debugger
   // if( mainValues.rowLayer[data.layer].taskParam){
   //    var oldFilter = mainValues.rowLayer[data.layer].taskParam;

   //    // iterate throuhg:
   //    // source and rowlayer
   //    for (let index = 0; Boolean(oldFilter.source[index]); index++) {
   //       // const rowlayer = oldFilter?.rowlayer[index];
   //       const source = oldFilter?.source[index];
   //       // make the rows using this
   //       if(index){
   //          // after first, add another row
   //         elementsTempate.push({
   //          view: "layout",
   //          cols: [
   //             findOptionRow(findpopoutCountRow),
   //             findUpdateSelector(data.options[0], findpopoutCountRow),
           
   //             {
   //                view: "icon",
   //                icon: "wxi-trash",
   //                click: function () {
   //                   findpopoutCountRow--;
   //                   let toRemove = this.getParentView();
   //                   this.getParentView()
   //                      .getParentView()
   //                      .removeView(toRemove);
   //                },
   //             },
   //          ],
   //       })
   //       }
   //    }
   // }
   // push rest of elements
   elementsTempate.push({
      margin: 5,
      cols: [
         {},
         {
            view: "button",
            value: "Save",
            css: "webix_primary",
            click: function () {
               //  define new object
               // newFilter[thisFilterId] = {
               //    filteredObject: data.parentVal,
               //    count: findpopoutCountRow, // how many rows there are. used for badge
               //    options: {}, // each row
               // };
             
               // update button
               // ? should the value also be saved in the button?
               $$(`popupFilter${data.layer}`).config.badge = ++findpopoutCountRow;
               $$(`popupFilter${data.layer}`).refresh();
               
               console.log("🚀 ~ file: querytask.js ~ line 334 ~ updatePopout ~ .getValues()", $$("update_form").getValues())
               let findformValues = $$("update_form").getValues();

               //value, targetName, layer
               pushValuesUpToMain(findformValues, data.parentVal, data.layer)

               // save row values in parent
               // pushValuesUp(value, targetName, layer)
             //  pushValuesUpToMain(newFilter, data.parentVal, data.layer)

               // ? is there a better way to get the popup?
               this.getParentView().getParentView().getParentView().hide();
            },
         },
         {
            view: "button",
            value: "Cancel",
            click: function () {
               this.getParentView().getParentView().getParentView().hide();
            },
         },
         {},
      ],
   })


   var newFilter = {};
   
 

   

   function addRow(){
      $$("update_form").addView(
         {
            view: "layout",
            cols: [
 
               findOptionRow(findpopoutCountRow),
               findUpdateSelector(data.options[0], findpopoutCountRow),
           
               {
                  view: "icon",
                  icon: "wxi-trash",
                  click: function () {
                     findpopoutCountRow--;
                     let toRemove = this.getParentView();
                     this.getParentView()
                        .getParentView()
                        .removeView(toRemove);
                  },
               },
            ],
         },
         1
      );
   }

   return webix.ui({
      view: "window",
      modal: true,
      position: "top",
      borderless:true,
      width: 600,
      height: 800,
      close: true,
      css: "mywin",
      head: "Filter",
      body: {
         view: "form",
         id: "update_form",
         name: "update_form",
         elements: elementsTempate,
         // elements: [
         // ],
      },
   });
};

//----------------------------------Pluck window----------------------//
var pluckWin = webix.ui({
   view: "window",
   modal: true,
   position: "top",
   width: 600,
   height: 800,
   close: true,
   css: "mywin",
   head: "Pluck Window",
   body: {
      view: "form",
      id: "pluck_form",
      elements: [
         {
            cols: [
               {
                  view: "select",
                  label: "Fields",
                  name: "Fields",
                  options: [
                     { value: "one" },
                     { value: "two" },
                     { value: "three" },
                     { value: "four" },
                  ],
                  width: 250,
               },
               {
                  view: "text",
                  label: "Save",
                  name: "Save",
                  width: 250,
                  align: "center",
               },
               {
                  view: "button",
                  label:
                     "" +
                     '<font size="5px"><i class="fa-solid fa-circle-plus" aria-hidden="true"></i></font>',
                  click: function () {
                     $$("pluck_form").addView(
                        {
                           view: "layout",
                           cols: [
                              {
                                 view: "select",
                                 label: "Fields",
                                 name: "Fields",
                                 width: 250,
                                 align: "center",
                                 options: [
                                    { value: "one" },
                                    { value: "two" },
                                    { value: "three" },
                                    { value: "four" },
                                 ],
                                 width: 250,
                              },
                              {
                                 view: "text",
                                 label: "Save",
                                 name: "Save",
                                 width: 250,
                                 align: "center",
                              },
                              {
                                 view: "icon",
                                 icon: "wxi-trash",
                                 click: function () {
                                    let toRemove = this.getParentView();
                                    this.getParentView()
                                       .getParentView()
                                       .removeView(toRemove);
                                 },
                              },
                           ],
                        },
                        1
                     );
                  },
               },
            ],
         },
         {
            margin: 5,
            cols: [
               {},

               {
                  view: "button",
                  value: "Save",
                  css: "webix_primary",
                  click: function () {
                     pluckWin.hide();
                  },
               },
               {
                  view: "button",
                  value: "Cancel",
                  click: function () {
                     pluckWin.hide();
                  },
               },
               {},
            ],
         },
      ],
   },
});

var selectSource = {
   view: "select",
   id: "select1",
   name: "select1",
   label: "Object",
   options: [
      { value: "Currency" },
      { value: "Expense Source" },
      { value: "Ministry Team" },
      { value: "Country" },
      { value: "Expense Subcategory" },
      { value: "Journal" },
      { value: "Languages" },
      { value: "Fiscal Month" },
      { value: "Donation " },
      { value: "Default Settings" },
      { value: "Report Item" },
      { value: "Dashboard Data" },
      { value: "Feedback" },
      { value: "QX Center" },
      { value: "Entity" },
      { value: "del" },
      { value: "Receipt" },
      { value: "Project Funding" },
      { value: "Role" },
      { value: "City" },
      { value: "Expense Report" },
      { value: "Social Media" },
      { value: "Family" },
      { value: "(?)Staff Donation" },
      { value: "Insurance Information" },
      { value: "Grades" },
      { value: "Fiscal Year" },
      { value: "Income Source" },
      { value: "Team Assignments (key)" },
      { value: "Project - Budgeting" },
      { value: "Phone" },
      { value: "Journal Entry" },
      { value: "Donor Team" },
      { value: "Grades" },
      { value: "Address" },
      { value: "System Check" },
      { value: "Advance" },
      { value: "Usable Balance" },
      { value: "Donor" },
      { value: "Account" },
      { value: "Emergency Contact" },
      { value: "Worker Information" },
      { value: "Email" },
      { value: "JE Archive" },
      { value: "Scope" },
      { value: "HR team link (key)" },
      { value: "Project Income" },
      { value: "Year" },
      { value: "Team" },
      { value: "Platform" },
      { value: "Balance" },
      { value: "Account - COA" },
      { value: "Role" },
      { value: "Responsibility Center" },
      { value: "Exchange Rate" },
      { value: "Leave Request" },
      { value: "Course" },
      { value: "MCC" },
      { value: "Team Assignments" },
      { value: "Person - Profile" },
      { value: "Leave Request 2" },
      { value: "Cash Account" },
      { value: "Account Transfer" },
      { value: "User Leave" },
      { value: "Year del me" },
      { value: "Project Expense" },
      { value: "Expense" },
      { value: "Budget" },
      { value: "Batch" },
      { value: "Moderator" },
      { value: "IE Category" },
   ],
   on: {
      onChange: function (newv, oldv, config) {
         // rebuild the first row
         rebuildRow({ layer: "0", newData: newv, source: "rowLayer0" });
      },
   },
};
//---------First Field Find Filters Example-------------------------//
const exampleObjects = {
   Family:[
      "The Duncans", 'The Poolmans'
   ]
}

var selectfindfilters = {
   view: "select",
   id: "select2",
   name: "select2",
   options: [
      { value: "Title", type:"text" },
      { value: "First Name" },
      { value: "Surename" },
      { value: "Gender",type:"select" },
      { value: "Birth Date",type:"date" },
      { value: "Active", type:"checkbox"},
      { 
         // show object
         // also show additional options...?
         value: "Family",type:"connectedObject", objectID:"Family"
      }, 
   ],
   width: 100,
   on: {
      onChange: function (value) {
       
         //todo change the rest of the row to match the type       
        // pushValuesTo(newv, field, layer, "update_form");
     
        if (value) $$(`findupdateType${layer}`)?.showBatch(value);         
  
       },
   },
};

//------------------Select List------------------------//
var form1 = {
   view: "form",
   id: "main",
   name: "main",
   complexData:true,

   elements: [
      // Query task name
      { view: "text", value: "example", name: "tname", label: "Name" },
      // select which object is first used in this querytask
      selectSource,
      // first task 
      baseOperationRow(0, "Currency"), // ! hard coding the selected value here, fix this
   ],
};

//--------------------------tools to update other rows--------------------------------------//
/*
* parameters:
* { layer: "0", // string int
* newData: newv, // new view
* source: "rowLayer0" }
*/
function rebuildRow(formData) {
  // debugger
   // TODO 
 //  removeRow(formData.layer + 1);//
   // replace source with a a row built from newdata
   webix.ui(
      baseOperationRow(formData.layer, formData.newData),
      $$(formData.source)
   );
}
function removeRow(layer) {
   if ($$(`rowLayer.${layer}`)) {
      removeRow(layer + 1); // recursively remove
      // find the rowLayer_ view, get parent, then remove from parent 
      $$(`rowLayer.${layer}`).getParentView().removeView(`rowLayer.${layer}`);
   }
}
// end tools

webix.ui({
   id: "log_form",
   rows: [
      form1,
      {
         margin: 5,
         cols: [
            {
               view: "button",
               value: "OK",
               css: "webix_primary",
               click: function () {
                  console.log($$("main").getValues());
                  // console.log($$("update_form").getValues());
                  // var check_select = $$("select2").getValue();
                  // if (check_select == "update record")
                  //  // TODO save button here
                  // //  $$("left").setHTML("<pre>"+ JSON.stringify( $$("sets").getValues() , null, "\t") + "</pre>");
                  // if (check_select == "pluck")
                  //    pluckWin.show();
               },
            },
            { view: "button", value: "Cancel" }
         ],
      },
   ],
});