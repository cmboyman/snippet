//------------------------------------Open Window for Update Record Filter----------------------------//
var popoutCountRow = 1;
var finds = {};
let updateStorage = {
   updateCurrency199: {
      updateObject: "Currency",
      count: 2,
      // TODO get the options, and rebuild popup showing them
      options: [
         { field: "Currency", filterBy: "contains", _searchfield_: "Dollars" },
      ],
   },
}
let filterStorage = {
   // TODO remove a filter
   filter1: {
      filteredObject: "Currency",
      count: 2,
      // TODO get the options, and rebuild popup showing them
      options: [
         { field: "Currency", filterBy: "contains", _searchfield_: "Dollars" },
      ],
   },
   filter2: { count: 4 },
};

var toolbar = function (layer, parentVal) {
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
               onChange: function (value) {
                  // passes in what the user selected
                  // add a new field
                  rebuildRow({
                     source: `group${layer + 1}`,
                     pluckedVal: value,
                     layer: layer + 1,
                  });
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
         },
         {
            view: "button",
            id: `popupUpdate${layer}`,
            label: "Update Popout",
            click: function () {
               rebuildRow({
                  source: `group${layer + 1}`,
                  // pluckedVal: value, // pass in selected data
                  layer: layer + 1,
               });
               updatePopout({ parentVal: parentVal, layer: layer }).show();
            },
            batch: "Update Record",
         },
         {
            view: "button",
            id: `popupFilter${layer}`,
            label: "Filter",
            badge: 0,
            click: function () {
               rebuildRow({
                  source: `group${layer + 1}`,
                  // pluckedVal: value, // pass in selected data
                  layer: layer + 1,
               });
               filterPopout({ layer: layer, parentVal: parentVal }).show();
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
                     source: `group${layer + 1}`,
                     // pluckedVal: value, // pass in selected data
                     layer: layer + 1,
                  });
               },
            },
         },
      ],
   };
};
var selectOperationRow = function (layer, parentVal) {
   return {
      value: "can you see me now?",
      name: "bob",
      view: "",
      rows: [
         {
            padding: 10,
            id: `group${layer}`,
            type: "clean",

            cols: [
               {
                  view: "select",
                  id: `opVal${layer}`,
                  vertical: true,
                  width: 250,
                  label: "Select",
                  value: "Choose next Operation",
                  options: [
                     "Find",
                     "First",
                     "Pluck",
                     "Update Record",
                     "Choose next Operation",
                     "Save",
                  ],
                  on: {
                     onChange: function (value) {
                        // passes in what the user selected
                        //var mode = $$(`opVal${layer}`)?.getValue();
                        if (value) $$(`tbar${layer}`)?.showBatch(value)

                        rebuildRow({
                           source: `group${layer + 1}`,
                           // pluckedVal: value, // pass in selected data
                           layer: layer + 1,
                        });
                     },
                  },
               },
               {
                  type: "clean",
                  cols: [
                     toolbar(layer, parentVal),
                     {
                        view: "icon",
                        icon: "wxi-trash",
                        click: function () {
                           // reset the field
                           rebuildRow({ source: `group${layer}`, layer: layer });
                           let toRemove = this.getParentView();
                           $$(`tbar${layer}`).removeView($$(`tbar${layer}`));
                           $$(`group${layer}`).removeView($$(`opVal${layer}`));
                        },
                     },
                  ],
               },
            ],
         },
         {
            id: `group${layer + 1}`,
            hidden: true,
            cols: [],
         },
      ],
   };
};

//----------------------------------------------------------------//
// start field update popout
var fieldUpdateOptions = function (field,id) {
   return {
      // batch "1" is visible initially
      view: "toolbar",
      type: "clean",
      name:`updateOption${id}`,
      id: `updateOption${id}`,
      visibleBatch: "Custom",
      cols: [
         {
            view: "text",
            // label: "Custom",
            name: `Custom${id}`,
            placeholder: "Type here..",
            batch: "Custom",
            // label: "Custom value:"
         },
         {
            view: "text",
            // label: "Script",
            name: `Script${id}`,
            placeholder: "Code here..",
            batch: "Script",
            // label: "Custom value:"
         },
         {
            view: "richselect",
            name: `richselect${id}`,
            batch: "From Process",
            // label: 'Field:',
            //value: 1,
            options: [
               { id: 1, value: "One" },
               { id: 2, value: "Two" },
               { id: 3, value: "Three" },
            ],
         },
      ],
   };
};
var fieldUpdateSelector = function (field, id) {
   debugger
   field = typeof( field) === ("String") ? field: field.value
   return {
      // name:"updateType",
      // cols: [
         // {
            view: "select",
            id: `updateType${field}`,
            name: `updateType${field}${id}`,
            vertical: true,
            width: 100,
            //label: "Select",
            value: "Custom",
            options: ["Custom", "Script", "From Process"],
            on: {
               onChange: function (value) {
                  // Update options to match what the user selected
                  if (value) $$(`updateOption${id}`)?.showBatch(value);
               },
            },
         // },
         //{
            // type: "clean",
            // name:"scrollBy",
            // cols: [
               // show the options
               fieldUpdateOptions(field,id)//,
            // ],
         //},
      // ],
   };
};

var filterSelector = function (field,id) {
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
               "contains",
               "doesn't contain",
               "is",
               "is not",
               "*is empty",
               "*is not empty",
               "*By Query Field",
               "*Not By Query Field",
            ],
            on: {
               onChange: function (value) {
                  // Update options to match what the user selected
                  if (value) $$(`updateOption${id}`)?.showBatch(value);
               },
            },
         },
         {
            view: "text",
            width: 200,
            value: "",
         },
         {
            type: "clean",
            cols: [
               // show the options
               fieldUpdateOptions(field,id),
            ],
         },
      ],
   };
};

var updatePopout = function (data) {
   data.options = data.options || selectSource.options;
   var popoutCountRow = 0;
   var optionRow = function (id) {
      return {
         // default row
         id: "source",
         view: "select", // label: "set",
         name: `source${id}`,
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
                  fieldUpdateOptions("field",popoutCountRow),
                  // add new fields to update
                  {
                     view: "icon",
                     icon: "wxi-plus",
                     click: function () {
                        popoutCountRow++;
                        webix.message(popoutCountRow);
                        $$("update_form").addView(
                           {
                              view: "layout",
                              // name: `row${popoutCountRow}`,
                              cols: [
                                 optionRow(popoutCountRow), //
                                 fieldUpdateSelector(data.options[0], popoutCountRow),
                                 fieldUpdateOptions("field",popoutCountRow),
                                 {
                                    view: "icon",
                                    icon: "wxi-trash",
                                    click: function () {
                                       popoutCountRow--;

                                       webix.message(popoutCountRow);
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
                        webix.message(popoutCountRow);
                        $$(`popupUpdate${data.layer}`).config.badge = popoutCountRow;
                        for (let index = 0; index <= popoutCountRow; index++) {
                           let searchIndex = `updateOption${index}`//
                           console.log("🚀 ~ file: querytask.js ~ line 378 ~ updatePopout ~ ", $$(searchIndex).getValues())
                        }
                        console.log("🚀 ~ file: querytask.js ~ line 334 ~ updatePopout ~ .getValues()", $$("update_form").getValues())

                        //  $$(`popupUpdate${data.layer}`).refresh();
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
}; // end field update popout
//----------------------------------------------------------------//

var filterPopout = function (data) {
   data.options = data.options || selectSource.options;
   var thisFilterId = `filter${data.parentVal}${data.layer}`;
   var newFilter = {};
   var oldFilter = filterStorage[thisFilterId]


   var filterRowCount = 1;

   var filterOptionRow = function () {
      return {
         view: "select",
         name: "set",
         options: data.options,
         on: {
            c: function (newValue, oldValue) {
               // Update fieldUpdateSelector to match what the user selected
               if (newValue) $$(`updateType${oldValue}`)?.removeView(value);
               this.getParentView().addView(filterSelector(value,filterRowCount));
            },
         },
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
      head: "Filter",
      body: {
         view: "form",
         id: "update_form",
         elements: [
            {
               cols: [
                  filterOptionRow(),
                  filterSelector(data.options[0], filterRowCount, data.options),

                  // add new fields to update
                  {
                     view: "icon",
                     icon: "wxi-plus",
                     click: function () {
                        filterRowCount++;
                        $$("update_form").addView(
                           {
                              view: "layout",
                              cols: [
                                 filterOptionRow(),
                                 filterSelector(data.options[0], filterRowCount, data.options),

                                 {
                                    view: "icon",
                                    icon: "wxi-trash",
                                    click: function () {
                                       filterRowCount--;
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
                        //  define new object
                        //  let thisFilterId = `filter${data.parentVal}${data.layer}`;
                        //  let newFilter = {};
                        newFilter[thisFilterId] = {
                           filteredObject: data.parentVal,
                           count: filterRowCount, // how many rows there are. used for badge
                           // TODO save row values in parent
                           options: {}, // each row
                        };

                        // update button
                        $$(`popupFilter${data.layer}`).config.badge = filterRowCount;
                        $$(`popupFilter${data.layer}`).refresh();

                        // if exists, use
                        if (filterStorage[thisFilterId]) {
                           filterStorage[thisFilterId] = newFilter; // our new data;
                        } else {
                           // else create new

                           // set it in the storage
                           filterStorage = {
                              ...filterStorage,
                              ...newFilter,
                           };
                        }
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
         rebuildRow({ layer: "0", newData: newv, source: "group0" });
      },
   },
};

var selectSource_filters = {
   view: "select",
   id: "select_filter",
   name: "select_filter",
   options: [
      { value: "contains" },
      { value: "doesn't contain" },
      { value: "is" },
      { value: "is not" },
      { value: "*is empty" },
      { value: "*is not empty" },
      { value: "*By Query Field" },
      { value: "*Not By Query Field" },
   ],
   width: 250,
   on: {
      onChange: function (newv, oldv, config) { },
   },
};
//------------------Select List------------------------//
var form1 = {
   view: "form",
   id: "main",
   name: "main",

   rows: [
      { view: "text", value: "example", name: "tname", label: "*Name" },

      selectSource,
      selectOperationRow(0, "Currency"), // ! hard coding the selected value here, fix this
   ],
};

//----------------------------------------------------------------//
 /*
  * parameters:
  * { layer: "0", // string int
  * newData: newv, // new view
  * source: "group0" }
 */
function rebuildRow(formData) {
   // TODO 
   removeRow(formData.layer+1);//
   // replace source with a a row built from newdata
   webix.ui(
      selectOperationRow(formData.layer, formData.newData),
      $$(formData.source)
   );
}
function removeRow(layer) {
   if($$(`group${layer}`)){
      removeRow(layer+1); // recursively remove
      // find the group_ view, get parent, then remove from parent 
      $$(`group${layer}`).getParentView().removeView(`group${layer}`);
   }

}
webix.ui({
   id: "log_form",
   rows: [
      form1,
      {
         view: "layout",
         id: "d1",
         hidden: true,
         cols: [
            {
               view: "text",
               label: "set",
               name: "set",
               width: 250,
               align: "center",
            },
            { view: "text", label: "to", name: "to", width: 250, align: "center" },
            {
               view: "icon",
               icon: "wxi-trash",
               click: function () {
                  let toRemove = this.getParentView();
                  this.getParentView().getParentView().removeView(toRemove);
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
               value: "OK",
               css: "webix_primary",
               click: function () {
                  console.log($$("main").getValues());
                  // var check_select = $$("select2").getValue();
                  // if (check_select == "update record")
                  //  // TODO save button here
                  // //  $$("left").setHTML("<pre>"+ JSON.stringify( $$("sets").getValues() , null, "\t") + "</pre>");
                  // if (check_select == "pluck")
                  //    pluckWin.show();
               },
            },
            { view: "button", value: "Cancel" },
            {},
         ],
      },
   ],
});
